// Serves M19's Yandex Maps reviews to the app.
//
// Yandex doesn't offer a public reviews API, but the org's public reviews
// page server-renders the review data as embedded JSON (window state used
// to hydrate their React app) — so this fetches that page directly and
// pulls the JSON out, instead of relying on a third-party scraper.
//
// To keep from re-fetching Yandex on every app open, results are cached in
// the `yandex_reviews` table and only refreshed once per CACHE_TTL_MS. If a
// refresh fails (Yandex changed their markup, rate-limited us, etc.) we
// still serve whatever we last had cached.
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const YANDEX_REVIEWS_URL =
  Deno.env.get('YANDEX_REVIEWS_URL') ?? 'https://yandex.uz/maps/org/m19/204967204178/reviews/';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_REVIEWS = 20;
const REVIEW_ARRAY_MARKER = '"reviewResults":{"reviews":[';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface YandexReview {
  reviewId: string;
  author?: { name?: string; avatarUrl?: string };
  text?: string;
  rating?: number;
  updatedTime?: string;
  reactions?: { likes?: number };
  businessComment?: { text?: string; updatedTime?: string };
}

interface NormalizedReview {
  yandex_id: string;
  author: string;
  rating: number;
  text: string;
  review_date: string;
  author_avatar_url: string | null;
  likes_count: number;
  owner_reply: string | null;
  owner_reply_date: string | null;
}

// Pulls out the `reviewResults.reviews` JSON array embedded in the page's
// HTML by scanning from its opening `[` and tracking bracket depth (while
// respecting quoted strings) until the matching `]`, since the array can't
// be reliably captured with a regex alone.
function extractReviewsArray(html: string): YandexReview[] | null {
  const markerIdx = html.indexOf(REVIEW_ARRAY_MARKER);
  if (markerIdx === -1) return null;

  const start = markerIdx + REVIEW_ARRAY_MARKER.length - 1; // index of '['
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === '\\') escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === '[') {
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function extractAggregateRating(html: string): { value: number; count: number } | null {
  const valueMatch = html.match(/itemProp="ratingValue" content="([\d.]+)"/);
  if (!valueMatch) return null;
  const countMatch = html.match(/itemProp="ratingCount" content="(\d+)"/);
  const value = parseFloat(valueMatch[1]);
  const count = countMatch ? parseInt(countMatch[1], 10) : 0;
  if (!Number.isFinite(value) || !Number.isFinite(count)) return null;
  return { value, count };
}

function normalize(r: YandexReview): NormalizedReview | null {
  const text = r.text?.trim();
  if (!r.reviewId || !text) return null;

  const avatarUrl = r.author?.avatarUrl ? r.author.avatarUrl.replace('{size}', '100x100') : null;
  const reviewDate = r.updatedTime ? r.updatedTime.slice(0, 10) : new Date().toISOString().slice(0, 10);
  const ownerReplyDate = r.businessComment?.updatedTime ? r.businessComment.updatedTime.slice(0, 10) : null;

  return {
    yandex_id: r.reviewId,
    author: r.author?.name || 'Клиент Яндекс',
    rating: typeof r.rating === 'number' ? r.rating : 5,
    text,
    review_date: reviewDate,
    author_avatar_url: avatarUrl,
    likes_count: r.reactions?.likes ?? 0,
    owner_reply: r.businessComment?.text || null,
    owner_reply_date: ownerReplyDate,
  };
}

interface SyncDiagnostics {
  httpStatus: number;
  htmlLength: number;
  foundReviewsCount: number;
  normalizedCount: number;
  upsertedCount: number;
  upsertErrors: string[];
  aggregateRating: { value: number; count: number } | null;
}

async function syncFromYandex(): Promise<SyncDiagnostics> {
  const res = await fetch(YANDEX_REVIEWS_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'ru,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`Yandex fetch failed: ${res.status}`);

  const html = await res.text();
  const rawReviews = extractReviewsArray(html);
  if (!rawReviews) {
    throw new Error(
      `Could not locate review data in Yandex page (markup may have changed). httpStatus=${res.status} htmlLength=${html.length}`
    );
  }
  const aggregateRating = extractAggregateRating(html);

  const normalized = rawReviews
    .map(normalize)
    .filter((r): r is NormalizedReview => r !== null)
    .slice(0, MAX_REVIEWS);

  const upsertErrors: string[] = [];
  let upsertedCount = 0;
  for (const review of normalized) {
    const { error } = await supabase.from('yandex_reviews').upsert(review, { onConflict: 'yandex_id' });
    if (error) {
      console.error('yandex_reviews upsert failed', review.yandex_id, error);
      upsertErrors.push(`${review.yandex_id}: ${error.message}`);
    } else {
      upsertedCount++;
    }
  }

  // Only mark the sync as fresh if at least something actually landed —
  // otherwise a systemic upsert failure would lock us into serving an
  // empty cache for a full CACHE_TTL_MS before retrying. The aggregate
  // rating is independent of per-review upserts, so it updates whenever
  // we successfully parsed the page at all.
  const metaUpdate: Record<string, unknown> = {};
  if (upsertedCount > 0) metaUpdate.last_synced_at = new Date().toISOString();
  if (aggregateRating) {
    metaUpdate.rating_value = aggregateRating.value;
    metaUpdate.rating_count = aggregateRating.count;
  }
  if (Object.keys(metaUpdate).length > 0) {
    await supabase.from('yandex_reviews_sync_meta').update(metaUpdate).eq('id', true);
  }

  return {
    httpStatus: res.status,
    htmlLength: html.length,
    foundReviewsCount: rawReviews.length,
    normalizedCount: normalized.length,
    upsertedCount,
    upsertErrors,
    aggregateRating,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { data: meta } = await supabase
      .from('yandex_reviews_sync_meta')
      .select('last_synced_at, rating_value, rating_count')
      .eq('id', true)
      .maybeSingle();

    const lastSyncedAt = meta?.last_synced_at ? new Date(meta.last_synced_at).getTime() : 0;
    const isStale = Date.now() - lastSyncedAt > CACHE_TTL_MS;

    let syncDebug: SyncDiagnostics | { error: string } | null = null;
    if (isStale) {
      try {
        syncDebug = await syncFromYandex();
      } catch (err) {
        // Keep serving the last known-good cached rows below.
        const message = err instanceof Error ? err.message : String(err);
        console.error('Yandex sync failed, serving cached reviews', message);
        syncDebug = { error: message };
      }
    }

    const { data: rows, error } = await supabase
      .from('yandex_reviews')
      .select('yandex_id, author, rating, text, review_date, author_avatar_url')
      .order('review_date', { ascending: false })
      .limit(MAX_REVIEWS);

    if (error) throw error;

    // Prefer the rating this request just fetched (if it synced), otherwise
    // fall back to whatever was already cached in meta.
    const freshRating =
      syncDebug && 'aggregateRating' in syncDebug ? syncDebug.aggregateRating : null;
    const rating = freshRating
      ? freshRating
      : meta?.rating_value != null
        ? { value: Number(meta.rating_value), count: meta.rating_count ?? 0 }
        : null;

    // Surface sync diagnostics whenever we have nothing (or nothing new) to
    // show, so failures are visible without needing dashboard log access.
    const body =
      rows && rows.length > 0 ? { reviews: rows, rating } : { reviews: rows ?? [], rating, debug: syncDebug };

    return new Response(JSON.stringify(body), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('yandex-reviews function error', err);
    return new Response(
      JSON.stringify({ reviews: [], error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});
