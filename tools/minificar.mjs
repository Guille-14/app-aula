#!/usr/bin/env node
/* Minifica la app para empaquetarla (APK) o para servirla más ligera.
 *
 *   node tools/minificar.mjs [destino]      # por defecto: www
 *
 * Qué hace:
 *   · copia tal cual lo que no se toca (sw.js, manifest.webmanifest, assets/…)
 *   · minifica el HTML, el CSS (clean-css) y el JS (terser)
 *   · mantiene los MISMOS nombres de archivo, así que el precache del service worker,
 *     las rutas de index.html y las comprobaciones del APK siguen valiendo igual
 *   · APP_VERSION se conserva a propósito: el comprobador del APK la busca dentro del APK
 *
 * El repositorio y las pruebas siguen usando el código legible: esto solo genera una copia.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { minify as minifyJs } from "terser";
import CleanCSS from "clean-css";
import { minify as minifyHtml } from "html-minifier-terser";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = path.resolve(RAIZ, process.argv[2] || "www");

const gz = (s) => zlib.gzipSync(Buffer.from(s)).length;
const kb = (n) => (n / 1024).toFixed(0) + "K";
const filas = [];
let antesTotal = 0, despuesTotal = 0, antesGz = 0, despuesGz = 0;

// «antes» y «despues» son textos: el gzip se calcula aquí para poder comparar de verdad
const tam = (x) => Buffer.byteLength(typeof x === "string" ? x : String(x));
const anota = (nombre, antes, despues) => {
  filas.push({ nombre, antes: tam(antes), despues: tam(despues) });
  antesTotal += tam(antes); despuesTotal += tam(despues);
  antesGz += gz(typeof antes === "string" ? antes : Buffer.alloc(antes));
  despuesGz += gz(typeof despues === "string" ? despues : Buffer.alloc(despues));
};

const escribir = (rel, contenido) => {
  const destino = path.join(DESTINO, rel);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, contenido);
};

const copiar = (rel) => {
  const origen = path.join(RAIZ, rel);
  const destino = path.join(DESTINO, rel);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.copyFileSync(origen, destino);
};

// Recorre una carpeta entera (con subcarpetas) y devuelve rutas relativas
const listar = (dir, filtro) => {
  const salida = [];
  const anda = (rel) => {
    for (const e of fs.readdirSync(path.join(RAIZ, rel), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const hijo = `${rel}/${e.name}`;
      if (e.isDirectory()) anda(hijo);
      else if (filtro(e.name)) salida.push(hijo);
    }
  };
  anda(dir);
  return salida;
};

fs.rmSync(DESTINO, { recursive: true, force: true });
fs.mkdirSync(DESTINO, { recursive: true });

// 1. lo que no se minifica
for (const rel of ["sw.js", "manifest.webmanifest"]) copiar(rel);
for (const rel of listar("assets", () => true)) copiar(rel);

// 2. CSS
for (const rel of [...listar("css", (f) => f.endsWith(".css"))]) {
  const src = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  const out = new CleanCSS({ level: 2 }).minify(src);
  if (out.errors && out.errors.length) throw new Error(`clean-css: ${rel}: ${out.errors[0]}`);
  escribir(rel, out.styles);
  anota(rel, src, out.styles);
}

// 3. JS
for (const rel of [...listar("js", (f) => f.endsWith(".js"))]) {
  const src = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  const out = await minifyJs(src, {
    compress: { passes: 2 },
    // APP_VERSION es la que lee el comprobador dentro del APK: no se puede renombrar.
    mangle: { reserved: ["APP_VERSION"] },
    format: { comments: false },
  });
  if (!out || typeof out.code !== "string") throw new Error(`terser: ${rel} no devolvió código`);
  escribir(rel, out.code);
  anota(rel, src, out.code);
}

// 4. HTML (al final: el index referencia los ficheros ya minificados)
{
  const src = fs.readFileSync(path.join(RAIZ, "index.html"), "utf8");
  const out = await minifyHtml(src, {
    collapseWhitespace: true,
    removeComments: false,          // los comentarios de CSP y de CSS se quedan: documentan
    keepClosingSlash: true,
    minifyCSS: false,               // el CSS va en sus ficheros, ya minificados
    minifyJS: false,                // y el JS también
  });
  escribir("index.html", out);
  anota("index.html", src, out);
}

// 5. resumen
console.log("\n  Minificado (los nombres de archivo no cambian)\n");
for (const f of filas) {
  console.log("   " + f.nombre.padEnd(22) + kb(f.antes).padStart(6) + " → " + kb(f.despues).padStart(6));
}
const pct = (100 - (despuesTotal / antesTotal) * 100).toFixed(0);
console.log("\n   " + "TOTAL".padEnd(22) + kb(antesTotal).padStart(6) + " → " + kb(despuesTotal).padStart(6) +
  `  (${pct} % menos · gzip ${kb(antesGz)} → ${kb(despuesGz)})`);
console.log("\n   Listo en " + path.relative(RAIZ, DESTINO) + "/\n");
