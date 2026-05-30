-- animationdictionary.xyz — dictionary + animation schema
-- ---------------------------------------------------------------------------
-- Target: SQLite / Cloudflare D1 (the production API runs on a Worker).
-- This is the backing store for the /dictionary coverage page and the
-- contributor flow (claim a word -> download rig -> upload animation -> tag).
--
-- Apply locally:   sqlite3 dictionary.db < db/schema.sql
-- Apply to D1:     wrangler d1 execute animationdictionary --file db/schema.sql
-- Seed:            ... < db/seed.sql   (db/seed.sql is generated, see scripts/)
-- ---------------------------------------------------------------------------

PRAGMA foreign_keys = ON;

-- Every English word we track. Bulk-load the full dictionary from
-- dwyl/english-words (words_alpha.txt) into this table; the curated "core
-- action lexicon" rows are flagged with in_lexicon = 1.
CREATE TABLE IF NOT EXISTS word (
  id         INTEGER PRIMARY KEY,
  word       TEXT    NOT NULL UNIQUE,         -- lowercase, single token
  in_lexicon INTEGER NOT NULL DEFAULT 0,      -- part of the curated action lexicon
  rank       INTEGER,                         -- everyday-frequency rank, if known
  verb_slug  TEXT,                            -- resolves to /verbs/<slug>/ when covered
  category   TEXT,                            -- verb category (locomotion, combat, ...)
  alias_of   INTEGER REFERENCES word(id),     -- synonym -> its primary word
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_word_lexicon ON word(in_lexicon);
CREATE INDEX IF NOT EXISTS idx_word_alias   ON word(alias_of);

-- Contributors / buyers.
CREATE TABLE IF NOT EXISTS app_user (
  id           INTEGER PRIMARY KEY,
  email        TEXT    NOT NULL UNIQUE,
  display_name TEXT,
  oauth_provider TEXT,                        -- 'google' | 'github' | ...
  oauth_sub    TEXT,                          -- provider subject id
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- A reservation of a word by a user who intends to animate it.
CREATE TABLE IF NOT EXISTS claim (
  id         INTEGER PRIMARY KEY,
  word_id    INTEGER NOT NULL REFERENCES word(id),
  user_id    INTEGER NOT NULL REFERENCES app_user(id),
  rigs       TEXT,                            -- JSON array, e.g. ["UE5","Unity"]
  tags       TEXT,                            -- JSON array of intended variations
  status     TEXT    NOT NULL DEFAULT 'open', -- open | submitted | approved | expired
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_claim_word ON claim(word_id);
CREATE INDEX IF NOT EXISTS idx_claim_user ON claim(user_id);

-- A delivered animation clip for a word. price_usd is in whole dollars ($1 each).
CREATE TABLE IF NOT EXISTS animation (
  id         INTEGER PRIMARY KEY,
  word_id    INTEGER NOT NULL REFERENCES word(id),
  author_id  INTEGER REFERENCES app_user(id),
  title      TEXT    NOT NULL,
  rigs       TEXT,                            -- JSON array of supported rigs
  status     TEXT    NOT NULL DEFAULT 'approved', -- pending | approved | rejected
  price_usd  INTEGER NOT NULL DEFAULT 1,
  file_key   TEXT,                            -- R2 object key for the .fbx/.glb bundle
  bytes      INTEGER,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_anim_word   ON animation(word_id);
CREATE INDEX IF NOT EXISTS idx_anim_status ON animation(status);

-- Free-form tags: "scared", "back", "side", "double" — every variation counts.
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

-- Per-word animation counts (direct + via alias). Drives the word grid.
CREATE VIEW IF NOT EXISTS word_animation_count AS
SELECT w.id AS word_id,
       w.word AS word,
       COUNT(a.id) AS animations
FROM word w
LEFT JOIN animation a
  ON a.status = 'approved'
 AND a.word_id = COALESCE(w.alias_of, w.id)
GROUP BY w.id, w.word;

-- Headline coverage numbers for the /dictionary page.
CREATE VIEW IF NOT EXISTS coverage AS
SELECT
  (SELECT COUNT(*) FROM word)                                              AS total_words,
  (SELECT COUNT(*) FROM word WHERE in_lexicon = 1)                         AS lexicon_words,
  (SELECT COUNT(*) FROM word_animation_count WHERE animations > 0)         AS covered_words,
  (SELECT COUNT(*) FROM animation WHERE status = 'approved')               AS total_animations;
