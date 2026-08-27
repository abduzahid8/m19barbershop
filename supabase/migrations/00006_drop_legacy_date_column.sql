-- The old Apify-based sync's `date` column is superseded by `review_date`
-- (added in 00005) but was left behind with its NOT NULL constraint still
-- in force, so every insert from the new sync violated it. Drop it.
alter table yandex_reviews drop column if exists date;
