const CACHE_NAME = 'toko-kita-v1';

// Path relatif karena diakses via app-toko.test (bukan localhost/app-toko/)
const ASSETS_TO_CACHE = [
    '/tokotest/app-toko/index.html',
    '/tokotest/app-toko/app.js',
    '/tokotest/app-toko/manifest.json',
    '/tokotest/app-toko/simple.html',
    '/tokotest/app-toko/tambah.html',
    '/tokotest/app-toko/icons/icon-192x192.png',
    '/tokotest/app-toko/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    console.log('[SW] Install...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // API → Network-First
    if (url.hostname === 'api-toko.test') {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // Aset statis → Cache-First
    event.respondWith(cacheFirst(event.request));
});

async function networkFirst(request) {
    try {
        const res = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, res.clone());
        return res;
    } catch {
        const cached = await caches.match(request);
        return cached || new Response(
            JSON.stringify({ status: 'error', message: 'Offline.' }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }
}

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
        const res = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, res.clone());
        return res;
    } catch {
        return new Response('<h2>Offline.</h2>', { headers: { 'Content-Type': 'text/html' } });
    }
}