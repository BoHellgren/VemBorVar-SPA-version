importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-beta.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

//workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.warn);

var rev = '31';

workbox.precaching.precacheAndRoute([{
    url: '/manifest.json',
    revision: rev
  },
  {
    url: '/favicon.ico',
    revision: rev
  },
  {
    url: '/index.html',
    revision: rev
  },
  {
    url: '/app.js',
    revision: rev
  },
  {
    url: '/registerServiceWorker.js',
    revision: rev
  },
  {
    url: '/theme.css',
    revision: rev
  },
  {
    url: '/assets/imgs/logga.png',
    revision: rev
  },
  {
    url: '/assets/imgs/logo.png',
    revision: rev
  },
  {
    url: '/assets/icon/apple-touch-icon.png',
    revision: rev
  },
  {
    url: '/assets/icon/icon-150x150.png',
    revision: rev
  },
  {
    url: '/assets/icon/if_arrow-right_227601.png',
    revision: rev
  },
]);

console.log('sw precache complete. revision: ', rev);

workbox.routing.registerRoute(
  new RegExp('/members.js'),
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  new RegExp('.*'),
  workbox.strategies.staleWhileRevalidate()
);

console.log('sw routing complete');

// my custom service worker code

self.addEventListener('push', function (e) {

  var body;
  if (e.data) {
    body = e.data.text();
  } else {
    body = 'Hälsningar från bostadsrättsföreningen.';
  };

  var options = {
    body: body,
    icon: 'assets/icon/icon-150x150.png',
    vibrate: [200, 100, 200],
    tag: 1,
    renotify: true,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '-push-notification'
    }

  };
  e.waitUntil(
    self.registration.showNotification('Brf Husarvikens Strand', options)
  );
})