// Saathi service worker: works offline after the first visit, and shows dose reminders.
const CACHE = "saathi-v3";
const SHELL = [
  "./", "index.html", "app.html", "styles.css", "fonts.css", "core.js", "demo.js", "real.js", "sync.js", "parser.js",
  "firebase/config.json", "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png",
  "vendor/qrcode/qrcode.js", "sample-prescription.png", "vendor/tesseract/tesseract.min.js", "vendor/tesseract/worker.min.js",
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // Firestore and the Firebase SDK go straight to the network
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window" }).then((ws) => {
    const w = ws.find((c) => c.url.includes("app.html"));
    return w ? w.focus() : self.clients.openWindow("app.html");
  }));
});
