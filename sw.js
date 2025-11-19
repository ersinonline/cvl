const CACHE_NAME = "civil-kasa-v1";
const OFFLINE_URLS = [
  "/", 
  "/index.html",
  "/manifest.json",

  // CSS / JS / ICONS
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/lucide@latest",
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",

  // LOGO (ikon)
  "https://images.seeklogo.com/logo-png/32/2/civil-logo-png_seeklogo-326678.png"
];

// ➤ SW Yüklendiğinde dosyaları cache'e al
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Cache yükleniyor...");
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

// ➤ Yeni SW aktif edildiğinde eski cache'leri sil
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🗑 Eski cache silindi:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ➤ Her istek offline çalışacak şekilde yönlendirilir
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Cache'de varsa → offline moddan ver
      if (cachedResponse) {
        return cachedResponse;
      }

      // Eğer internetsiz istek gelmişse ve cache'de yoksa
      return fetch(event.request).catch(() => {
        return caches.match("/index.html");
      });
    })
  );
});
