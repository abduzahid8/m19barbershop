-- Yandex Maps reviews, synced directly from the org's public reviews page
-- (Yandex server-renders review data as embedded JSON — no third-party
-- scraper needed, see supabase/functions/yandex-reviews).
--
-- Written defensively (create-if-missing / add-column-if-missing) because
-- an earlier, since-removed Apify-based sync already created a
-- `yandex_reviews` table with a similar but not identical shape (a `date`
-- column instead of `review_date`, IDs from Apify instead of Yandex's own
-- reviewId, and no `yandex_reviews_sync_meta` table). This migration
-- converges either a fresh database or that pre-existing one onto the
-- current schema.
create table if not exists yandex_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table yandex_reviews add column if not exists yandex_id text;
alter table yandex_reviews add column if not exists author text;
alter table yandex_reviews add column if not exists rating integer;
alter table yandex_reviews add column if not exists text text;
alter table yandex_reviews add column if not exists review_date date;
alter table yandex_reviews add column if not exists author_avatar_url text;
alter table yandex_reviews add column if not exists likes_count integer default 0;
alter table yandex_reviews add column if not exists owner_reply text;
alter table yandex_reviews add column if not exists owner_reply_date date;

-- This table is purely a read-through cache of public Yandex data (not
-- user-owned data), and old Apify-sourced rows use a different ID scheme
-- than the new sync, so they'd show up as duplicates instead of being
-- de-duplicated by the yandex_id upsert below. Clear it once here; the
-- edge function repopulates it fresh on its very first request.
truncate table yandex_reviews;

create unique index if not exists yandex_reviews_yandex_id_key on yandex_reviews (yandex_id);

alter table yandex_reviews enable row level security;

drop policy if exists "Anyone can view yandex reviews" on yandex_reviews;
create policy "Anyone can view yandex reviews"
  on yandex_reviews for select using (true);

drop policy if exists "Service role can manage yandex reviews" on yandex_reviews;
create policy "Service role can manage yandex reviews"
  on yandex_reviews for all using (true) with check (true);

-- Single-row table tracking when we last pulled fresh data from Yandex,
-- so the edge function only re-fetches the Yandex page once per TTL window
-- instead of on every app request.
create table if not exists yandex_reviews_sync_meta (
  id boolean primary key default true,
  last_synced_at timestamptz,
  constraint yandex_reviews_sync_meta_single_row check (id)
);

insert into yandex_reviews_sync_meta (id, last_synced_at)
values (true, null)
on conflict (id) do nothing;

alter table yandex_reviews_sync_meta enable row level security;

drop policy if exists "Service role can manage sync meta" on yandex_reviews_sync_meta;
create policy "Service role can manage sync meta"
  on yandex_reviews_sync_meta for all using (true) with check (true);
