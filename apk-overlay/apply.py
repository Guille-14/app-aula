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

ICONS = [
    "dragon",
    "arcanine", "arceus", "blastoise", "charizard", "gyarados", "garchomp",
    "deoxys", "espeon", "gengar", "giratina", "groudon", "kyogre",
    "lucario", "lugia", "metagross", "mewtwo", "rayquaza", "salamence",
    "tyranitar", "umbreon", "venusaur", "zekrom",
]

# id, Java class, kind, size, picker name, description
WIDGETS = [
    ("clase", "WidgetClase", "clase", "2x2", "Próxima clase", "Próxima clase de Aula SMR"),
    ("examen", "WidgetExamen", "examen", "2x2", "Próximo examen", "Próximo examen de Aula SMR"),
    ("hoy", "WidgetHoy", "hoy", "4x2", "Hoy · Aula SMR", "Hoy en Aula SMR: clase y examen"),
    ("horario", "WidgetHorario", "list", "4x2", "Horario de hoy", "Clases de hoy"),
    ("examenes", "WidgetExamenes", "list", "4x2", "Próximos exámenes", "Lista de exámenes cercanos"),
    ("tareas", "WidgetTareas", "list", "4x2", "Tareas", "Tareas pendientes"),
    ("media", "WidgetMedia", "stat", "2x2", "Nota media", "Media ponderada del ciclo"),
    ("racha", "WidgetRacha", "stat", "2x2", "Racha", "Días seguidos de estudio"),
    ("estudio", "WidgetEstudio", "stat", "2x2", "Estudio hoy", "Minutos estudiados hoy"),
    ("semana", "WidgetSemana", "stat", "2x2", "Estudio semana", "Minutos de esta semana"),
    ("xp", "WidgetXp", "stat", "2x2", "Nivel y XP", "Nivel y experiencia"),
    ("fichas", "WidgetFichas", "stat", "2x2", "Fichas", "Fichas pendientes de hoy"),
    ("pendientes", "WidgetPendientes", "stat", "2x2", "Pendientes", "Tareas sin hacer"),
    ("atrasadas", "WidgetAtrasadas", "stat", "2x2", "Atrasadas", "Tareas fuera de plazo"),
    ("asistencia", "WidgetAsistencia", "stat", "2x2", "Asistencia", "Porcentaje de asistencia"),
    ("curso", "WidgetCurso", "stat", "2x2", "Días de curso", "Días hasta el inicio o el fin"),
    ("bandeja", "WidgetBandeja", "stat", "2x2", "Bandeja", "Capturas rápidas"),
    ("foco", "WidgetFoco", "card", "2x2", "Módulo a estudiar", "En qué concentrarte ahora"),
    ("festivo", "WidgetFestivo", "card", "2x2", "Hoy / festivo", "Si hoy hay clase o no"),
    ("hint", "WidgetHint", "card", "2x2", "Qué estudiar", "Consejo del día"),
    ("mini_clase", "WidgetMiniClase", "tiny", "2x1", "Mini clase", "Próxima clase compacta"),
    ("mini_examen", "WidgetMiniExamen", "tiny", "2x1", "Mini examen", "Próximo examen compacto"),
    ("mini_racha", "WidgetMiniRacha", "tiny", "2x1", "Mini racha", "Racha compacta"),
    ("duo", "WidgetDuo", "duo", "4x1", "Clase | Examen", "Clase y examen en una tira"),
]

KIND_LAYOUT = {
    "clase": "widget_clase",
    "examen": "widget_examen",
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

HANDWRITTEN = {"WidgetClase", "WidgetExamen", "WidgetHoy"}

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


def write_icons():
    drawable = ANDROID / "app/src/main/res/drawable"
    drawable.mkdir(parents=True, exist_ok=True)
    dragon_src = AULA / "assets/icon-512.png"
    if not dragon_src.exists():
        dragon_src = AULA / "assets/icon-192.png"
    paint_icon(dragon_src, drawable / "ic_dragon.png")
    ava = AULA / "assets/avatars"
    for name in ICONS:
        if name == "dragon":
            continue
        src = ava / f"{name}.jpg"
        if not src.exists():
            src = ava / f"{name}.png"
        if src.exists():
            paint_icon(src, drawable / f"ic_{name}.png")
        else:
            shutil.copy2(drawable / "ic_dragon.png", drawable / f"ic_{name}.png")
    # Capacitor default launcher → dragón a sangre (sin adaptive inset)
    for p in ANDROID.glob("app/src/main/res/mipmap-*/ic_launcher*.png"):
        shutil.copy2(drawable / "ic_dragon.png", p)
    anydpi = ANDROID / "app/src/main/res/mipmap-anydpi-v26"
    anydpi.mkdir(parents=True, exist_ok=True)
    for p in list(anydpi.glob("ic_launcher*.xml")):
        p.unlink()
    for name in ICONS:
        (anydpi / f"ic_{name}.xml").write_text(
            """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_%s"/>
    <foreground android:drawable="@android:color/transparent"/>
</adaptive-icon>
"""
            % name,
            encoding="utf-8",
        )
        if name == "dragon":
            (anydpi / "ic_launcher.xml").write_text(
                """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_dragon"/>
    <foreground android:drawable="@android:color/transparent"/>
</adaptive-icon>
""",
                encoding="utf-8",
            )
            (anydpi / "ic_launcher_round.xml").write_text(
                """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_dragon"/>
    <foreground android:drawable="@android:color/transparent"/>
</adaptive-icon>
""",
                encoding="utf-8",
            )
    xxx = ANDROID / "app/src/main/res/mipmap-xxxhdpi"
    xxx.mkdir(parents=True, exist_ok=True)
    for name in ICONS:
        shutil.copy2(drawable / f"ic_{name}.png", xxx / f"ic_{name}.png")
    fg = ANDROID / "app/src/main/res/drawable/ic_launcher_foreground.png"
    shutil.copy2(drawable / "ic_dragon.png", fg)


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
for folder, dest in (("layout", res / "layout"), ("xml", res / "xml"), ("drawable", res / "drawable")):
    dest.mkdir(parents=True, exist_ok=True)
    for src in (ROOT / folder).glob("*"):
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

# Quitar LAUNCHER de MainActivity: los alias son el icono del escritorio
mt = re.sub(
    r'<action android:name="android.intent.action.MAIN"\s*/>\s*'
    r'<category android:name="android.intent.category.LAUNCHER"\s*/>',
    "",
    mt,
    count=1,
)
mt = re.sub(r"<intent-filter>\s*</intent-filter>", "", mt)

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

aliases = []
for name in ICONS:
    alias = "Ico" + name[:1].upper() + name[1:]
    enabled = "true" if name == "dragon" else "false"
    aliases.append(f"""
        <activity-alias
            android:name=".{alias}"
            android:enabled="{enabled}"
            android:exported="true"
            android:icon="@mipmap/ic_{name}"
            android:roundIcon="@mipmap/ic_{name}"
            android:label="@string/app_name"
            android:targetActivity=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity-alias>""")
if "IcoDragon" not in mt:
    mt = mt.replace("</application>", "\n".join(aliases) + "\n    </application>")

# icono por defecto de la aplicación
mt = re.sub(r'android:icon="[^"]*"', 'android:icon="@mipmap/ic_launcher"', mt, count=1)
if "android:icon=" not in mt.split("<application", 1)[-1][:400]:
    mt = mt.replace("<application", '<application android:icon="@mipmap/ic_launcher"', 1)

man.write_text(mt, encoding="utf-8")
print("overlay ok", len(WIDGETS), "widgets")
