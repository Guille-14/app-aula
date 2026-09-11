#!/usr/bin/env node
/* Pasa TODA la batería de pruebas sobre el código minificado, que es el que va dentro del APK.
 *
 * No es una manía: minificar cambia el código (terser convirtió `const APP_VERSION = "v63"`
 * en `APP_VERSION:"v63"` y el comprobador del APK ya no lo encontraba), y ese fallo solo se
 * veía al publicar. Esto lo pilla antes, en el mismo push.
 *
 *   Uso:  node tools/probar-minificado.mjs      (o `npm run test:min`)
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WEB = ["index.html", "manifest.webmanifest", "sw.js", "js", "css", "assets"];
const COPIAR = ["tests", "apk-overlay", "package.json", "package-lock.json"];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "aula-min-"));
try {
  console.log("· minificando la web…");
  execFileSync(process.execPath, [path.join(ROOT, "tools", "minificar.mjs"), path.join(tmp, "web")], { stdio: "pipe" });
  for (const f of WEB) fs.cpSync(path.join(tmp, "web", f), path.join(tmp, f), { recursive: true });
  for (const f of COPIAR) fs.cpSync(path.join(ROOT, f), path.join(tmp, f), { recursive: true });
  fs.symlinkSync(path.join(ROOT, "node_modules"), path.join(tmp, "node_modules"));
  console.log("· pasando las pruebas sobre el código minificado…");
  const salida = execFileSync(process.execPath, [path.join(tmp, "tests", "smoke.test.js")], {
    cwd: tmp, env: { ...process.env, AULA_ROOT: tmp }, encoding: "utf8",
  });
  const resumen = salida.split("\n").filter((l) => /✓|✗|Todo bien|fallos/.test(l)).join("\n");
  console.log(resumen.trim());
  console.log("\nEl código minificado (lo que va dentro del APK) pasa las mismas pruebas que el de casa.");
} catch (e) {
  console.error("El código minificado NO pasa las pruebas. Esto es lo que va dentro del APK:\n");
  console.error(String((e.stdout || "") + (e.stderr || "")).split("\n").slice(-25).join("\n"));
  process.exit(1);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
