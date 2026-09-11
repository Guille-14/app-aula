/* Almacén de fotos y adjuntos de Aula SMR.
 *
 * Antes las fotos se guardaban dentro del JSON del estado, que vive entero en
 * localStorage (unos 5 MB de tope en el móvil). Con dos fotos, la app se quedaba
 * sin sitio y dejaba de guardar. Ahora los archivos van a IndexedDB (sin límite
 * práctico) y el estado solo guarda la ficha: id, nombre y tamaño.
 *
 * Si el navegador no tiene IndexedDB (o estamos en modo privado de algunos
 * navegadores), todo sigue funcionando como antes: el adjunto se queda dentro
 * del estado. Por eso `available()` existe y se consulta antes de decidir.
 */
(function () {
  "use strict";

  const DB_NAME = "aula-smr-media";
  const DB_VERSION = 1;
  const STORE = "files";

  const urls = new Map();      // id -> object URL / data URL listo para el <img>
  const pendientes = new Map(); // id -> Promise (evita pedir dos veces lo mismo)
  let db = null;
  let dbOk = null;   // null = aún no se ha comprobado
  let abriendo = null;

  const hayIDB = () => {
    try { return typeof indexedDB !== "undefined" && !!indexedDB; } catch { return false; }
  };
  const available = () => hayIDB() && dbOk !== false;

  function abrir() {
    if (!hayIDB()) return Promise.reject(new Error("sin IndexedDB"));
    if (db) return Promise.resolve(db);
    if (abriendo) return abriendo;
    abriendo = new Promise((resolve, reject) => {
      let req;
      try { req = indexedDB.open(DB_NAME, DB_VERSION); } catch (e) { reject(e); return; }
      req.onupgradeneeded = () => {
        const base = req.result;
        if (!base.objectStoreNames.contains(STORE)) base.createObjectStore(STORE, { keyPath: "id" });
      };
      req.onsuccess = () => { db = req.result; dbOk = true; resolve(db); };
      req.onerror = () => { dbOk = false; reject(req.error || new Error("no se pudo abrir")); };
      req.onblocked = () => { dbOk = false; reject(new Error("bloqueado por otra pestaña")); };
    }).catch((e) => { abriendo = null; throw e; });
    return abriendo;
  }

  // Comprueba al arrancar si hay IndexedDB de verdad (en modo privado, a veces no).
  const ready = () => abrir().then(() => true).catch(() => false);

  function tx(modo) {
    return abrir().then((base) => base.transaction(STORE, modo).objectStore(STORE));
  }
  function pedir(peticion) {
    return new Promise((resolve, reject) => {
      peticion.onsuccess = () => resolve(peticion.result);
      peticion.onerror = () => reject(peticion.error || new Error("fallo en IndexedDB"));
    });
  }

  // data URL <-> Blob (para importar/exportar copias completas)
  function dataURLaBlob(dataURL) {
    const d = bytesDeDataURL(dataURL);
    return d ? new Blob([d.bytes], { type: d.type }) : null;
  }
  function bytesDeDataURL(dataURL) {
    const m = String(dataURL || "").match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
    if (!m) return null;
    const tipo = m[1] || "image/jpeg";
    const bruto = m[2] ? atob(m[3]) : decodeURIComponent(m[3]);
    const bytes = new Uint8Array(bruto.length);
    for (let i = 0; i < bruto.length; i++) bytes[i] = bruto.charCodeAt(i);
    return { bytes, type: tipo };
  }
  // Bytes de un Blob (jsdom antiguo no tiene blob.arrayBuffer)
  function bytesDeBlob(blob) {
    if (blob && typeof blob.arrayBuffer === "function") return blob.arrayBuffer();
    return new Promise((resolve, reject) => {
      try {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = () => reject(fr.error || new Error("no se pudo leer"));
        fr.readAsArrayBuffer(blob);
      } catch (e) { reject(e); }
    });
  }
  function blobaDataURL(blob) {
    return new Promise((resolve) => {
      try {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result || ""));
        fr.onerror = () => resolve("");
        fr.readAsDataURL(blob);
      } catch { resolve(""); }
    });
  }
  async function aDataURL(entrada) {
    if (!entrada) return "";
    if (typeof entrada === "string") return entrada;
    return blobaDataURL(entrada.blob || entrada);
  }

  // ---------------------------------------------------------------- API pública
  async function put(id, contenido) {
    let bytes, tipo, tam;
    if (typeof contenido === "string") {
      const d = bytesDeDataURL(contenido);
      if (!d) throw new Error("contenido no válido");
      bytes = d.bytes.buffer ? (d.bytes.byteLength === d.bytes.buffer.byteLength ? d.bytes.buffer : d.bytes.slice().buffer) : null;
      tipo = d.type; tam = d.bytes.byteLength;
    } else {
      if (!contenido) throw new Error("contenido no válido");
      bytes = await bytesDeBlob(contenido);
      tipo = contenido.type || "image/jpeg"; tam = contenido.size || bytes.byteLength;
    }
    const store = await tx("readwrite");
    // ArrayBuffer: es lo que todos los navegadores copian igual dentro de IndexedDB
    await pedir(store.put({ id, buf: bytes, type: tipo, size: tam, t: Date.now() }));
    urls.delete(id);
    return ensure(id);
  }

  async function get(id) {
    try {
      const store = await tx("readonly");
      const fila = await pedir(store.get(id));
      if (!fila) return null;
      return { id: fila.id, blob: new Blob([fila.buf], { type: fila.type || "image/jpeg" }), type: fila.type, size: fila.size, t: fila.t };
    } catch { return null; }
  }
  async function dataURL(id) {
    const fila = await get(id);
    return fila ? aDataURL(fila) : "";
  }
  async function del(id) {
    urls.delete(id);
    pendientes.delete(id);
    try { const store = await tx("readwrite"); await pedir(store.delete(id)); } catch {}
  }
  async function clear() {
    urls.forEach((u) => { try { URL.revokeObjectURL(u); } catch {} });
    urls.clear(); pendientes.clear();
    try { const store = await tx("readwrite"); await pedir(store.clear()); return true; } catch { return false; }
  }
  async function usage() {
    try {
      const store = await tx("readonly");
      const filas = (await pedir(store.getAll())) || [];
      return { n: filas.length, bytes: filas.reduce((a, f) => a + (f.size || 0), 0) };
    } catch { return { n: 0, bytes: 0 }; }
  }
  async function all() {
    try {
      const store = await tx("readonly");
      return (await pedir(store.getAll())) || [];
    } catch { return []; }
  }
  async function keys() { return (await all()).map((f) => f.id); }

  // Igual que urlFor, pero esperando a que esté lista (para exportar o para pruebas)
  async function ensure(id) {
    if (!id) return null;
    if (urls.has(id)) return urls.get(id);
    urlFor(id);
    if (pendientes.has(id)) return pendientes.get(id);
    const fila = await get(id);
    if (!fila) return null;
    let src = "";
    if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
      try { src = URL.createObjectURL(fila.blob); } catch { src = ""; }
    }
    if (!src) src = await aDataURL(fila);
    if (src) urls.set(id, src);
    return src || null;
  }

  // src para un <img>: primero memoria, si no hay, se carga en segundo plano
  function urlFor(id) {
    if (!id) return null;
    if (urls.has(id)) return urls.get(id);
    if (!pendientes.has(id)) {
      pendientes.set(id, get(id).then(async (fila) => {
        pendientes.delete(id);
        if (!fila) return null;
        let src = "";
        if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
          try { src = URL.createObjectURL(fila.blob); } catch { src = ""; }
        }
        if (!src) src = await aDataURL(fila);
        if (src) { urls.set(id, src); hidratar(id, src); }
        return src;
      }).catch(() => { pendientes.delete(id); return null; }));
    }
    return null;
  }

  // Rellena los <img> que están esperando esa foto (por eso el render no se bloquea)
  function hidratar(id, src) {
    try {
      // El id puede venir de una copia importada: se escapa para que el selector no rompa
      const limpio = (window.CSS && CSS.escape) ? CSS.escape(String(id)) : String(id).replace(/["'\\]/g, "");
      document.querySelectorAll(`[data-media="${limpio}"]`).forEach((el) => {
        if (el.tagName === "IMG") { el.src = src; el.classList.remove("is-loading"); }
        else el.style.backgroundImage = `url("${src}")`;
      });
    } catch {}
  }
  // Tras pintar una vista, se piden las fotos que falten
  function hydrate(root) {
    try {
      (root || document).querySelectorAll("[data-media]").forEach((el) => urlFor(el.dataset.media));
    } catch {}
  }

  function srcFor(id, fallback) {
    return urlFor(id) || (fallback || "");
  }

  window.AulaMedia = {
    available, ready, put, get, dataURL, del, clear, usage, all, keys, ensure,
    urlFor, srcFor, hydrate, hidratar,
    dataURLaBlob, blobaDataURL,
  };
})();
