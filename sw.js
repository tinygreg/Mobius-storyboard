// The year, unbound - service worker
// No version to bump: the page is fetched network-first, so every deploy of
// index.html arrives on the next online visit. Only edit this file if the
// caching strategy itself changes.
const CACHE = 'mobius-storyboard-static';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll([
        './',
        './index.html',
        './manifest.json',
        './icon-192.png',
        './icon-512.png',
        'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
      ]);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k); // sweeps all old versioned caches
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return; // sync pushes (POST) go straight to the network

  // Never cache Google sync endpoints - pulls must always be fresh
  if (req.url.indexOf('script.google') !== -1 ||
      req.url.indexOf('googleusercontent') !== -1) return;

  // The app page: network first so every deploy arrives, cache fallback offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        }
        return res;
      }).catch(function () {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // Immutable assets (versioned 3D library, hashed font files): cache first,
  // fetch and remember anything new
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
