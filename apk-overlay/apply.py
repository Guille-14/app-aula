#!/usr/bin/env python3
"""Copia widgets nativos, iconos de lanzador y activity-alias al proyecto Capacitor Android."""
from pathlib import Path
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parent
AULA = ROOT.parent
ANDROID = Path(sys.argv[1] if len(sys.argv) > 1 else "").resolve()
if not ANDROID.exists():
    print("android dir missing", ANDROID)
    sys.exit(1)

# La lista de iconos vive en manifest.py, junto a la lógica del manifiesto, para que haya un
# solo sitio donde cambiarla (la comparten el .py, el Java de IconSwitch y la galería del JS).
from manifest import ICONS, preparar_manifest

# id, Java class, kind, size, picker name, description
WIDGETS = [
    ("clase", "WidgetClase", "clase", "2x2", "Próxima clase", "Próxima clase de Aula SMR"),
    ("hoy", "WidgetHoy", "hoy", "4x2", "Hoy · Aula SMR", "Hoy en Aula SMR: clase y día sin clase"),
    ("horario", "WidgetHorario", "list", "4x2", "Horario de hoy", "Clases de hoy"),
    ("festivos", "WidgetFestivos", "list", "4x2", "Días sin clase", "Próximos festivos y vacaciones"),
    ("media", "WidgetMedia", "stat", "2x2", "Nota media", "Media ponderada del ciclo"),
    ("racha", "WidgetRacha", "stat", "2x2", "Racha", "Días seguidos de estudio"),
    ("estudio", "WidgetEstudio", "stat", "2x2", "Estudio hoy", "Minutos estudiados hoy"),
    ("semana", "WidgetSemana", "stat", "2x2", "Estudio semana", "Minutos de esta semana"),
    ("xp", "WidgetXp", "stat", "2x2", "Nivel y XP", "Nivel y experiencia"),
    ("fichas", "WidgetFichas", "stat", "2x2", "Fichas", "Fichas pendientes de hoy"),
    ("asistencia", "WidgetAsistencia", "stat", "2x2", "Asistencia", "Porcentaje de asistencia"),
    ("curso", "WidgetCurso", "stat", "2x2", "Días de curso", "Días hasta el inicio o el fin"),
    ("bandeja", "WidgetBandeja", "stat", "2x2", "Bandeja", "Capturas rápidas"),
    ("foco", "WidgetFoco", "card", "2x2", "Módulo a estudiar", "En qué concentrarte ahora"),
    ("festivo", "WidgetFestivo", "card", "2x2", "Hoy / festivo", "Si hoy hay clase o no"),
    ("hint", "WidgetHint", "card", "2x2", "Qué estudiar", "Consejo del día"),
    ("mini_clase", "WidgetMiniClase", "tiny", "2x1", "Mini clase", "Próxima clase compacta"),
    ("mini_racha", "WidgetMiniRacha", "tiny", "2x1", "Mini racha", "Racha compacta"),
    ("duo", "WidgetDuo", "duo", "4x1", "Clase | Sin clase", "Tu clase y el próximo día sin clase"),
]

KIND_LAYOUT = {
    "clase": "widget_clase",
    "hoy": "widget_hoy",
    "card": "widget_card",
    "stat": "widget_stat",
    "list": "widget_list",
    "tiny": "widget_tiny",
    "duo": "widget_duo",
}

SIZES = {
    "2x2": (110, 110, 2, 2),
    "4x2": (250, 110, 4, 2),
    "2x1": (110, 40, 2, 1),
    "4x1": (250, 40, 4, 1),
}

HANDWRITTEN = {"WidgetClase", "WidgetHoy"}

JAVA_TMPL = """package es.aula.smr.hub;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

public class {cls} extends AppWidgetProvider {{
  public static void updateAll(Context ctx, AppWidgetManager mgr, int[] ids) {{
    for (int id : ids) mgr.updateAppWidget(id, WidgetStore.views(ctx, "{wid}"));
  }}

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {{
    updateAll(context, appWidgetManager, appWidgetIds);
  }}
}}
"""

INFO_TMPL = """<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="{mw}dp"
    android:minHeight="{mh}dp"
    android:targetCellWidth="{cw}"
    android:targetCellHeight="{ch}"
    android:updatePeriodMillis="1800000"
    android:initialLayout="@layout/{lay}"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:description="@string/widget_{sid}_desc"
    android:previewLayout="@layout/{lay}"/>
"""


