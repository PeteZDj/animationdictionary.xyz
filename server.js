// animationdictionary.xyz — Express API backed by PostgreSQL
'use strict'
const express = require('express')
const { Pool } = require('pg')
const { OAuth2Client } = require('google-auth-library')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3013
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://animdict:AnimDict2025Pg!@localhost:5432/animationdictionary'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '251118085837-bdoims5qd7586f14e5rf2bvetj2nkirr.apps.googleusercontent.com'

const pool = new Pool({ connectionString: DATABASE_URL, max: 10 })
const gClient = new OAuth2Client(GOOGLE_CLIENT_ID)
const q = (sql, p) => pool.query(sql, p)
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// ── DB init ───────────────────────────────────────────────────────────────────

async function initDb() {
  await q(`
    CREATE TABLE IF NOT EXISTS word (
      id         SERIAL PRIMARY KEY,
      word       TEXT NOT NULL UNIQUE,
      in_lexicon INTEGER NOT NULL DEFAULT 0,
      rank       INTEGER,
      verb_slug  TEXT,
      category   TEXT,
      alias_of   INTEGER REFERENCES word(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_word_lexicon ON word(in_lexicon);

    CREATE TABLE IF NOT EXISTS app_user (
      id             SERIAL PRIMARY KEY,
      email          TEXT NOT NULL UNIQUE,
      display_name   TEXT,
      oauth_provider TEXT,
      oauth_sub      TEXT UNIQUE,
      password_hash  TEXT,
      username       TEXT UNIQUE,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS claim (
      id         SERIAL PRIMARY KEY,
      word_id    INTEGER NOT NULL REFERENCES word(id),
      user_id    INTEGER NOT NULL REFERENCES app_user(id),
      rigs       TEXT,
      tags       TEXT,
      status     TEXT NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_claim_word ON claim(word_id);

    CREATE TABLE IF NOT EXISTS animation (
      id         SERIAL PRIMARY KEY,
      word_id    INTEGER NOT NULL REFERENCES word(id),
      author_id  INTEGER REFERENCES app_user(id),
      title      TEXT NOT NULL,
      rigs       TEXT,
      status     TEXT NOT NULL DEFAULT 'approved',
      price_usd  INTEGER NOT NULL DEFAULT 1,
      file_key   TEXT,
      bytes      INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_anim_word   ON animation(word_id);
    CREATE INDEX IF NOT EXISTS idx_anim_status ON animation(status);

    CREATE TABLE IF NOT EXISTS tag (
      id   SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS animation_tag (
      animation_id INTEGER NOT NULL REFERENCES animation(id) ON DELETE CASCADE,
      tag_id       INTEGER NOT NULL REFERENCES tag(id)       ON DELETE CASCADE,
      PRIMARY KEY (animation_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS animator (
      id          SERIAL PRIMARY KEY,
      username    TEXT NOT NULL UNIQUE,
      alias       TEXT NOT NULL,
      rank        INTEGER,
      specialty   TEXT,
      certified   INTEGER NOT NULL DEFAULT 1,
      bio         TEXT,
      location    TEXT,
      joined_year INTEGER,
      animations  INTEGER NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_animator_rank ON animator(rank);
  `)

  // Seed words if empty
  const { rows: wordCheck } = await q('SELECT COUNT(*) as c FROM word')
  if (parseInt(wordCheck[0].c) === 0) {
    console.log('Seeding word data...')
    const seedPath = path.join(__dirname, 'db', 'seed.sql')
    if (fs.existsSync(seedPath)) {
      let seed = fs.readFileSync(seedPath, 'utf8')
      // Convert SQLite to PostgreSQL: INSERT OR IGNORE → INSERT ... ON CONFLICT DO NOTHING
      seed = seed.replace(/INSERT OR IGNORE/g, 'INSERT')
      // Remove SQLite-specific syntax
      seed = seed.replace(/BEGIN TRANSACTION;/g, 'BEGIN;')
      await pool.query(seed)
      console.log('Words seeded.')
    }

    // Seed animators
    const animSeedPath = path.join(__dirname, 'db', 'seed-animators.sql')
    if (fs.existsSync(animSeedPath)) {
      let animSeed = fs.readFileSync(animSeedPath, 'utf8')
      animSeed = animSeed.replace(/INSERT OR IGNORE/g, 'INSERT')
      animSeed = animSeed.replace(/BEGIN TRANSACTION;/g, 'BEGIN;')
      animSeed = animSeed.replace(/INSERT OR REPLACE/g, 'INSERT')
      await pool.query(animSeed).catch(e => console.warn('Animator seed warning:', e.message))
    }
  }
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

async function verifyGoogle(credential) {
  const ticket = await gClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID })
  return ticket.getPayload()
}

async function sessionUser(req) {
  const token = req.cookies?.session
  if (!token) return null
  const { rows } = await q(
    `SELECT u.* FROM sessions s JOIN app_user u ON s.user_id = u.id
     WHERE s.token = $1 AND s.expires_at > NOW()`, [token]
  )
  return rows[0] || null
}

function randToken() { return crypto.randomBytes(32).toString('hex') }

function setSession(res, token) {
  res.cookie('session', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 30 * 24 * 3600_000 })
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'animationdictionary-api' }))

app.get('/api/coverage', async (_, res) => {
  const { rows } = await q(`
    SELECT
      (SELECT COUNT(*) FROM word)                           AS total_words,
      (SELECT COUNT(*) FROM word WHERE in_lexicon = 1)     AS lexicon_words,
      (SELECT COUNT(*) FROM animation WHERE status='approved') AS total_animations,
      (SELECT COUNT(DISTINCT word_id) FROM animation WHERE status='approved') AS covered_words
  `)
  res.json(rows[0])
})

