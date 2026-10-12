/* Atomic Models — offline service worker (rev. II, cache diet).

   What this deliberately does NOT do: cache Wikimedia photographs.

   Chromium charges an *opaque* cross-origin response to the origin's storage
   quota as if it were several megabytes, no matter how small the file is, and
   nothing in the Cache API can read an opaque body to check its size. Caching
   a handful of element photographs therefore inflated reported storage by tens
   of megabytes. The fix is to let the browser's ordinary HTTP cache hold them
   — Wikimedia sends long cache lifetimes — and reserve the service worker for
   the few assets that are small, same-origin, or CORS-readable.

   Strategy:
     navigations        network-first, cached shell as the offline fallback
     same-origin assets  cache-first from the precache list
     Google Fonts        stale-while-revalidate, size-capped (these are CORS)
     everything else     passthrough — no service-worker storage at all
*/

const CACHE_VERSION = "atomic-models-v2.2.0";
const RUNTIME = `${CACHE_VERSION}-runtime`;
const RUNTIME_MAX_ENTRIES = 12;
const RUNTIME_MAX_BYTES = 300 * 1024; // never store a single file above 300 KB

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

const isFonts = (url) => /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);

function isPrecached(url) {
  return url.origin === self.location.origin && PRECACHE.some((p) => url.pathname.endsWith(p.replace("./", "/")));
}

async function trim(cache, max) {
  const keys = await cache.keys();
  if (keys.length <= max) return;
  await Promise.all(keys.slice(0, keys.length - max).map((key) => cache.delete(key)));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Anything we do not explicitly cover — Wikimedia photographs included — goes
  // straight to the network and the browser's own HTTP cache.
  if (!sameOrigin && !isFonts(url)) return;

  // Navigations: network first, cached shell when offline.
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

  // The document its own assets: cache first.
  if (sameOrigin && isPrecached(url)) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request)));
    return;
  }

  // Web fonts only, and only when they are small enough to justify storage.
  if (isFonts(url)) {
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            const length = Number(response.headers.get("content-length") ?? 0);
            const small = length === 0 || length <= RUNTIME_MAX_BYTES;
            if (response.ok && small) {
              cache.put(request, response.clone()).then(() => trim(cache, RUNTIME_MAX_ENTRIES));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
