#!/usr/bin/env python3
"""Manifiesto de Android: los activity-alias que hacen posible cambiar el icono.

Está en un módulo aparte y sin dependencias a propósito. Lo que hace es texto plano, así que
las pruebas de humo pueden ejecutarlo DE VERDAD sobre la plantilla real de Capacitor sin
necesitar Pillow ni un proyecto Android compilado (que es justo lo que no hay en el runner de
`Pruebas`). Si esto viviera dentro de apply.py, el fallo que arregla habría sido imposible de
probar en CI: apply.py necesita Pillow y un árbol `android/` entero.

El fallo, para que no vuelva: la plantilla de Capacitor trae `MainActivity` con SU PROPIO
intent-filter MAIN/LAUNCHER. apply.py añade 23 activity-alias encima, así que en el escritorio
conviven 24 lanzadores. `IconSwitch` (Java) solo enciende y apaga los alias, nunca toca
MainActivity, cuyo icono es `ic_launcher` —que write_icons() reescribe con el dragón—. El
resultado: tocas Mewtwo en Ajustes, el plugin responde que sí, el alias se activa… y el
escritorio sigue enseñando el dragón de MainActivity.
"""
import re

# Los 23 iconos: el dragón de la app más la galería de criaturas (assets/avatars).
# Es la MISMA lista que IconSwitch.IDS en Java y que AVATAR_PACK en js/app.js; hay una
# prueba que compara las tres, porque si se desincronizan el alias no existe y Android
# se traga el setComponentEnabledSetting en silencio.
ICONS = [
    "dragon",
    "arcanine", "arceus", "blastoise", "charizard", "gyarados", "garchomp",
    "deoxys", "espeon", "gengar", "giratina", "groudon", "kyogre",
    "lucario", "lugia", "metagross", "mewtwo", "rayquaza", "salamence",
]


def alias_de(nombre):
    """`dragon` -> `IcoDragon`. Tiene que coincidir con IconSwitch.aliasClass() en Java."""
    return "Ico" + nombre[:1].upper() + nombre[1:]


def quitar_lanzador_principal(mt):
    """Le quita a MainActivity su intent-filter MAIN/LAUNCHER y deja la actividad intacta.

    Sin esto, el único lanzador pasa a ser el alias activo —que es lo que IconSwitch controla—
    y el cambio de icono se ve. MainActivity sigue existiendo y sigue siendo `exported`, así
    que los widgets, que la abren con un Intent explícito (`new Intent(ctx, MainActivity.class)`
    en WidgetStore.openApp), siguen funcionando igual.

    Es idempotente: si el filtro ya no está, devuelve el texto tal cual.
    """
    m = re.search(r'<activity\b[^>]*android:name="\.MainActivity"[^>]*>(.*?)</activity>', mt, re.S)
    if not m:
        return mt
    cuerpo = m.group(1)
    # Solo el intent-filter que lleva MAIN dentro; los demás filtros de la actividad se quedan
    limpio = re.sub(
        r'<intent-filter>(?:(?!</intent-filter>).)*?android\.intent\.action\.MAIN(?:(?!</intent-filter>).)*?</intent-filter>',
        "",
        cuerpo,
        flags=re.S,
    )
    if limpio == cuerpo:
        return mt
    return mt[: m.start(1)] + limpio + mt[m.end(1):]


def aliases_xml(iconos=ICONS):
    """Los 23 <activity-alias>, con el dragón activo por defecto y el resto apagado."""
    partes = []
    for nombre in iconos:
        activo = "true" if nombre == "dragon" else "false"
        partes.append(
            """
        <activity-alias
            android:name=".{alias}"
            android:enabled="{activo}"
            android:exported="true"
            android:icon="@mipmap/ic_{nombre}"
            android:roundIcon="@mipmap/ic_{nombre}"
            android:label="@string/app_name"
            android:targetActivity=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity-alias>""".format(alias=alias_de(nombre), activo=activo, nombre=nombre)
        )
    return "".join(partes)


def poner_aliases(mt, iconos=ICONS):
    """Añade los alias una sola vez (si ya están, no los duplica)."""
    if alias_de("dragon") in mt:
        return mt
    return mt.replace("</application>", aliases_xml(iconos) + "\n    </application>")


def preparar_manifest(mt, iconos=ICONS):
    """El manifiesto listo para cambiar de icono: alias puestos y MainActivity sin lanzador.

    El orden importa poco, pero se quita el filtro DESPUÉS de poner los alias para que nunca
    haya un instante (aunque sea solo en el fichero) sin ningún lanzador declarado.
    """
    return quitar_lanzador_principal(poner_aliases(mt, iconos))
