/* ФизиУм — service worker: офлайн-доступ к приложению.
   Все пути заданы относительно файла sw.js, поэтому приложение работает
   и в корне домена, и в подпапке (например, на GitHub Pages). */
const CACHE = 'fizium-v2';
const ROOT = new URL('./', self.location.href); // корень приложения
const CORE = [
  ROOT.href,
  new URL('manifest.webmanifest', self.location.href).href,
  new URL('logo.svg', self.location.href).href,
  new URL('icons/icon-192.png', self.location.href).href,
  new URL('icons/icon-512.png', self.location.href).href,
  new URL('icons/maskable-512.png', self.location.href).href,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Навигация: сеть → кэш → офлайн-оболочка
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(ROOT, copy));
          return res;
        })
        .catch(() => caches.match(ROOT).then((r) => r || Response.error()))
    );
    return;
  }

  // Статика: кэш → сеть (с фоновым обновлением)
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
