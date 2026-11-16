/* RETIRED. Vigor used to be installed from the top of this site and this file was its
   service worker. Vigor now lives in /vigor/ and has its own. This one only exists so
   phones that still have the old registration clean it up: it clears Vigor's old cache,
   unregisters itself, and reloads any open pages. Do not add a manifest or SW back to
   this folder's root — that would make the root an installable app whose scope
   swallows every other app's links again. */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('vigor-')).map((k) => caches.delete(k)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window' });
    windows.forEach((c) => c.navigate(c.url));
  })());
});
