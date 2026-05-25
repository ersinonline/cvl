const CACHE_NAME = "civil-kasa-asistani-v3";
const OFFLINE_URLS = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./kasa-egitim.html",
  "./raporlar.html",
  "./pos-islemleri.html",
  "./ozel-odemeler.html",
  "./nakit-yatirma.html",
  "./kasa-duzeltme.html",
  "./masraf-duzeltme.html",
  "./fatura-portal.html",
  "./taksitler.html",
  "./sablon.html",
  "./havale-eft.html",
  "./chippin.html",
  "./gorus-oneri.html",
  "./header.html",
  "./sidebar.html",
  "./chat.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./dashboard.html");
          }

          return caches.match(event.request);
        });
    })
  );
});