def paint_icon(src: Path, dest: Path, size: int = 432):
    """Full-bleed square. No padding, no baked rounding — the launcher masks it."""
    from PIL import Image
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    side = min(w, h) or 1
    # slight zoom kills rounded-card margins baked into some sources (dragon)
    zoom = 1.12
    cut = max(1, int(side / zoom))
    sx = (w - cut) / 2
    sy = (h - cut) / 2
    crop = img.crop((int(sx), int(sy), int(sx + cut), int(sy + cut)))
    crop = crop.resize((size, size), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    crop.convert("RGB").save(dest, "PNG", optimize=True)


def paint_adaptive_layers(src: Path, dest_dir: Path, name: str, size: int = 432):
    """Capas de icono adaptativo que SÍ respetan el recorte del launcher.

    El launcher enmascara un lienzo de 108 dp y solo garantiza visibles 66 dp
    centrados. Con el arte a sangre como capa de fondo (como se hacía antes), lo
    visible era el 61 % central: el icono se veía «con zoom» y cortado. Ahora:
      · fondo  = el arte difuminado (llena la máscara con sus colores, sin borde duro)
      · frente = el arte al 62 % centrado, que cabe en la zona segura (esquinas a
        0,44 del radio: ni siquiera una máscara circular completa las recorta)
    432 px = 108 dp a 4x → se meten en drawable-xxxhdpi.
    """
    from PIL import Image, ImageFilter
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    side = min(w, h) or 1
    sx = (w - side) / 2
    sy = (h - side) / 2
    cover = img.crop((int(sx), int(sy), int(sx + side), int(sy + side))).resize(
        (size, size), Image.Resampling.LANCZOS
    )
    bg = cover.filter(ImageFilter.GaussianBlur(radius=size * 0.035))
    fg_size = int(size * 0.62)
    art = cover.resize((fg_size, fg_size), Image.Resampling.LANCZOS)
    fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    off = (size - fg_size) // 2
    fg.paste(art, (off, off), art)
    dest_dir.mkdir(parents=True, exist_ok=True)
    bg.convert("RGB").save(dest_dir / f"ic_{name}_bg.png", "PNG", optimize=True)
    fg.save(dest_dir / f"ic_{name}_fg.png", "PNG", optimize=True)


def icon_source(name: str, dragon_src: Path) -> Path:
    """Origen del arte de cada icono (los avatares viven en assets/avatars)."""
    if name == "dragon":
        return dragon_src
    ava = AULA / "assets/avatars"
    for ext in (".jpg", ".png"):
        p = ava / (name + ext)
        if p.exists():
            return p
    return dragon_src


def write_icons():
    drawable = ANDROID / "app/src/main/res/drawable"
    drawable.mkdir(parents=True, exist_ok=True)
    dragon_src = AULA / "assets/icon-512.png"
    if not dragon_src.exists():
        dragon_src = AULA / "assets/icon-192.png"
    paint_icon(dragon_src, drawable / "ic_dragon.png")
    for name in ICONS:
        if name == "dragon":
            continue
        src = icon_source(name, dragon_src)
        if src == dragon_src:
            shutil.copy2(drawable / "ic_dragon.png", drawable / f"ic_{name}.png")
        else:
            paint_icon(src, drawable / f"ic_{name}.png")
    # Icono adaptativo (API 26+): fondo difuminado + arte a la zona segura.
    # Sin esto el launcher enmascaraba el arte a sangre y el icono salía «con zoom».
    layers = ANDROID / "app/src/main/res/drawable-xxxhdpi"
    for name in ICONS:
        paint_adaptive_layers(icon_source(name, dragon_src), layers, name)
    # Capacitor default launcher → dragón a sangre (solo para API < 26, que no enmascara)
    for p in ANDROID.glob("app/src/main/res/mipmap-*/ic_launcher*.png"):
        if "anydpi" not in str(p):
            shutil.copy2(drawable / "ic_dragon.png", p)
    anydpi = ANDROID / "app/src/main/res/mipmap-anydpi-v26"
    anydpi.mkdir(parents=True, exist_ok=True)
    for p in list(anydpi.glob("ic_launcher*.xml")):
        p.unlink()
    adaptive_tmpl = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
        '    <background android:drawable="@drawable/ic_%s_bg"/>\n'
        '    <foreground android:drawable="@drawable/ic_%s_fg"/>\n'
        "</adaptive-icon>\n"
    )
    for name in ICONS:
        (anydpi / f"ic_{name}.xml").write_text(adaptive_tmpl % (name, name), encoding="utf-8")
        if name == "dragon":
            (anydpi / "ic_launcher.xml").write_text(adaptive_tmpl % (name, name), encoding="utf-8")
            (anydpi / "ic_launcher_round.xml").write_text(adaptive_tmpl % (name, name), encoding="utf-8")
    # El antiguo ic_launcher_foreground.png (a sangre, sin usar) ya no se genera:
    # las capas adaptativas viven en drawable-xxxhdpi.
    (ANDROID / "app/src/main/res/drawable/ic_launcher_foreground.png").unlink(missing_ok=True)
    xxx = ANDROID / "app/src/main/res/mipmap-xxxhdpi"
    xxx.mkdir(parents=True, exist_ok=True)
    for name in ICONS:
        shutil.copy2(drawable / f"ic_{name}.png", xxx / f"ic_{name}.png")


