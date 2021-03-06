const
  CACHE_NAME = `${APP_NAME}-static-1`,
  cachedFiles = [
    '/index.html',
    '/restaurant.html',
    '/img/1.webp',
    '/img/2.webp',
    '/img/3.webp',
    '/img/4.webp',
    '/img/5.webp',
    '/img/6.webp',
    '/img/7.webp',
    '/img/8.webp',
    '/img/9.webp',
    '/img/10.webp',
    '/img/app-logo16.webp',
    '/img/app-logo48.webp',
    '/img/app-logo64.webp',
    '/img/app-logo128.webp',
    '/img/app-logo256.webp',
    '/img/app-logo512.webp',
    'img/google_map-w320_h400.webp',
    'img/google_map-w412_h400.webp',
    'img/google_map-w740_h400.webp',
    'img/google_map-w1000_h400.webp',
    'img/google_map-w1920_h400.webp',
    'img/google_map-w2545_h400.webp',
    '/sw.js',
    '/manifest.json',
    '/favicon.ico'
  ];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
    .open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(cachedFiles);
    })
    .catch(e => d(`(install) caching error: ${e}`))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
    .keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames
        .filter(name => {
          return name.startsWith('av-rr-') && name !== CACHE_NAME;
        })
        .map(name => {
          return caches.delete(name);
        })
      );
    })
    .catch(e => d(`(activate) caching error: ${e}`))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    // cache only get requests
    event.respondWith(
      caches.open(CACHE_NAME)
      .then(cache => {
        return cache.match(event.request)
          .then(resp => {
            return (resp ||
              fetch(event.request)
              .then(resp => {
                cache.put(event.request, resp.clone());

                return resp;
              })
              .catch(e => d(`(fetch) error: ${e}`))
            );
          })
          .catch(e => d(`(fetch) exception in cache match. Error: ${e}`));
      })
      .catch(e => d(`(fetch) exception when openning cache ${CACHE_NAME}. Error: ${e}`))
    );
  }
});

self.addEventListener('sync', event => {
  // synchronize offline data with server
  if (event.tag === 'syncUp')
    event.waitUntil(DBHelper.syncData());
});