app.get('/api/words', async (req, res) => {
  const { filter = 'all', q: search = '', limit = 200, offset = 0 } = req.query
  let where = []
  const params = []
  if (filter === 'covered') {
    where.push(`EXISTS (SELECT 1 FROM animation a WHERE a.word_id = COALESCE(w.alias_of, w.id) AND a.status='approved')`)
  } else if (filter === 'open') {
    where.push(`NOT EXISTS (SELECT 1 FROM animation a WHERE a.word_id = COALESCE(w.alias_of, w.id) AND a.status='approved')`)
  }
  if (search) { params.push(`%${search}%`); where.push(`w.word ILIKE $${params.length}`) }
  const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : ''
  params.push(limit, offset)
  const { rows } = await q(
    `SELECT w.id, w.word, w.in_lexicon, w.verb_slug, w.category,
            (SELECT COUNT(*) FROM animation a WHERE a.word_id = COALESCE(w.alias_of, w.id) AND a.status='approved') AS animations
     FROM word w ${whereStr}
     ORDER BY w.rank NULLS LAST, w.id
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  )
  res.json({ words: rows })
})

app.get('/api/words/:word', async (req, res) => {
  const { rows } = await q(
    `SELECT w.*, (SELECT COUNT(*) FROM animation a WHERE a.word_id = COALESCE(w.alias_of, w.id) AND a.status='approved') AS animations
     FROM word w WHERE LOWER(w.word) = LOWER($1)`, [req.params.word]
  )
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  const word = rows[0]
  const anims = await q(
    `SELECT a.*, u.display_name AS author_name FROM animation a
     LEFT JOIN app_user u ON a.author_id = u.id
     WHERE a.word_id = COALESCE($1::int, $2::int) AND a.status='approved'
     ORDER BY a.created_at DESC`, [word.alias_of, word.id]
  )
  res.json({ ...word, animation_list: anims.rows })
})

app.get('/api/animators', async (_, res) => {
  const { rows } = await q('SELECT * FROM animator ORDER BY rank NULLS LAST, id')
  res.json({ animators: rows })
})

app.get('/api/animators/:username', async (req, res) => {
  const { rows } = await q('SELECT * FROM animator WHERE username = $1', [req.params.username])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json({ animator: rows[0] })
})

// ── Auth ──────────────────────────────────────────────────────────────────────

app.get('/api/auth/providers', (_, res) => res.json({ providers: ['google', 'email'] }))

app.post('/api/auth/gsi', async (req, res) => {
  try {
    const { credential } = req.body
    const payload = await verifyGoogle(credential)
    const { sub, email, name, picture } = payload

    const { rows } = await q(
      `INSERT INTO app_user (email, display_name, oauth_provider, oauth_sub)
       VALUES ($1, $2, 'google', $3)
       ON CONFLICT (oauth_sub) DO UPDATE SET display_name=EXCLUDED.display_name
       RETURNING *`,
      [email, name, sub]
    )
    const user = rows[0]
    const token = randToken()
    await q(`INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 days')`, [token, user.id])
    setSession(res, token)
    res.json({ user: { id: user.id, email: user.email, display_name: user.display_name, avatar: picture } })
  } catch (e) {
    console.error(e)
    res.status(401).json({ error: 'Google auth failed' })
  }
})

// Keep /api/auth/google as alias
app.post('/api/auth/google', async (req, res) => {
  req.url = '/api/auth/gsi'
  app.handle(req, res)
})

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, username } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  try {
    const bcrypt = require('bcryptjs')
    const hash = await bcrypt.hash(password, 10)
    const { rows } = await q(
      `INSERT INTO app_user (email, display_name, username, password_hash)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, name || email.split('@')[0], username || null, hash]
    )
    const user = rows[0]
    const token = randToken()
    await q(`INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 days')`, [token, user.id])
    setSession(res, token)
    res.json({ user: { id: user.id, email: user.email, display_name: user.display_name } })
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already registered' })
    console.error(e); res.status(500).json({ error: 'Registration failed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  const { rows } = await q('SELECT * FROM app_user WHERE email = $1', [email])
  if (!rows[0] || !rows[0].password_hash) return res.status(401).json({ error: 'Invalid credentials' })
  const bcrypt = require('bcryptjs')
  const ok = await bcrypt.compare(password, rows[0].password_hash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = randToken()
  await q(`INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 days')`, [token, rows[0].id])
  setSession(res, token)
  res.json({ user: { id: rows[0].id, email: rows[0].email, display_name: rows[0].display_name } })
})

app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies?.session
  if (token) await q('DELETE FROM sessions WHERE token = $1', [token])
  res.clearCookie('session')
  res.json({ ok: true })
})

app.get('/api/me', async (req, res) => {
  const user = await sessionUser(req)
  res.json({ user: user ? { id: user.id, email: user.email, display_name: user.display_name, username: user.username } : null })
})

// ── Claims ────────────────────────────────────────────────────────────────────

app.post('/api/claims', async (req, res) => {
  const user = await sessionUser(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  const { word, rigs, tags } = req.body
  const wordRow = await q('SELECT id FROM word WHERE LOWER(word) = LOWER($1)', [word])
  if (!wordRow.rows[0]) return res.status(404).json({ error: 'Word not found' })
  const { rows } = await q(
    `INSERT INTO claim (word_id, user_id, rigs, tags) VALUES ($1, $2, $3, $4) RETURNING *`,
    [wordRow.rows[0].id, user.id, JSON.stringify(rigs || []), JSON.stringify(tags || [])]
  )
  res.json({ claim: rows[0] })
})

initDb()
  .then(() => app.listen(PORT, () => console.log(`AnimationDictionary API on port ${PORT}`)))
  .catch(e => { console.error('DB init failed:', e); process.exit(1) })
