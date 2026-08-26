import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY')!;
const YANDEX_MAPS_URL = Deno.env.get('YANDEX_MAPS_URL')!;
const MAX_REVIEWS = parseInt(Deno.env.get('MAX_REVIEWS') || '200', 10);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface ApifyReview {
  businessId: string;
  businessTitle: string;
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  authorAvatarUrl?: string;
  likesCount?: number;
  ownerReply?: string;
  ownerReplyDate?: string;
}

Deno.serve(async () => {
  try {
    const apifyResponse = await fetch(
      `https://api.apify.com/v2/acts/zen-studio~yandex-maps-reviews-scraper/run-sync-get-dataset-items?token=${APIFY_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url: YANDEX_MAPS_URL }],
          maxReviewsPerPlace: MAX_REVIEWS,
          reviewSort: 'newest',
        }),
      }
    );

    if (!apifyResponse.ok) {
      const err = await apifyResponse.text();
      throw new Error(`Apify API error: ${apifyResponse.status} ${err}`);
    }

    const reviews: ApifyReview[] = await apifyResponse.json();

    let inserted = 0;
    let updated = 0;

    for (const review of reviews) {
      const { error } = await supabase.from('yandex_reviews').upsert(
        {
          yandex_id: review.id,
          author: review.author,
          rating: review.rating,
          text: review.text,
          date: review.date,
          author_avatar_url: review.authorAvatarUrl || null,
          likes_count: review.likesCount || 0,
          owner_reply: review.ownerReply || null,
          owner_reply_date: review.ownerReplyDate || null,
        },
        { onConflict: 'yandex_id' }
      );

      if (error) {
        if (error.code === '23505') {
          updated++;
        } else {
          console.error('Upsert error for review', review.id, error);
        }
      } else {
        inserted++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: reviews.length,
        inserted,
        updated,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Sync failed', err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
