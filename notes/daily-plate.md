# Daily Plate

> **Hosting (current):** this app now lives in this repo at `docs/plate/` and is served by GitHub Pages at
> https://danga1967.github.io/Vigor/plate/ as an installable PWA (own `manifest.json`, `icons/`, `sw.js`).
> It runs outside Claude, so the `db`/`user` capabilities below are absent and it is **local-first only**
> (localStorage `dp:*` on that phone, no cloud mirror). The old artifact link below is the previous home; data
> saved there does not carry over. Edit `docs/plate/index.html` directly, bump `CACHE` in `docs/plate/sw.js`.

Phone-first meal checklist and nutrition tracker for Dan. Single file: `index.html` (no build step). Published as a Claude artifact: https://claude.ai/artifact/EU5YvvAidkZvqzisbTf7iN (slug 6d0eb050-0ced-46f8-9aa5-7be3027d9107).

## Goals
- Remind/check off daily foods; eating window 12:00 PM to 6:00 PM, mostly whole foods.
- Lose 20 lb in 3 months (200 to 180 lb, started 2026-11-18). Protein target 150 g/day. Calorie target defaults to 1,700 (placeholder; settings sheet estimates from height/activity, assumes male, age 59).
- Show nutrition per food and track vitamins/minerals against adult-male targets (fiber, Ca, Fe, K, Mg, Zn, D, B12, C, A, folate; sodium and caffeine as limits).

## Daily staples (template in `STAPLES`)
7:00 AM: hot lemon water, Beekeeper's propolis, Yoder's Good Health Recipe (1 tbsp).
12:00 PM: AG1, 2 eggs, 1 slice homemade wheat toast, Celsius.
2:30 PM: 1/2 cup homemade Greek yogurt, 1/2 cup homemade granola, 1/2 cup whole milk.
4:00 PM: fairlife Nutrition Plan shake (30 g protein), StarKist Tuna Creations Hot Buffalo, 2 prunes.
5:00 PM: dinner, empty by default (chicken/salmon/steak preset buttons).

## Data notes
- Food data lives in `LIB` (via `mk(id,name,serving,cat,src,[17 numbers],note)`). Number order: kcal,p,c,f,fib,na,ca,fe,k,mg,zn,d,b12,vc,va,fol,caf.
- `src`: `label` (product label), `usda` (typical values from memory, approximate), `recipe` (homemade estimate), `est`.
- Homemade toast, yogurt and granola are ESTIMATES. TODO: Dan offered to send his ingredient lists; recompute them.
- AG1 mixes Next Gen label values (iron, folate, B12) and older label values (C, zinc, Ca, Mg, A). No vitamin D. Verify against his pouch.
- No full labels found for Yoder's (5 kcal/tbsp only) or propolis (counted as 0).
- Targets are general guidelines, not medical advice; the app tells users to check with a doctor.

## Storage
Local-first: localStorage keys `dp:settings` and `dp:day-YYYY-MM-DD`, mirrored (debounced) to the artifact `db` capability at `data/users/<uid>/<key>` (private per user). Capabilities declared: `db`, `user`. The page must tolerate both being null.

## Ideas not yet built
- Calendar reminders at slot times (Google Calendar connector); web pages cannot push notifications.
- Native app / PWA install, weekly grocery list, editing the staple template in the UI.
