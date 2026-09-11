const CACHE = "aula-smr-v49";
const ICON_CACHE = "aula-app-icon";
const PRECACHE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./css/skins.css",
  "./css/themes.css",
  "./css/plus.css",
  "./css/polish.css",
  "./css/hub.css",
  "./css/look.css",
  "./js/app.js",
  "./js/studio.js",
  "./js/tools.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/avatars/arcanine.jpg",
  "./assets/avatars/arceus.jpg",
  "./assets/avatars/blastoise.jpg",
  "./assets/avatars/charizard.jpg",
  "./assets/avatars/gyarados.jpg",
  "./assets/avatars/garchomp.jpg",
  "./assets/avatars/deoxys.jpg",
  "./assets/avatars/espeon.jpg",
  "./assets/avatars/gengar.jpg",
  "./assets/avatars/giratina.jpg",
  "./assets/avatars/groudon.jpg",
  "./assets/avatars/kyogre.jpg",
  "./assets/avatars/lucario.jpg",
  "./assets/avatars/lugia.jpg",
  "./assets/avatars/metagross.jpg",
  "./assets/avatars/mewtwo.jpg",
  "./assets/avatars/rayquaza.jpg",
  "./assets/avatars/salamence.jpg",
  "./assets/avatars/tyranitar.jpg",
  "./assets/avatars/umbreon.jpg",
  "./assets/avatars/venusaur.jpg",
  "./assets/avatars/zekrom.jpg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== ICON_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url && "focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

function dataToBlob(dataUrl) {
  const m = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  const bin = atob(m[2]);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: m[1] });
}

self.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.type !== "app-icon") return;
  e.waitUntil((async () => {
    const cache = await caches.open(ICON_CACHE);
    const png = { "Content-Type": "image/png", "Cache-Control": "no-store" };
    const json = { "Content-Type": "application/manifest+json", "Cache-Control": "no-store" };
    const b192 = dataToBlob(d.icon192);
    const b512 = dataToBlob(d.icon512);
    const put = (req, blob, headers) => cache.put(req, new Response(blob, { headers }));
    if (b192) {
      await put("icon-192.png", b192, png);
      await put("./assets/icon-192.png", b192, png);
      await put("./assets/apple-touch-icon.png", b192, png);
      await put("./app-icon/192.png", b192, png);
      await put("./app-icon/180.png", b192, png);
    }
    if (b512) {
      await put("icon-512.png", b512, png);
      await put("./assets/icon-512.png", b512, png);
      await put("./app-icon/512.png", b512, png);
    }
    if (d.manifest) {
      const manBlob = new Blob([JSON.stringify(d.manifest)], { type: "application/manifest+json" });
      await put("manifest.webmanifest", manBlob, json);
      await put("./manifest.webmanifest", manBlob, json);
    }
  })());
});

function iconCacheKey(url) {
  const p = url.pathname.replace(/\/+$/, "");
  if (p.endsWith("manifest.webmanifest") || p.includes("/app-icon/manifest")) return "manifest.webmanifest";
  if (p.includes("/app-icon/512") || p.endsWith("/icon-512.png")) return "icon-512.png";
  if (
    p.includes("/app-icon/192") ||
    p.includes("/app-icon/180") ||
    p.endsWith("/icon-192.png") ||
    p.endsWith("/apple-touch-icon.png")
  ) return "icon-192.png";
  return "";
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  const ik = iconCacheKey(url);
  if (ik) {
    e.respondWith(
      caches.open(ICON_CACHE).then((c) => c.match(ik)).then((hit) => {
        if (hit) return hit;
        return fetch(e.request)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => caches.match(e.request).then((h) => h || caches.match("./index.html")));
      })
    );
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match("./index.html")))
  );
});
