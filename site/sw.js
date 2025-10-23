// Service Worker - Robot de Ventas Hotmart
const CACHE_NAME = 'robot-hotmart-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/manifest.webmanifest'
];

// Instalación: cachear recursos estáticos
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activación: limpiar cachés antiguos
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: estrategia Network First
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

// Push: mostrar notificación
self.addEventListener('push', event => {
  console.log('[SW] Push recibido');
  
  let notification = {
    title: 'Robot de Ventas',
    body: 'Tenemos novedades para vos',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-192.png',
    tag: 'hotmart-notification',
    requireInteraction: false,
    data: { url: '/' }
  };

  // Si viene payload JSON, usarlo
  if (event.data) {
    try {
      const payload = event.data.json();
      notification.title = payload.title || notification.title;
      notification.body = payload.body || notification.body;
      notification.data.url = payload.url || notification.data.url;
    } catch (e) {
      console.log('[SW] Push sin JSON, usando defaults');
    }
  }

  event.waitUntil(
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      tag: notification.tag,
      requireInteraction: notification.requireInteraction,
      data: notification.data
    })
  );
});

// Click en notificación: abrir/enfocar app
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click');
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Si ya hay una ventana abierta, enfocarla
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no, abrir nueva ventana
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

