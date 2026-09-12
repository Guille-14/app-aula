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

AQUI = Path(__file__).resolve().parent
apk = sys.argv[1] if len(sys.argv) > 1 else "android/app/build/outputs/apk/release/app-release.apk"
firma_txt = sys.argv[2] if len(sys.argv) > 2 else "firma.txt"

fallos = []


def ok(cond, texto, detalle=""):
    print(("  OK    " if cond else "  FALLO ") + texto + (("  (" + str(detalle) + ")") if detalle else ""))
    if not cond:
        fallos.append(texto)
    return cond


def info(texto):
    print("  ·     " + texto)


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
lineas_esquema = [l.strip() for l in firma.splitlines() if "Verified using" in l]
esquemas = ",".join(sorted({
    (re.search(r"\bv\d\b", l, re.I).group(0).lower() if re.search(r"\bv\d\b", l, re.I) else "?")
    for l in lineas_esquema if re.search(r":\s*true\s*$", l, re.I)
}))

print("FIRMA")
ok(bool(firma), "apksigner dio su veredicto")
ok(bool(dn), "certificado con nombre", dn)
ok(bool(digest), "SHA-256 del certificado", digest)
if esquemas:
    info("esquemas de firma verificados: " + esquemas)
else:
    info("apksigner no listó los esquemas (es informativo, no un fallo)")

# ---------------------------------------------------------------- contenido
print("CONTENIDO")
if not Path(apk).exists():
    print("FALLO  no existe el APK:", apk)
    sys.exit(1)
try:
    z = zipfile.ZipFile(apk)
except zipfile.BadZipFile:
    print("FALLO  el fichero no es un APK (zip) válido:", apk)
    sys.exit(1)
nombres = z.namelist()

man = z.read("AndroidManifest.xml")
man_txt = man.decode("utf-8", "ignore") + "\n" + man.decode("utf-16-le", "ignore")

# Los widgets se comprueban en el dex: en el manifest, AAPT2 guarda el nombre de la
# acción una sola vez (deduplica) y acorta las rutas de res/xml en las compilaciones
# de release, así que contar ahí no dice nada.
try:
    dex = z.read("classes.dex")
except KeyError:
    dex = b""
texto_apply = (AQUI / "apply.py").read_text(encoding="utf-8")
bloque = texto_apply.split("WIDGETS = [")[1].split("]")[0]
esperados = [m.group(1) for m in re.finditer(r'\(\s*"[a-z_]+",\s*"([A-Za-z]+)"', bloque)]
faltan = [c for c in esperados if c.encode() not in dex]

try:
    app = z.read("assets/public/js/app.js").decode("utf-8", "ignore")
except KeyError:
    app = ""
# Ojo con la forma: la web va minificada dentro del APK y terser convierte
# `const APP_VERSION = "v63"` en `APP_VERSION:"v63"` al meterlo en el objeto de la API.
# Aceptamos las dos (y de paso cualquier espacio raro).
m = re.search(r'APP_VERSION\s*[:=]\s*"(v[\d.]+)"', app)
ver = m.group(1) if m else ""
# La versión de la web tiene que ser la misma que la del paquete (de ahí sale la etiqueta
# de la Release): v62 y v62.1 valen para 62.0.1, pero «v61» dentro de un APK 62 ya no.
esperada = ""
try:
    import json
    pkg_ver = json.loads(Path("package.json").read_text(encoding="utf-8"))["version"]
    esperada = "v" + pkg_ver.split(".")[0]
except Exception:
    pkg_ver = ""
if ver and esperada and ver.split(".")[0] != esperada:
    fallos_ver = "la web dice %s y el paquete es %s" % (ver, pkg_ver)
else:
    fallos_ver = ""

media = "assets/public/js/media.js" in nombres
paginas = "assets/public/index.html" in nombres
paquete = "es.aula.smr.hub" in man_txt

