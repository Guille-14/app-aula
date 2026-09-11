#!/usr/bin/env python3
"""Limpia los CSS antiguos (styles.css, skins.css, themes.css) de reglas Y declaraciones
que css/ui.css ya gana. ui.css se carga la última, así que:

 - un selector IDÉNTICO en ui.css con las mismas propiedades (o más) deja la regla vieja muerta;
 - un selector con MENOS especificidad que su equivalente en ui.css (p. ej. [data-theme="dark"]
   contra html[data-theme="dark"]) pierde siempre, así que sobran esas declaraciones;
 - las variables del :root antiguo que ui.css define en los dos temas ya no pintan nada.

Nada se borra «a ojo»: solo lo que se puede demostrar muerto, y las reglas que quedan se
verifican después comparando capturas píxel a píxel con las de antes.

Uso:  python3 tools/limpiar-css.py [--dry]
"""
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ANTIGUOS = ['styles.css', 'skins.css', 'themes.css']
TODOS = ['ui.css'] + ANTIGUOS
FUENTES = ['index.html', 'js/app.js', 'js/studio.js', 'js/tools.js', 'js/media.js']
SECO = '--dry' in sys.argv


def descomentar(css):
    """Sustituye los comentarios por espacios (misma longitud: los índices no se mueven)."""
    return re.sub(r'/\*.*?\*/', lambda m: ' ' * len(m.group(0)), css, flags=re.S)


def bloques(css):
    """[(inicio, fin, selector, cuerpo)] de bloques de primer nivel, con offsets exactos."""
    fuera, i, fin_anterior = [], 0, 0
    while i < len(css):
        if css[i] == '{':
            sel = ' '.join(css[fin_anterior:i].split())
            nivel, j = 1, i + 1
            while j < len(css) and nivel:
                if css[j] == '{':
                    nivel += 1
                elif css[j] == '}':
                    nivel -= 1
                j += 1
            if nivel == 0:
                fuera.append((fin_anterior, j, sel, css[i + 1:j - 1]))
            i, fin_anterior = j, j
            continue
        i += 1
    return fuera


def props(cuerpo):
    return {d.split(':')[0].strip() for d in cuerpo.split(';') if ':' in d.strip()}


def mapa(css):
    out = {}
    for a, b, sel, cuerpo in bloques(descomentar(css)):
        out.setdefault(sel, set()).update(props(cuerpo))
    return out


def clases_usadas():
    vistas = set()
    for f in FUENTES:
        t = (RAIZ / f).read_text(encoding='utf-8')
        for m in re.finditer(r'class="([^"$]*)"', t):
            vistas.update(m.group(1).split())
        for m in re.finditer(r'classList\.(?:add|remove|toggle)\(([^)]*)\)', t):
            vistas.update(re.findall(r'"([\w-]+)"', m.group(1)))
        for m in re.finditer(r'className\s*=\s*"([^"]*)"', t):
            vistas.update(m.group(1).split())
    return vistas


def limpiar_reglas(css, ui, usadas):
    """Quita las reglas de primer nivel que ui.css ya pisa por completo."""
    borradas = []
    for a, b, sel, cuerpo in bloques(descomentar(css))[::-1]:
        if not sel or sel.startswith('@'):
            continue
        sels = [s.strip() for s in sel.split(',')]
        if not all(s in ui for s in sels):
            continue
        mios = props(cuerpo)
        if not mios or not all(mios <= ui[s] for s in sels):
            continue
        clases = [c for s in sels for c in re.findall(r'\.([a-zA-Z][\w-]*)', s)]
        if clases:
            if not any(c in usadas for c in clases):
                continue          # puede ser algo que no existe: mejor no tocarlo
        elif not re.match(r'^[a-z][a-z0-9]*(\[[^\]]*\])?(::?[\w-]+)?$', sels[0]):
            continue
        borradas.append((a, b, sel, mios))
    for a, b, _, _ in borradas:
        css = css[:a] + css[b:]
    return css, borradas


def limpiar_declaraciones_pisadas(css, ui):
    """Quita de los bloques [data-x="y"] lo que ui.css fija en html[data-x="y"] (más específico)."""
    quitadas, bloques_tocados = 0, 0
    for a, b, sel, cuerpo in bloques(descomentar(css))[::-1]:
        if not re.match(r'^\[data-[\w-]+="[^"]*"\]$', sel):
            continue
        fuerte = 'html' + sel
        if fuerte not in ui:
            continue
        quedan, fuera = [], []
        for decl in cuerpo.split(';'):
            if ':' not in decl:
                quedan.append(decl)
                continue
            prop = decl.split(':')[0].strip()
            if prop in ui[fuerte]:
                fuera.append(prop)
            else:
                quedan.append(decl)
        if not fuera:
            continue
        bloques_tocados += 1
        quitadas += len(fuera)
        nuevo = ';'.join(quedan).strip().strip(';').strip()
        if nuevo:
            css = css[:a] + sel + ' {\n ' + nuevo + '\n}' + css[b:]
        else:
            css = css[:a] + css[b:]
    return css, quitadas, bloques_tocados


