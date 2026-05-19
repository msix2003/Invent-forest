// Service Worker - Inventari Forestal PTGMF v10.0
// App 100% offline - tots els recursos estan incrustats o en caché
const CACHE_NAME = 'ptgmf-v3';
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension')) return;
  // Ignorar peticions a Google Fonts (no crítiques, només estètiques)
  if (event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request)
        .then(r => { caches.open(CACHE_NAME).then(c => c.put(event.request, r.clone())); return r; })
        .catch(() => new Response('', {status: 200}))
      )
    );
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(r => {
          if (r && r.status === 200) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, r.clone()));
          }
          return r;
        })
        .catch(() => caches.match('./index.html'))
      )
  );
});
