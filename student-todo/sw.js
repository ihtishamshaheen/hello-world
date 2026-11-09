const CACHE_NAME = "study-desk-static-v1";
const SUPABASE_CLIENT_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./config.js",
    "./manifest.webmanifest",
    "./icons/icon.svg",
    "./offline.html",
    SUPABASE_CLIENT_URL
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const requestUrl = new URL(event.request.url);
    if (requestUrl.href === SUPABASE_CLIENT_URL) {
        event.respondWith(
            caches.match(event.request).then((cached) =>
                cached || fetch(event.request).then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                    return response;
                })
            )
        );
        return;
    }
    if (requestUrl.origin !== self.location.origin) return;

    if (event.request.mode === "navigate") {
        event.respondWith(fetch(event.request).catch(() => caches.match("./offline.html")));
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match("./offline.html")))
    );
});
