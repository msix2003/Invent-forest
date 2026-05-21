// Service Worker - Inventari Forestal PTGMF v10.0
// App 100% offline - tots els recursos estan incrustats o en caché
const CACHE_NAME = 'ptgmf-v4';
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

// URLs que MAI s'han de guardar en caché (han d'anar sempre a la xarxa)
// Inclou totes les crides a Supabase (auth, base de dades, storage...)
const NETWORK_ONLY = [
  'supabase.co',
  'supabase.io',
];

// URLs externes (CDN) que s'intenten primer per xarxa i, si fallen, des de caché
const NETWORK_FIRST = [
  'cdn.jsdelivr.net',
  'cdn.sheetjs.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
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

  const url = event.request.url;

  // 1) NETWORK ONLY: Supabase → mai caché, sempre xarxa real
  //    Si falla la xarxa, retornem error JSON (no index.html)
  if (NETWORK_ONLY.some(domain => url.includes(domain))) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(
          JSON.stringify({ error: 'No hi ha connexió amb el servidor.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    return;
  }

  // 2) NETWORK FIRST: CDN scripts i fonts → intenta xarxa, si falla usa caché
  if (NETWORK_FIRST.some(domain => url.includes(domain))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Desa a caché si la resposta és vàlida
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(() =>
          // Si no hi ha xarxa, intenta des de caché
          caches.match(event.request).then(cached =>
            cached || new Response('', { status: 200 })
          )
        )
    );
    return;
  }

  // 3) CACHE FIRST: recursos locals de l'app (index.html, icones, manifest...)
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          }
          return response;
        }).catch(() => caches.match('./index.html'));
      })
  );
});
