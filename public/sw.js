const CACHE_NAME = 'chidori-v1.0.0';
const STATIC_CACHE = 'chidori-static-v1';
const DYNAMIC_CACHE = 'chidori-dynamic-v1';

const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/pages/Home.jsx',
  '/src/pages/Anime.jsx',
  '/src/pages/Game.jsx',
  '/src/pages/Movie.jsx',
  '/src/pages/Series.jsx',
  '/src/pages/Nature.jsx',
  '/src/pages/ResultPage.jsx',
  '/src/components/Header.jsx',
  '/src/components/Card.jsx',
  '/src/components/UpBtn.jsx',
  '/src/components/Wallpaper.jsx',
  '/src/firebase.js',
  '/src/styles/main.css',
  '/src/styles/responsive.css',
  '/src/styles/font.css',
  '/images/favicon.png',
  '/images/404.svg',
  '/images/download.png',
  '/images/user.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method === 'GET') {
    if (request.destination === 'image') {
      event.respondWith(
        caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(request)
              .then((response) => {
                if (response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(DYNAMIC_CACHE)
                    .then((cache) => {
                      cache.put(request, responseClone);
                    });
                }
                return response;
              })
              .catch(() => {
                return new Response(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f0f0f0"/><text x="200" y="150" text-anchor="middle" fill="#999">Image not available offline</text></svg>',
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              });
          })
      );
    }
    else if (request.destination === 'document' || 
             request.destination === 'style' || 
             request.destination === 'script') {
      event.respondWith(
        caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(request)
              .then((response) => {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
                return response;
              })
              .catch(() => {
                if (request.destination === 'document') {
                  return caches.match('/index.html');
                }
              });
          })
      );
    }
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
    }
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return Promise.resolve();
}

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/favicon.png',
      badge: '/images/favicon.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
