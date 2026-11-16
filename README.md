# VIGOR

A single-file, offline-capable **workout PWA** — a daily strength & mobility routine.
Vanilla HTML/CSS/JS, no frameworks, localStorage only. Built to be installed on a phone
(Android-first) from a static HTTPS host.

## Build
```
python3 build.py          # -> docs/index.html + docs/sw.js
VIGOR_OUT=/some/dir python3 build.py   # custom output dir
```
`build.py` extracts the inline JS, runs `node --check`, and injects the icons.

## Develop
Edit **`src/app_template.html`** (the whole app), then rebuild. Never hand-edit `docs/`.
Icons live in `src/icons_b64.py` (regenerate with `src/make_icons.py`, needs Pillow).

## Deploy
Put `docs/index.html` + `docs/sw.js` together in their **own folder** on an HTTPS host
(e.g. Netlify). `index.html` at the root of that folder. HTTPS is required for the service
worker and the Android "Install app" prompt.

See **CLAUDE.md** for architecture/conventions and **HANDOFF.md** for state + roadmap.

## Apps in this repo
Three separate, independently installable PWAs, all served by GitHub Pages from `docs/`:

| App | Link | Source |
|---|---|---|
| Vigor (workouts) | https://danga1967.github.io/Vigor/ | `src/` → built into `docs/` by `build.py` |
| 日本語道 (Japanese) | https://danga1967.github.io/Vigor/japanese/ | edited directly in `docs/japanese/` |
| Stride (half marathon) | https://danga1967.github.io/Vigor/stride/ | edited directly in `docs/stride/` |

Each app has its own `manifest.json`, `icons/`, and `sw.js` (so each installs on its own and
keeps its own offline cache). **Edit the `docs/japanese/` and `docs/stride/` files directly —
`build.py` only regenerates Vigor's files** and never touches those two folders. When you
change an app, bump its cache name in `sw.js` so installed copies refresh. Vigor's service
worker deliberately ignores requests under `japanese/` and `stride/`.
