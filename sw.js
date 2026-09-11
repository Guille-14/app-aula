const CACHE = "aula-smr-v63";
const ICON_CACHE = "aula-app-icon";
const PRECACHE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./css/skins.css",
  "./css/themes.css",
  "./css/ui.css",
  "./js/tema.js",
  "./js/avisos.js",
  "./js/media.js",
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

// Rutas del precache, normalizadas a «pathname»: se usan para decidir cuándo servir
// desde caché sin ni siquiera tocar la red.
const PRECACHE_PATHS = new Set(
  PRECACHE.map((u) => {
    try { return new URL(u, self.location.href).pathname.replace(/\/+$/, "") || "/"; }
    catch { return ""; }
  })
);
const esPrecache = (url) => {
  const p = url.pathname.replace(/\/+$/, "") || "/";
  return PRECACHE_PATHS.has(p) || (p === "/" && PRECACHE_PATHS.has(""));
};

self.addEventListener("install", (e) => {
  // addAll es todo o nada: si un solo recurso falla, se cachea uno a uno para saber cuál.
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll(PRECACHE).catch(() =>
        Promise.all(PRECACHE.map((u) => c.add(u).catch((err) => console.warn("No cacheado:", u, err && err.message))))
      )
    )
  );
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

  // CACHÉ PRIMERO para todo lo que va dentro del precache (la app entera: HTML, CSS, JS,
  // iconos y avatares). Es una app local: los archivos solo cambian al publicar una versión
  // nueva, y entonces CACHE cambia de nombre, se llena en el install y el activate borra el
  // viejo. Antes esto era «red primero» para TODO, así que cada apertura esperaba un viaje de
  // red (que en el instituto con wifi floja es eterno) para servir algo que no había cambiado.
  // Si algún día hay contenido remoto de verdad, ese contenido NO va aquí: usa otra ruta.
  if (esPrecache(url)) {
    e.respondWith(cachePrimero(e.request));
    return;
  }

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
          .catch(() => caches.match(e.request).then((h) => h || offlineFallback(e.request)));
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
      .catch(() => caches.match(e.request).then((hit) => hit || offlineFallback(e.request)))
  );
});

// Sirve de caché al instante, sin tocar la red. La frescura la garantiza el ciclo del
// propio service worker: al publicar, sw.js cambia (lleva el número de versión), el
// navegador instala el nuevo, llena la caché nueva entera y borra la vieja.
async function cachePrimero(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch {
    return offlineFallback(req);
  }
}

// Si el recurso no está en caché: el HTML cae a index.html (modo app),
// pero un JS/CSS/imagen NUNCA se sustituye por HTML: eso rompía la app entera.
function offlineFallback(req) {
  const dest = req.destination || "";
  const url = new URL(req.url);
  const tipo = dest || (url.pathname.endsWith(".js") ? "script" : url.pathname.endsWith(".css") ? "style" : "");
  if (tipo === "script") return new Response("/* sin conexión y sin caché */", { status: 504, headers: { "Content-Type": "application/javascript" } });
  if (tipo === "style") return new Response("/* sin conexión y sin caché */", { status: 504, headers: { "Content-Type": "text/css" } });
  if (tipo === "image") return new Response("", { status: 504 });
  if (req.mode === "navigate" || dest === "document" || tipo === "") {
    return caches.match("./index.html").then(
      (hit) =>
        hit ||
        new Response(
          "<!DOCTYPE html><meta charset=\"utf-8\"><title>Aula SMR</title><p style=\"font:16px system-ui;padding:24px\">Sin conexión y sin copia guardada. Abre la app una vez con internet y quedará lista para siempre.",
          { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
        )
    );
  }
  return new Response("", { status: 504 });
}
