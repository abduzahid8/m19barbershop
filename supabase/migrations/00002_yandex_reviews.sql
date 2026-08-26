-- Yandex Maps Reviews (synced via Apify scraper)
CREATE TABLE yandex_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  yandex_id TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  date DATE NOT NULL,
  author_avatar_url TEXT,
  likes_count INTEGER DEFAULT 0,
  owner_reply TEXT,
  owner_reply_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE yandex_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view yandex reviews"
  ON yandex_reviews FOR SELECT USING (true);

CREATE POLICY "Service role can manage yandex reviews"
  ON yandex_reviews FOR ALL USING (true) WITH CHECK (true);
