/* code used here from the udacity course and google developers Caching Files with Service Worker samples*/
let staticCacheName = 'mws-restaurant-cache-1';
var allCaches = [
  staticCacheName
];
let urlsToCache = [
  '/index.html',
  '/restaurant.html',
  'css/styles.css',
  'js/main.js',
  'js/dbhelper.js',
  'js/restaurant_info.js'
];


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      console.log("inside install")
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log("inside activate")
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  let requestUrl = new URL(event.request.url);
  event.respondWith(
    caches.open(staticCacheName).then(function(cache) {
      return caches.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