def unir_duplicados(css):
    """Une reglas repetidas del MISMO selector en el mismo fichero cuando sus propiedades son
    disjuntas: al no pisarse ninguna propiedad, el resultado es idéntico y sobra una regla.

    Todas las ediciones se calculan sobre el texto original y se aplican de atrás hacia
    delante: si se aplicaran según se calculan, los índices siguientes quedarían desplazados
    (así se llegó a borrar un @media entero). Los comentarios que hubiera entre reglas se
    conservan.
    """
    original = css
    grupos = {}
    for a, b, sel, cuerpo in bloques(descomentar(css)):
        if not sel or sel.startswith('@'):
            continue
        grupos.setdefault(sel, []).append((a, b, cuerpo))

    def comentarios_antes(inicio, fin_llave):
        return ''.join(re.findall(r'/\*.*?\*/', original[inicio:fin_llave], re.S))

    ediciones = []          # (inicio, fin, texto nuevo)
    fusionadas = 0
    for sel, lista in grupos.items():
        if len(lista) < 2:
            continue
        vistos, disjunto = set(), True
        for _, _, cuerpo in lista:
            p = props(cuerpo)
            if p & vistos:
                disjunto = False
                break
            vistos |= p
        if not disjunto:
            continue
        union = '; '.join(' '.join(c.split()) for _, _, c in lista)
        a0, b0, _ = lista[0]
        ediciones.append((a0, b0, comentarios_antes(a0, b0) + sel + ' { ' + union + ' }'))
        for a, b, _ in lista[1:]:
            ediciones.append((a, b, comentarios_antes(a, b)))
        fusionadas += len(lista) - 1
    for a, b, texto in sorted(ediciones, key=lambda e: -e[0]):
        css = css[:a] + texto + css[b:]
    return css, fusionadas


def limpiar_root(css, ui):
    """Del :root viejo, fuera las variables que ui.css define en los dos temas."""
    # Solo son seguras las variables que ui.css define SIEMPRE: las de su :root (sin
    # condiciones) y las que están en los DOS bloques de tema. Ojo: --font o --radius viven
    # en el bloque de la piel por defecto, así que con otra piel solo existen aquí (borrarlas
    # dejaba la app sin tipografía; lo cazó la comparación de capturas píxel a píxel).
    raiz = ui.get(':root', set())
    oscuro = ui.get('html[data-theme="dark"]', set())
    claro = ui.get('html[data-theme="light"]', set())
    seguras = raiz | (oscuro & claro)
    m = re.search(r':root\s*\{(.*?)\}', descomentar(css), re.S)
    if not m or not seguras:
        return css, []
    quedan, fuera = [], []
    for linea in m.group(1).split('\n'):
        if not linea.strip():
            continue
        var = re.match(r'\s*(--[\w-]+)\s*:', linea)
        if var and var.group(1) in seguras:
            fuera.append(var.group(1))
        else:
            quedan.append(linea)
    if not fuera:
        return css, []
    return css[:m.start(1)] + '\n'.join(quedan) + css[m.end(1):], fuera


def main():
    ui = mapa((RAIZ / 'css/ui.css').read_text(encoding='utf-8'))
    usadas = clases_usadas()
    total_reglas = total_decl = total_vars = total_fusionadas = 0
    for nombre in TODOS:
        ruta = RAIZ / 'css' / nombre
        original = ruta.read_text(encoding='utf-8')
        css = original
        if nombre in ANTIGUOS:
            css, borradas = limpiar_reglas(css, ui, usadas)
            css, decl, tocados = limpiar_declaraciones_pisadas(css, ui)
            css, variables = limpiar_root(css, ui)
        else:
            borradas, decl, variables = [], 0, []
        css, fusionadas = unir_duplicados(css)
        css = re.sub(r'\n{3,}', '\n\n', css).strip() + '\n'
        total_reglas += len(borradas)
        total_decl += decl
        total_vars += len(variables)
        total_fusionadas += fusionadas
        if css != original:
            if not SECO:
                ruta.write_text(css, encoding='utf-8')
            print(f'{nombre}: {len(original) - len(css)} bytes menos '
                  f'({len(borradas)} reglas muertas, {decl} declaraciones pisadas, {len(variables)} variables, {fusionadas} repetidas unidas)')
            for _, _, sel, p in borradas[:10]:
                print(f'    - regla entera: {sel[:60]} ({", ".join(sorted(p)[:4])})')
            if variables:
                print(f'    - :root: {", ".join(variables)}')
        else:
            print(f'{nombre}: sin cambios')
    print(f'\ntotal: {total_reglas} reglas muertas · {total_decl} declaraciones pisadas · {total_vars} variables del :root · {total_fusionadas} reglas repetidas unidas')


if __name__ == '__main__':
    main()
