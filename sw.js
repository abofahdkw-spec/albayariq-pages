// Service Worker للبيارق الملكية - PWA
const CACHE = 'albayariq-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((response) => {
        if (e.request.url.startsWith(self.location.origin) && 
            e.request.method === 'GET' &&
            response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback
      if (e.request.mode === 'navigate') {
        return caches.match('/');
      }
      return new Response('غير متصل', { status: 408 });
    })
  );
});
