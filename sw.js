const CACHE_NAME = 'pituacu-v1';
const FILES = [
  '/pituacu_saida_cana_1.html',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
];

// Instala e faz cache dos arquivos
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(['/pituacu_saida_cana_1.html']);
    })
  );
  self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições — serve do cache se offline
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // Salva no cache se for o HTML principal
        if (e.request.url.includes('pituacu_saida_cana_1.html')) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      })
      .catch(function() {
        // Offline: serve do cache
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match('/pituacu_saida_cana_1.html');
        });
      })
  );
});
