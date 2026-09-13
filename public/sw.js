self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  return self.clients.claim();
});

// A simple fetch handler is required by Chrome to trigger the PWA install prompt
self.addEventListener('fetch', (event) => {
  // We don't intercept any requests, just pass them through
  return;
});
