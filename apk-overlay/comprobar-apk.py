#!/usr/bin/env python3
"""Comprueba un APK ya compilado: firma, versión de la web y widgets empaquetados.

Uso:  python3 apk-overlay/comprobar-apk.py <apk> [salida-de-apksigner]

Deja los datos en `.datos-apk` (clave=valor, para GitHub Actions) y devuelve 0
solo si todo cuadra. Es el mismo control que hace el flujo del APK.
"""
from pathlib import Path
import hashlib
import os
import re
import sys
import zipfile

apk = sys.argv[1] if len(sys.argv) > 1 else "android/app/build/outputs/apk/release/app-release.apk"
firma_txt = sys.argv[2] if len(sys.argv) > 2 else "firma.txt"

fallos = []


def ok(cond, texto, detalle=""):
    print(("  OK    " if cond else "  FALLO ") + texto + (("  (" + str(detalle) + ")") if detalle else ""))
    if not cond:
        fallos.append(texto)
    return cond


# ---------------------------------------------------------------- firma
firma = Path(firma_txt).read_text(encoding="utf-8", errors="ignore") if Path(firma_txt).exists() else ""
dn = ""
for linea in firma.splitlines():
    if "certificate DN" in linea:
        dn = linea.split("DN", 1)[-1].lstrip(": ").strip()
        break
digest = ""
for linea in firma.splitlines():
    if "certificate SHA-256 digest" in linea:
        cola = linea.split(":")[-1].strip()
        if re.fullmatch(r"[0-9a-fA-F]{64}", cola):
            digest = cola.lower()
            break
esquemas = ",".join(sorted(set(re.findall(r"Verified using (v\d) scheme[^:]*: true", firma))))
print("FIRMA")
ok(bool(firma), "apksigner dio su veredicto")
ok(bool(dn), "certificado con nombre", dn)
ok(bool(digest), "SHA-256 del certificado", digest)
ok(bool(esquemas), "esquemas de firma verificados", esquemas or "ninguno")

# ---------------------------------------------------------------- contenido
print("CONTENIDO")
z = zipfile.ZipFile(apk)
nombres = z.namelist()

man = z.read("AndroidManifest.xml")
man_utf8 = man.decode("utf-8", "ignore")
man_utf16 = man.decode("utf-16-le", "ignore")
widgets_man = max(man_utf8.count("APPWIDGET_UPDATE"), man_utf16.count("APPWIDGET_UPDATE"))
widgets_xml = [n for n in nombres if re.match(r"res/xml/widget_.*_info\.xml$", n)]

try:
    app = z.read("assets/public/js/app.js").decode("utf-8", "ignore")
except KeyError:
    app = ""
m = re.search(r'APP_VERSION\s*=\s*"(v\d+)"', app)
ver = m.group(1) if m else ""
media = "assets/public/js/media.js" in nombres
paginas = "assets/public/index.html" in nombres
paquete = "es.aula.smr.hub" in (man_utf8 + man_utf16)

print("  (los datos declarados en el manifest:", widgets_man, "· ficheros res/xml/widget_*:", len(widgets_xml), ")")
ok(paginas, "index.html empaquetado")
ok(bool(app), "js/app.js empaquetado")
ok(media, "js/media.js empaquetado (fotos en IndexedDB)")
ok(bool(ver), "versión de la web dentro del APK", ver or "no encontrada")
ok(widgets_xml >= 24 or widgets_man >= 24, "los 24 widgets van dentro", "res/xml: %d · manifest: %d" % (len(widgets_xml), widgets_man))
ok(paquete, "paquete es.aula.smr.hub")

# ---------------------------------------------------------------- datos
sha = hashlib.sha256(Path(apk).read_bytes()).hexdigest()
mb = "%.1f" % (os.path.getsize(apk) / 1048576)
print("ARCHIVO")
print("  %s MB · sha256 %s" % (mb, sha))

with open(".datos-apk", "w", encoding="utf-8") as f:
    for k, v in {
        "sha": sha, "mb": mb, "firma": digest, "firma_dn": dn, "esquemas": esquemas,
        "app": ver, "widgets": max(widgets_xml, widgets_man),
        "media": "sí" if media else "NO",
    }.items():
        f.write("%s=%s\n" % (k, v))

if fallos:
    print("\n%d comprobaciones fallidas: %s" % (len(fallos), " · ".join(fallos)))
    sys.exit(1)
print("\nTodo correcto: el APK está firmado y lleva dentro lo que debe.")
