/* Daily Plate service worker - offline + installability.
   Lives in its own folder (its scope). All apps on this site share one origin, so only
   ever delete caches that start with this app's prefix. Bump CACHE to force a refresh. */
const CACHE = 'plate-v1';
const PREFIX = 'plate-';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c =>
    c.addAll(['./', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png']).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // The app page: network-first so updates land, cached copy when offline.
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

  // Everything else (fonts, icons): cache first, refresh in the background.
  e.respondWith(
    caches.match(req).then(m => {
      const net = fetch(req).then(r => {
        if (r && r.status === 200) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return r;
      }).catch(() => m);
      return m || net;
    })
  );
});
