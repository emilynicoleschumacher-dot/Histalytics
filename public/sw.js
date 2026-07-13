const CACHE_NAME = "histalytics-v2";
const urlsToCache = [
  "/",
  "/dashboard",
  "/log-symptom",
  "/log-meal",
  "/log-product",
  "/history",
  "/recommendations",
  "/ingredients",
  "/trigger-ingredients",
  "/pricing",
  "/manifest.json"
];

// Install: cache the app shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch: network-first for HTML (always try new version first), cache-first for assets
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // For HTML navigation requests — try network first, fall back to cache
  if (req.mode === "navigate" || (req.method === "GET" && req.headers.get("accept")?.includes("text/html"))) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Cache the new version for offline fallback
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // For all other requests (JS, CSS, images) — cache-first for speed
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});

// Activate: clean old caches and take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      ),
      clients.claim(),
    ])
  );
});