# Los plugins de Capacitor (notificaciones programadas, guardar y compartir archivos) tienen
# que estar COMPILADOS dentro. Si alguien cambia `cap sync` por `cap copy`, el JavaScript
# seguiría ahí pero las funciones nativas no: la app avisaría de nada y no guardaría archivos.
# Sus clases viven en los .dex, así que se buscan ahí (y el permiso, en el manifest).
plugins = {
    "notificaciones programadas": (b"LocalNotificationsPlugin", "POST_NOTIFICATIONS"),
    "guardar y compartir archivos": (b"FilesystemPlugin", None),
    "hoja de compartir de Android": (b"SharePlugin", None),
}

info("ficheros res/xml con nombre de widget: %d (en release se acortan: es normal)"
     % len([n for n in nombres if re.match(r"res/xml/widget_.*_info\.xml$", n)]))
ok(paginas, "index.html empaquetado")
ok(bool(app), "js/app.js empaquetado")
ok(media, "js/media.js empaquetado (fotos en IndexedDB)")
ok(bool(ver) and not fallos_ver, "versión de la web dentro del APK", fallos_ver or (ver or "no encontrada"))
ok(bool(esperados) and not faltan, "los %d widgets van dentro (clases en el dex)" % len(esperados),
   ("faltan: " + ", ".join(faltan)) if faltan else "todos")
ok(paquete, "paquete es.aula.smr.hub")
# El FileProvider es lo que permite adjuntar archivos a la hoja de compartir: sin él,
# «Exportar copia» fallaría al compartir (o al guardar en otros sitios) en el móvil.
# (el manifest del APK es XML binario: las cadenas van en UTF-16, así que se busca en el texto
# decodificado, no en los bytes crudos — así falló la primera vez)
ok("fileprovider" in man_txt, "FileProvider para compartir archivos (autoridad .fileprovider)")
# El chat habla con tu Ollama por http:// en la Wi-Fi de casa. Desde Android 9 el tráfico en claro
# está prohibido por defecto: sin esta marca, la app no puede llegar y el chat cae al motor local.
ok("usesCleartextTraffic" in man_txt, "tráfico en claro permitido (para hablar con tu Ollama por http://)")
# El puente nativo de Capacitor es el plan B cuando el WebView corta la petición (CORS o contenido
# mixto): su clase tiene que ir dentro del APK.
http_nativo = b"com/getcapacitor/plugin/CapacitorHttp" in dex or any(
    b"com/getcapacitor/plugin/CapacitorHttp" in z.read(n) for n in nombres if n.startswith("classes") and n.endswith(".dex")
)
ok(http_nativo, "puente HTTP nativo de Capacitor (el plan B del chat)")

for nombre_plugin, (clase, permiso) in plugins.items():
    dentro = clase in dex or any(clase in z.read(n) for n in nombres if n.startswith("classes") and n.endswith(".dex"))
    ok(dentro, "plugin de %s dentro del APK" % nombre_plugin, "" if dentro else "falta la clase %s (¿cap sync?)" % clase.decode())
    if permiso:
        ok(permiso in man_txt, "permiso %s declarado" % permiso)

# ---------------------------------------------------------------- datos
sha = hashlib.sha256(Path(apk).read_bytes()).hexdigest()
mb = "%.1f" % (os.path.getsize(apk) / 1048576)
print("ARCHIVO")
print("  ·     %s MB · sha256 %s" % (mb, sha))

with open(".datos-apk", "w", encoding="utf-8") as f:
    for k, v in {
        "sha": sha, "mb": mb, "firma": digest, "firma_dn": dn, "esquemas": esquemas or "n/d",
        "app": ver, "app_esperada": esperada, "paquete": pkg_ver, "widgets": len(esperados) - len(faltan),
        "plugins": sum(1 for clase, _ in plugins.values() if clase in dex),
        "media": "sí" if media else "NO",
        "cleartext": "sí" if "usesCleartextTraffic" in man_txt else "NO",
        "http_nativo": "sí" if http_nativo else "NO",
    }.items():
        f.write("%s=%s\n" % (k, v))

if fallos:
    print("\n%d comprobaciones fallidas: %s" % (len(fallos), " · ".join(fallos)))
    sys.exit(1)
print("\nTodo correcto: el APK está firmado y lleva dentro lo que debe.")
