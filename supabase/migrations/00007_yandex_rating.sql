-- Store Yandex's own aggregate rating (schema.org AggregateRating markup on
-- the org page) alongside the review sync timestamp, so the app can show
-- the real live rating instead of a hardcoded number.
alter table yandex_reviews_sync_meta add column if not exists rating_value numeric;
alter table yandex_reviews_sync_meta add column if not exists rating_count integer;
