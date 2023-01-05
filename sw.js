const cacheName = 'frioul-25';

const cacheFiles = [
  "./app.js",
  "./lib.js",
  "./index.html",
  "./schedules.json",
  "./style.css"
]

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(cacheFiles);
  })());
});

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const r = await cache.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(e.request);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }))
  }));
});