def write_widget_providers(pkg: Path, xml_dir: Path):
    xml_dir.mkdir(parents=True, exist_ok=True)
    for wid, cls, kind, size, _name, _desc in WIDGETS:
        if cls not in HANDWRITTEN:
            (pkg / f"{cls}.java").write_text(
                JAVA_TMPL.format(cls=cls, wid=wid), encoding="utf-8"
            )
        lay = KIND_LAYOUT.get(kind, "widget_card")
        mw, mh, cw, ch = SIZES[size]
        sid = wid
        (xml_dir / f"widget_{wid}_info.xml").write_text(
            INFO_TMPL.format(mw=mw, mh=mh, cw=cw, ch=ch, lay=lay, sid=sid),
            encoding="utf-8",
        )


pkg = ANDROID / "app/src/main/java/es/aula/smr/hub"
res = ANDROID / "app/src/main/res"
pkg.mkdir(parents=True, exist_ok=True)
for src in (ROOT / "java").glob("*.java"):
    shutil.copy2(src, pkg / src.name)
for folder, dest in (("layout", res / "layout"), ("xml", res / "xml"), ("drawable", res / "drawable"),
                     ("res/raw", res / "raw")):
    src_dir = ROOT / folder
    if not src_dir.exists():
        continue
    dest.mkdir(parents=True, exist_ok=True)
    for src in src_dir.glob("*"):
        shutil.copy2(src, dest / src.name)

write_icons()
write_widget_providers(pkg, res / "xml")

strings = ANDROID / "app/src/main/res/values/strings.xml"
txt = strings.read_text(encoding="utf-8") if strings.exists() else '<?xml version="1.0" encoding="utf-8"?><resources></resources>'
pairs = [("app_name", "Aula SMR")]
for wid, _cls, _kind, _size, name, desc in WIDGETS:
    pairs.append((f"widget_{wid}_name", name))
    pairs.append((f"widget_{wid}_desc", desc))
for name, val in pairs:
    tag = f'<string name="{name}">'
    if tag not in txt:
        txt = txt.replace("</resources>", f"    {tag}{val}</string>\n</resources>")
strings.write_text(txt, encoding="utf-8")

man = ANDROID / "app/src/main/AndroidManifest.xml"
mt = man.read_text(encoding="utf-8")

# El chat puede hablar con el Ollama de tu ordenador, que va por http:// en la Wi-Fi de casa.
# Desde Android 9 (y aquí compilamos para targetSdk 34) el tráfico en claro está prohibido por
# defecto, así que la app se quedaba sin poder salir y el chat caía siempre al motor local.
if "usesCleartextTraffic" not in mt:
    # Ojo: se inserta en la misma línea (un salto aquí dentro del literal llegaría escapado al XML)
    mt = mt.replace("<application", '<application android:usesCleartextTraffic="true"', 1)

# Para que los avisos programados suenen de verdad hacen falta dos permisos más. Sin
# SCHEDULE_EXACT_ALARM (Android 12+), el plugin de Capacitor cae a alarmas inexactas que
# el móvil puede retrasar horas o no disparar; la app detecta el estado y deja activarlo
# desde Ajustes. Sin REQUEST_IGNORE_BATTERY_OPTIMIZATIONS no se puede pedir exención de
# la optimización de batería, y varios fabricantes matan por ahí las alarmas en 2.º plano.
if "SCHEDULE_EXACT_ALARM" not in mt:
    perms = (
        '<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />\n'
        '<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />\n'
    )
    mt = re.sub(
        r"(\n[ \t]*)<application",
        lambda m: m.group(1) + perms + m.group(1) + "<application",
        mt,
        count=1,
    )

recv_bits = []
for wid, cls, _kind, _size, _name, _desc in WIDGETS:
    if f".{cls}" in mt:
        continue
    recv_bits.append(
        f"""
        <receiver android:name=".{cls}" android:exported="true" android:label="@string/widget_{wid}_name">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/widget_{wid}_info" />
        </receiver>"""
    )
if recv_bits:
    mt = mt.replace("</application>", "\n".join(recv_bits) + "\n    </application>")

# Los activity-alias (uno por icono) y —lo que faltaba— quitarle a MainActivity su propio
# intent-filter de lanzador. Los dos van juntos: con los alias puestos pero MainActivity aún
# declarada como lanzador, en el escritorio convivían 24 iconos y el de MainActivity (siempre
# el dragón) no lo tocaba nadie, así que cambiar de icono no se veía nunca.
mt = preparar_manifest(mt, ICONS)

# icono por defecto de la aplicación
mt = re.sub(r'android:icon="[^"]*"', 'android:icon="@mipmap/ic_launcher"', mt, count=1)
if "android:icon=" not in mt.split("<application", 1)[-1][:400]:
    mt = mt.replace("<application", '<application android:icon="@mipmap/ic_launcher"', 1)

man.write_text(mt, encoding="utf-8")
print("overlay ok", len(WIDGETS), "widgets")
