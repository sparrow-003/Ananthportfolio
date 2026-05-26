const CACHE_NAME = 'genesis-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/humans.txt',
  '/resume.pdf',
  '/placeholder.svg'
];

// Install Service Worker and Precache Core Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching application shell...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate and Clean up Deprecated Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor supporting Stale-While-Revalidate and Network-First Strategies
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip non-GET requests entirely
  if (event.request.method !== 'GET') {
    return;
  }

  // Strategy A: Network-First for Supabase / Dynamic API Calls
  if (requestUrl.pathname.includes('/rest/v1/') || requestUrl.pathname.includes('/auth/v1/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.warn('[Service Worker] Network failed, pulling cached API response:', requestUrl.pathname);
          return caches.match(event.request);
        })
    );
    return;
  }

  // Strategy B: Stale-While-Revalidate for bundled assets, WebPs, fonts, HTML pages
  const isStaticAsset = 
    requestUrl.pathname.includes('/assets/') ||
    requestUrl.pathname.endsWith('.webp') ||
    requestUrl.pathname.endsWith('.woff2') ||
    requestUrl.pathname.endsWith('.png') ||
    requestUrl.pathname.endsWith('.css') ||
    requestUrl.pathname.endsWith('.js') ||
    requestUrl.pathname.endsWith('.html');

  if (isStaticAsset || STATIC_ASSETS.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200 || networkResponse.type === 'opaque') {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Silently swallow fetch failure (offline load)
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy C: Cache first with Network fallback for remaining items
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
