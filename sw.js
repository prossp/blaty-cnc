"use strict";

const CACHE = "blaty-cnc-v3";
const SHARED_CACHE = "shared-file";
const SHARED_KEY = "shared-dxf";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE && k !== SHARED_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function handleShare(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (file && typeof file !== "string") {
      const cache = await caches.open(SHARED_CACHE);
      await cache.put(SHARED_KEY, new Response(file, {
        headers: {
          "Content-Type": "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name || "udostepniony.dxf"),
        },
      }));
    }
  } catch (e) { /* brak pliku — strona zgłosi to w logu */ }
  return Response.redirect("./?share-target=1", 303);
}

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method === "POST" && url.pathname.endsWith("/share-target")) {
    event.respondWith(handleShare(req));
    return;
  }
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // stale-while-revalidate (parametry zapytania ignorowane, by ?share-target=1 trafiało w cache)
  event.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req).then(res => {
        if (res && res.ok) cache.put(req.mode === "navigate" ? "./" : req, res.clone());
        return res;
      }).catch(() => null);
      if (cached) { event.waitUntil(network); return cached; }
      return (await network) || cache.match("./index.html") || Response.error();
    })
  );
});
