// public/service-worker.js
// Service Worker básico para cache offline do ChatbotACS

const CACHE_NAME = 'chatbotacs-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/bundle.js', // ajuste conforme seu build
  // Adicione outros assets necessários
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});
