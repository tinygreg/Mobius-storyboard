// The year, unbound - service worker
// No version to bump. The page is served instantly from cache while a fresh
// copy is fetched behind it; when the fresh copy differs, the page shows its
// "Update ready" toast. Only edit this file if the strategy itself changes.
//
// (Fixed: the cached page's text is snapshotted BEFORE the response is handed
// to the browser - cloning it afterwards fails silently, which froze updates.)
const CACHE = 'mobius-storyboard-static';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all([
        c.addAll([
          './',
          './manifest.json',
          './icon-192.png',
          './icon-512.png',
          'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        ]),
        // the page itself is fetched past every HTTP cache, so a brand-new
        // worker always starts from the truly latest deploy
        fetch('./index.html', { cache: 'no-store' }).then(function (r) {
          if (r && r.ok) return c.put('./index.html', r);
        }).catch(function () {})
      ]);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function tellPages() {
  return self.clients.matchAll({ type: 'window' }).then(function (cs) {
    cs.forEach(function (c) { c.postMessage({ type: 'update-ready' }); });
  });
}

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return; // sync pushes (POST) go straight to the network

  // Never cache Google sync endpoints - pulls must always be fresh
  if (req.url.indexOf('script.google') !== -1 ||
      req.url.indexOf('googleusercontent') !== -1) return;

  // The app page: serve the cached copy instantly, check for a new deploy
  // behind it, and raise the toast when one has landed
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then(function (cached) {
        // snapshot the cached text NOW, before the browser consumes the body
        const cachedText = cached
          ? cached.clone().text().catch(function () { return null; })
          : Promise.resolve(null);
        // bypass the HTTP cache so a fresh deploy is seen immediately
        const network = fetch(req.url, { cache: 'no-store', credentials: 'same-origin' })
          .then(function (res) {
            if (!(res && res.ok)) return res;
            const forCache = res.clone(), forText = res.clone();
            e.waitUntil(
              Promise.all([cachedText, forText.text()]).then(function (pair) {
                if (pair[0] === pair[1]) return;
                return caches.open(CACHE)
                  .then(function (c) { return c.put('./index.html', forCache); })
                  .then(function () { if (pair[0] !== null) return tellPages(); });
              }).catch(function () {})
            );
            return res;
          });
        if (cached) { e.waitUntil(network.catch(function () {})); return cached; }
        return network.catch(function () { return caches.match('./index.html'); });
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
