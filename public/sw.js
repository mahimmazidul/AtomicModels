/* Atomic Models — offline service worker (rev. II).
   Strategy: network-first for navigations (so a new deploy is picked up
   immediately), cache-first for same-origin assets, and a bounded runtime
   cache for the Google Fonts stylesheet and the Wikimedia Commons plates.
   Bump CACHE_VERSION whenever the build changes its asset URLs. */

const CACHE_VERSION = "atomic-models-v2.1.0";
const RUNTIME = `${CACHE_VERSION}-runtime`;
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION && key !== RUNTIME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

async function trim(cache, max) {
  const keys = await cache.keys();
  if (keys.length <= max) return;
  await Promise.all(keys.slice(0, keys.length - max).map((key) => cache.delete(key)));
}

function isPrecached(url) {
  return url.origin === self.location.origin && PRECACHE.some((p) => url.pathname.endsWith(p.replace("./", "/")));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) && url.hostname !== "commons.wikimedia.org" && url.hostname !== "upload.wikimedia.org") {
    return;
  }

  // Navigations: network first, fall back to the cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html").then((hit) => hit || caches.match("./")))
    );
    return;
  }

  // Same-origin static assets that we precached: cache first.
  if (sameOrigin && isPrecached(url)) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request))
    );
    return;
  }

  // Everything else (fonts, plates): stale-while-revalidate in a bounded cache.
  event.respondWith(
    caches.open(RUNTIME).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response && (response.ok || response.type === "opaque")) {
            cache.put(request, response.clone()).then(() => trim(cache, 40));
          }
          return response;
        })
        .catch(() => cached);
      if (cached) return cached;
      return network;
    })
  );
});
