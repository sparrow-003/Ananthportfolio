// SW v5 — fixes stale-HTML serving that caused
// "Failed to fetch dynamically imported module" errors on Vercel.
//
// The previous version (v4) used `fetch(request)` for HTML navigation,
// which respects the browser's HTTP cache. When a user had an older
// index.html cached, the SW would return it, and that stale HTML
// referenced older content-hashed chunks (e.g.
// DashboardContent-DnJpOkS4.js) that no longer exist on the server.
// The dynamic import would then 404.
//
// Fix:
//  1. Bump CACHE_VERSION to v5 to force-activate on all clients and
//     wipe the old shell cache.
//  2. Use `cache: 'reload'` for HTML navigation so the browser always
//     hits the network and returns the latest index.html, regardless
//     of what the HTTP cache has stored.
//  3. Skip waiting + claim clients on activate so the new SW takes
//     control immediately.
const CACHE_VERSION = 'v5';
const CACHE_NAME = `ananthdev-shell-${CACHE_VERSION}`;

const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/robots.txt',
  '/humans.txt',
  '/resume.pdf',
  '/placeholder.svg',
  '/pwa-192.png',
  '/pwa-512.png',
  '/apple-touch-icon.png',
];

const preCacheShell = async () => {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(APP_SHELL.map((url) => cache.add(url)));
};

self.addEventListener('install', (event) => {
  event.waitUntil(preCacheShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (request.headers.has('range')) return;
  if (url.pathname === '/sw.js') return;

  // Content-hashed assets are immutable — let the browser handle them
  // directly with its HTTP cache. Intercepting would force a network
  // round-trip on every chunk load and could mask stale-cache issues.
  if (url.pathname.startsWith('/assets/')) return;

  const acceptsHtml =
    request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (acceptsHtml) {
    // ALWAYS go to the network for HTML, bypassing the browser's HTTP
    // cache. This guarantees the client gets the latest index.html
    // with the latest content-hashed chunk references, eliminating
    // the stale-HTML → stale-chunk → 404 chain.
    event.respondWith(
      fetch(request, { cache: 'reload' })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match('/'))
    );
    return;
  }

  // Stale-while-revalidate for everything else (images, fonts, API GETs).
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
