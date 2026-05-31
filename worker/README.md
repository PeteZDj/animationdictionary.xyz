# animationdictionary-api (Cloudflare Worker)

The backend for animationdictionary.xyz: the **SQL dictionary** (D1), the
coverage API, **sign-in** (Google / GitHub / AfroSoftware / email magic-link),
and the contributor flow (**claim a word → download a rig → upload an animation
with tags**). It's deployed as a Worker routed at `animationdictionary.xyz/api/*`,
so the static IIS site keeps serving everything else and the browser talks to
the API same-origin (no CORS in production).

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | – | liveness |
| GET | `/api/coverage` | – | headline coverage numbers |
| GET | `/api/words?filter=all\|covered\|open&q=&limit=&offset=` | – | lexicon grid |
| GET | `/api/words/:word` | – | one word: count + tags |
| GET | `/api/animators` | – | the Animation 300 roster |
| GET | `/api/animators/:username` | – | one animator profile (powers `/army/:username`) |
| POST | `/api/auth/register` `{email,password,name}` | – | create an account (email + password) → session |
| POST | `/api/auth/login` `{email,password}` | – | sign in (email + password) → session |
| GET | `/api/auth/providers` | – | which sign-in methods are configured |
| GET | `/api/auth/:provider/start?return=/path` | – | begin OAuth (google\|github\|afrosoftware) |
| GET | `/api/auth/:provider/callback` | – | OAuth callback → sets session |
| POST | `/api/auth/email/start` `{email,return}` | – | send magic link |
| GET | `/api/auth/email/verify?token=` | – | verify magic link → session |
| GET | `/api/me` | cookie | current user + their claims |
| POST | `/api/auth/logout` | cookie | clear session |
| POST | `/api/claims` `{word,rigs[],tags[]}` | ✅ | reserve a word |
| PUT | `/api/uploads?ext=fbx` (binary body) | ✅ | stream a bundle to R2 → `{key,bytes}` |
| POST | `/api/animations` `{word,title,rigs[],tags[],fileKey,bytes}` | ✅ | register an uploaded clip |
| GET | `/api/rig/:engine` | – | download the standard rig kit for an engine |

Sessions are stateless signed cookies (HMAC); no session store needed.
`afrosoftware` is a branded button backed by the Google client until `a3.ke` ships.

## One-time provisioning

```bash
cd worker
npm install
wrangler login                       # authenticate your Cloudflare account

# 1) D1 — create the SQL dictionary, copy the printed database_id into wrangler.jsonc
npm run db:create
wrangler d1 migrations apply animationdictionary --remote
wrangler d1 execute animationdictionary --remote --file ../db/seed.sql

# 2) R2 — bucket for rig kits + uploaded animations
wrangler r2 bucket create animationdictionary-assets

# 3) Secrets
wrangler secret put SESSION_SECRET        # any long random string
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put RESEND_API_KEY        # optional; without it, magic links return a dev link

# 4) Deploy (the route in wrangler.jsonc attaches /api/* on the zone)
npm run deploy
```

### OAuth redirect URIs to register

- **Google** (one client, used by both Google + AfroSoftware buttons):
  - `https://animationdictionary.xyz/api/auth/google/callback`
  - `https://animationdictionary.xyz/api/auth/afrosoftware/callback`
- **GitHub**:
  - `https://animationdictionary.xyz/api/auth/github/callback`

## Local development

```bash
cp .dev.vars.example .dev.vars         # fill in client ids/secrets
npm run setup:local                    # migrate + seed dictionary + seed animators (local D1)
npm run dev                            # http://localhost:8787
```

Point the front-end at it with `NEXT_PUBLIC_API_BASE=http://localhost:8787/api`
(set in `.env.local` at the repo root) and run `npm run dev` there too.

## Running on the IIS box without a Cloudflare account (current production setup)

The site is live on IIS and the API runs **on the same server** as a local Worker —
no Cloudflare deploy required. Email + password sign-up works against it today.

- **IIS reverse-proxy**: `public/web.config` has an `ApiProxy` rewrite rule that
  forwards `animationdictionary.xyz/api/*` → `http://127.0.0.1:8787/api/*`
  (requires the ARR + URL Rewrite IIS modules, which are installed and have
  proxy enabled).
- **The Worker**: `worker/serve.ps1` runs `wrangler dev` in **local mode**
  (SQLite-backed D1 + local R2 under `.wrangler/state`), bound to `127.0.0.1:8787`.
- **Durability**: a SYSTEM scheduled task `AnimationDictionaryAPI` runs
  `serve.ps1` at startup (restart-on-failure), so the API survives reboots.

```powershell
# manage the API process
Start-ScheduledTask  -TaskName AnimationDictionaryAPI
Stop-ScheduledTask   -TaskName AnimationDictionaryAPI    # then re-run after code changes
Get-Content C:\migration\adxyz-api.log -Tail 40          # worker logs
```

This is a pragmatic stand-in. The **production-grade path** is the one-time
provisioning above (`npm run deploy` to Cloudflare); once that route is live,
remove the `ApiProxy` rule and the scheduled task. The front-end code is
identical either way (it calls `/api` same-origin).

## How the front-end uses it

`lib/api.ts` calls `/api` same-origin by default. The `/dictionary` page and the
claim modal hydrate from the API when it's reachable and **fall back to the
static lexicon** otherwise — so the site works before the Worker is deployed and
upgrades to live data automatically once it is.
