// Service Worker for Push Notifications
const CACHE_NAME = 'bhumika-shop-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  let notificationData = {
    title: 'Bhumika Shop',
    body: 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'bhumika-shop',
    renotify: true,
    requireInteraction: false,
    actions: [
      {
        action: 'view-cart',
        title: 'View Cart'
      },
      {
        action: 'checkout',
        title: 'Checkout'
      }
    ]
  };

  // Try to parse the push data
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
      console.log('Service Worker: Push data parsed', data);
    } catch (e) {
      console.error('Service Worker: Error parsing push data', e);
    }
  }

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  // Handle different actions
  if (event.action === 'view-cart') {
    event.waitUntil(
      clients.openWindow('/cart')
    );
  } else if (event.action === 'checkout') {
    event.waitUntil(
      clients.openWindow('/checkout')
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('Service Worker: Notification closed');
});

// Message event for communication with main app
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
