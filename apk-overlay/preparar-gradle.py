#!/usr/bin/env python3
"""Prepara android/app/build.gradle antes de compilar el APK.

Hace dos cosas, sin tocar nada más del proyecto generado por Capacitor:

  1. Pone la versión de verdad: versionCode y versionName salen de package.json.
     (Android solo deja ACTUALIZAR una app si el versionCode sube, así que esto no
     es cosmético: sin ello, cada APK nuevo daría «app no instalada».)
  2. Añade la firma de release con la clave del repositorio (o con las variables
     de entorno, si algún día se prefiere guardarla en Secrets).

Uso:  python3 apk-overlay/preparar-gradle.py <version> <versionCode>
"""
from pathlib import Path
import os
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
GRADLE = ROOT / "android/app/build.gradle"
APP_DIR = ROOT / "android/app"

# Valores por defecto: la clave que vive en este repositorio (privado).
# Se pueden pisar con variables de entorno para no llevarla escrita aquí.
KEYSTORE = Path(os.environ.get("AULA_KEYSTORE") or (ROOT / "apk-overlay/keystore/aula-srm.p12"))
ALIAS = os.environ.get("AULA_KEY_ALIAS", "aula")
STORE_PASS = os.environ.get("AULA_STORE_PASS", "aula-smr-2026")
KEY_PASS = os.environ.get("AULA_KEY_PASS", "aula-smr-2026")

version = sys.argv[1] if len(sys.argv) > 1 else "0.0.0"
code = sys.argv[2] if len(sys.argv) > 2 else "1"

if not GRADLE.exists():
    sys.exit("No está android/app/build.gradle: ejecuta antes «npx cap add android»")
if not KEYSTORE.exists():
    sys.exit("No encuentro la clave para firmar: " + str(KEYSTORE))

txt = GRADLE.read_text(encoding="utf-8")

# --- 1. versión ------------------------------------------------------------
txt = re.sub(r"versionCode\s+\d+", "versionCode %s" % code, txt, count=1)
txt = re.sub(r'versionName\s+"[^"]*"', 'versionName "%s"' % version, txt, count=1)

# --- 2. firma --------------------------------------------------------------
if "signingConfigs" not in txt:
    ruta = os.path.relpath(KEYSTORE, APP_DIR)          # relativa a android/app
    bloque = f"""

// --- Firma de release (añadido por apk-overlay/preparar-gradle.py) ----------
android {{
    signingConfigs {{
        release {{
            storeFile file("{ruta}")
            storePassword "{STORE_PASS}"
            keyAlias "{ALIAS}"
            keyPassword "{KEY_PASS}"
            storeType "pkcs12"
        }}
    }}
    buildTypes {{
        release {{
            signingConfig signingConfigs.release
        }}
    }}
}}
"""
    txt = txt.rstrip() + bloque
    GRADLE.write_text(txt, encoding="utf-8")
    print("firma añadida con", KEYSTORE.name)
else:
    print("la firma ya estaba puesta")

print(f"versión {version} (versionCode {code})")
