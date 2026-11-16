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
Three separate, independently installable PWAs, served by GitHub Pages from `docs/`:

| App | Link | Source |
|---|---|---|
| Vigor (workouts) | https://danga1967.github.io/Vigor/vigor/ | `src/` -> built into `docs/vigor/` by `build.py` |
| 日本語道 (Japanese) | https://danga1967.github.io/Vigor/japanese/ | edited directly in `docs/japanese/` |
| Stride (half marathon) | https://danga1967.github.io/Vigor/stride/ | edited directly in `docs/stride/` |

Launcher page with all three links: https://danga1967.github.io/Vigor/

**Why each app is in a sibling folder:** an installed PWA captures every link inside its
`scope` (its folder and everything under it). If one app lived at the top of the site it
would swallow the other two apps' links. So keep the apps side by side, and **never put a
`manifest.json` or a working service worker in the `docs/` root** (the root `sw.js` is a
retired clean-up script for old installs, and `docs/index.html` is a plain launcher page).

Each app has its own `manifest.json`, `icons/`, and `sw.js`, and keeps its own offline cache
(cache names are prefixed `vigor-` / `nihongo-` / `stride-`, and each service worker only
deletes its own prefix, because all three share one origin). `build.py` only regenerates
Vigor's folder. When you change an app, bump its cache name in `sw.js` so installed copies
refresh.
