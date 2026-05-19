// Service Worker - Inventari Forestal PTGMF
// Versió cache - canviar quan s'actualitzi l'app
const CACHE_NAME = 'ptgmf-v1';

// Fitxers a cachejar per a ús offline
const CACHE_FILES = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap'
];

// Instal·lació: precaché dels fitxers essencials
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cachejar fitxers locals (crítics)
        return cache.addAll(['./', './index.html'])
          .then(() => {
            // Intentar cachejar recursos externs (no crític si fallen)
            return cache.add('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
              .catch(() => console.log('SheetJS no precachejat - es carregarà online'));
          });
      })
      .then(() => self.skipWaiting())
  );
});

// Activació: eliminar caches velles
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: strategy Cache First per a fitxers locals, Network First per a externs
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Fitxers locals: cache first
  if (url.includes(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request)
          .then(response => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
            return response;
          })
        )
    );
    return;
  }

  // Recursos externs (SheetJS, fonts): stale-while-revalidate
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        const fetchPromise = fetch(event.request).then(response => {
          caches.open(CACHE_NAME).then(c => c.put(event.request, response.clone()));
          return response;
        }).catch(() => cached); // Si falla xarxa, retornar cache
        return cached || fetchPromise;
      })
  );
});
