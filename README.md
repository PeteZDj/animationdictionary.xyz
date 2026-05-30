# animationdictionary.xyz

The Language of Motion — a semantic marketplace for 3D animations and rigged
character models. Search by verb, browse by noun, buy at $1/animation with
packs capped at $10. Powered by hand-picked "Animation 300" creators.

## Stack

- **Next.js 14** (app router) — static export (`output: 'export'`)
- **Tailwind CSS** + Plus Jakarta Sans + JetBrains Mono
- **react-three-fiber** placeholder viewer (swap for rigged `.glb` later)
- **lucide-react** icons

Mock data lives in `data/{verbs,nouns,animators,marketplace}.ts`. Hero and
character images in `public/img/{hero,verbs,nouns}/` are AI-generated via the
**magi** skill (Google Gemini `gemini-2.5-flash-image`) — see `magi.style*.txt`
for the locked anchors that keep every batch on-model.

## Local dev

```bash
npm install
npm run dev    # http://localhost:3000
```

## Production build + deploy (Windows IIS)

```powershell
# from the repo root:
.\build-deploy.ps1
```

This runs `next build` (static export → `out/`), then mirrors the output into
`C:\inetpub\wwwroot\animationdictionary.xyz\` and runs a host-header smoke
test. The IIS site is bound to `*:80:animationdictionary.xyz` +
`*:80:www.animationdictionary.xyz` + a per-site internal port (1022).

## Layout

```
app/
  page.tsx                 # landing
  verbs/page.tsx           # all verbs, grouped by category
  verbs/[verb]/page.tsx    # detail (3D viewer + paired models + listings)
  nouns/page.tsx           # all nouns, grouped by category
  nouns/[noun]/page.tsx    # detail (3D viewer + animation picker)
  marketplace/page.tsx     # client-filterable grid
  animation-300/page.tsx   # the "barracks" dark-themed roster
components/
  nav.tsx, footer.tsx
  hero-slideshow.tsx       # 4-slide auto-rotating hero (client)
  motion-ribbon.tsx        # scrolling top ticker
  asset-card.tsx           # marketplace product card
  search-bar.tsx           # hero search w/ verb+noun lookup (client)
  viewer.tsx               # Three.js placeholder
data/
  verbs.ts (84), nouns.ts (76), animators.ts (30), marketplace.ts (~100)
magi.style.txt             # robot-character lock for verb image generation
magi.style.hero.txt        # cinematic-dark anchor for hero image generation
magi.style.noun.txt        # character-portrait anchor for noun generation
magi-shotlist*.json        # prompt batches passed to the magi skill
build-deploy.ps1           # one-shot build + deploy to IIS wwwroot
```

## Generating images

Requires `$env:GEMINI_API_KEY` to be set. The `magi` skill is installed at
`~/.claude/skills/magi/`. From this repo root:

```powershell
& "$env:USERPROFILE\.claude\skills\magi\scripts\magi.ps1" `
  -Shotlist .\magi-shotlist-verbs-batch2.json `
  -OutDir   .\public\img\verbs `
  -StyleFile .\magi.style.txt
```

The style anchor is appended to every prompt in the batch so all images in
one run feel cohesive.

## Pending phases

- WebP conversion (homepage is ~22 MB of PNGs)
- Mobile menu (`lg:` nav links currently disappear below the breakpoint)
- Real `.glb` rigged models in the viewer
- Auth (Google OAuth via NextAuth)
- Uploads + Stripe payments
- AI video-to-animation pipeline
