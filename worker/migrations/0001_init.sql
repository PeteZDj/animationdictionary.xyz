-- 0001_init — dictionary + animation schema for Cloudflare D1.
-- Mirrors db/schema.sql (the local-SQLite copy). Apply with:
--   wrangler d1 migrations apply animationdictionary --remote

CREATE TABLE IF NOT EXISTS word (
  id         INTEGER PRIMARY KEY,
  word       TEXT    NOT NULL UNIQUE,
  in_lexicon INTEGER NOT NULL DEFAULT 0,
  rank       INTEGER,
  verb_slug  TEXT,
  category   TEXT,
  alias_of   INTEGER REFERENCES word(id),
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_word_lexicon ON word(in_lexicon);
CREATE INDEX IF NOT EXISTS idx_word_alias   ON word(alias_of);

CREATE TABLE IF NOT EXISTS app_user (
  id             INTEGER PRIMARY KEY,
  email          TEXT    NOT NULL UNIQUE,
  display_name   TEXT,
  oauth_provider TEXT,
  oauth_sub      TEXT,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS claim (
  id         INTEGER PRIMARY KEY,
  word_id    INTEGER NOT NULL REFERENCES word(id),
  user_id    INTEGER NOT NULL REFERENCES app_user(id),
  rigs       TEXT,
  tags       TEXT,
  status     TEXT    NOT NULL DEFAULT 'open',
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_claim_word ON claim(word_id);
CREATE INDEX IF NOT EXISTS idx_claim_user ON claim(user_id);

CREATE TABLE IF NOT EXISTS animation (
  id         INTEGER PRIMARY KEY,
  word_id    INTEGER NOT NULL REFERENCES word(id),
  author_id  INTEGER REFERENCES app_user(id),
  title      TEXT    NOT NULL,
  rigs       TEXT,
  status     TEXT    NOT NULL DEFAULT 'approved',
  price_usd  INTEGER NOT NULL DEFAULT 1,
  file_key   TEXT,
  bytes      INTEGER,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_anim_word   ON animation(word_id);
CREATE INDEX IF NOT EXISTS idx_anim_status ON animation(status);

CREATE TABLE IF NOT EXISTS tag (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS animation_tag (
  animation_id INTEGER NOT NULL REFERENCES animation(id) ON DELETE CASCADE,
  tag_id       INTEGER NOT NULL REFERENCES tag(id)       ON DELETE CASCADE,
  PRIMARY KEY (animation_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_animtag_tag ON animation_tag(tag_id);

CREATE VIEW IF NOT EXISTS word_animation_count AS
SELECT w.id AS word_id, w.word AS word, COUNT(a.id) AS animations
FROM word w
LEFT JOIN animation a
  ON a.status = 'approved' AND a.word_id = COALESCE(w.alias_of, w.id)
GROUP BY w.id, w.word;

CREATE VIEW IF NOT EXISTS coverage AS
SELECT
  (SELECT COUNT(*) FROM word)                                      AS total_words,
  (SELECT COUNT(*) FROM word WHERE in_lexicon = 1)                 AS lexicon_words,
  (SELECT COUNT(*) FROM word_animation_count WHERE animations > 0) AS covered_words,
  (SELECT COUNT(*) FROM animation WHERE status = 'approved')       AS total_animations;
