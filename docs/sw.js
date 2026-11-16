/* Vigor service worker — offline support + installability.
   Place this file in the SAME folder as index.html.
   The folder it lives in becomes its scope, so keep Vigor in its own
   directory (e.g. /vigor/index.html + /vigor/sw.js) to avoid caching
   other pages that share a parent folder. */
const CACHE = 'vigor-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png']).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // App page: network-first so updates land, fall back to cache offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return r;
      }).catch(() => caches.match(req).then(m => m || caches.match('./')))
    );
    return;
  }

  // Everything else (fonts, etc.): serve cache, refresh in the background.
  e.respondWith(
    caches.match(req).then(m => {
      const net = fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return r;
      }).catch(() => m);
      return m || net;
    })
  );
});
