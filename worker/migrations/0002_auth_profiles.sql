-- 0002_auth_profiles — email/password credentials + animator profiles.

ALTER TABLE app_user ADD COLUMN password_hash TEXT;
ALTER TABLE app_user ADD COLUMN username TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username ON app_user(username);

-- The Animation 300 roster as first-class profiles (/army/:username).
CREATE TABLE IF NOT EXISTS animator (
  id          INTEGER PRIMARY KEY,
  username    TEXT    NOT NULL UNIQUE,
  alias       TEXT    NOT NULL,
  rank        INTEGER,
  specialty   TEXT,
  certified   INTEGER NOT NULL DEFAULT 1,
  bio         TEXT,
  location    TEXT,
  joined_year INTEGER,
  animations  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_animator_rank ON animator(rank);
