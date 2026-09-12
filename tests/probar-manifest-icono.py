#!/usr/bin/env python3
"""Comprueba el manifiesto de Android que deja apk-overlay/manifest.py.

Lo llaman las pruebas de humo (`tests/smoke.test.js`) pasándole dos rutas:

    python3 tests/probar-manifest-icono.py <carpeta apk-overlay> <AndroidManifest.xml de entrada>

Imprime un JSON con los números que importan. Está en un fichero aparte (y no metido como
cadena dentro del JS) a propósito: así se lee, se puede ejecutar a mano y no hay que pelearse
con el escapado de las expresiones regulares a través de dos lenguajes.

Lo que vigila es el fallo que hacía que cambiar el icono no sirviera de nada: la plantilla de
Capacitor declara MainActivity como lanzador, y apply.py añadía 23 activity-alias encima. Con
los dos a la vez, en el escritorio hay 24 iconos y el de MainActivity —siempre el dragón— no lo
toca nadie, así que por mucho que IconSwitch encienda otro alias, el escritorio no cambia.
"""
import io
import json
import re
import sys

sys.path.insert(0, sys.argv[1])
from manifest import ICONS, alias_de, preparar_manifest  # noqa: E402

entrada = io.open(sys.argv[2], encoding="utf-8").read()
salida = preparar_manifest(entrada, ICONS)

actividad = re.search(
    r'<activity\b[^>]*android:name="\.MainActivity"[^>]*>(.*?)</activity>', salida, re.S
)
cuerpo = actividad.group(1) if actividad else ""

print(json.dumps({
    "total": salida.count("android.intent.action.MAIN"),
    "aliases": salida.count("<activity-alias"),
    "main_sigue": bool(actividad),
    "main_con_lanzador": "android.intent.action.MAIN" in cuerpo,
    "main_exported": bool(actividad) and 'android:exported="true"' in actividad.group(0),
    "activos": re.findall(r'android:name="\.(Ico\w+)"\s+android:enabled="true"', salida),
    "iconos": ICONS,
    "alias_dragon": alias_de("dragon"),
    # Pasar apply.py dos veces no puede duplicar nada: el build lo ejecuta en cada compilación
    "idempotente": preparar_manifest(salida, ICONS).count("android.intent.action.MAIN"),
}))
