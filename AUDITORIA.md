# Auditoría completa de Aula SMR

**Fecha:** 11 de septiembre de 2026
**Alcance:** todo el repositorio (`index.html`, `js/app.js`, `js/studio.js`, `js/tools.js`, `sw.js`, `server.py`, 7 hojas CSS, `manifest.webmanifest`, `apk-overlay/`, README).
**Commit auditado:** `e820a3a` (rama `arena/01a0902e-app-aula`, creada desde `main`).
**Ronda v58:** commits `6c70d71` y `de1c2a1` (auditoría línea a línea + arreglos, 182 pruebas ✓).
**Ronda v59:** rediseño de interfaz (una sola hoja `css/ui.css`, calendario escolar nuevo, 198 pruebas ✓).
**Ronda v60:** segunda pasada de pulido (calendario redondo, módulos en lista, acentos por tema, 216 pruebas ✓).
**Ronda v61:** exámenes con su pestaña, foco sin botón flotante, calendario acotado y chat de Ollama (263 pruebas ✓).
**Tamaño analizado:** 9.225 líneas / 454 KB (189 KB de `app.js`, 148 KB de CSS).

## Cómo se ha auditado (para que te fíes de los hallazgos)

No es una lectura por encima. He hecho esto:

1. **Lectura completa** de los 3 archivos JS, las 7 hojas CSS, el Service Worker, el servidor y el overlay Android.
2. **Arranque real de la app** en un DOM headless (jsdom) con el HTML y los tres scripts: 25 vistas renderizadas, ~40 interacciones simuladas (formularios, modales, timer, filtros, importación…).
3. **Barrido estático** cruzado: acciones `data-action` manejadas vs. botones realmente pintados, clases CSS usadas vs. definidas, skins del JS vs. CSS, ajustes leídos vs. campos existentes, funciones nunca llamadas.
4. **Pruebas de estrés**: estado corrupto, estado con tipos inválidos, cuota de `localStorage` agotada, examen sin fecha, minutos negativos, cálculo de contraste WCAG de las 33 skins.
5. **Servidor en marcha** (`python3 server.py --pin 1234`) y peticiones con `curl` para comprobar autenticación y CORS.

Cada hallazgo marcado como **[verificado]** tiene una reproducción concreta.

---

## Resumen ejecutivo: lo que yo arreglaría mañana mismo

| # | Problema | Gravedad |
|---|---|---|
| 1 | `save()` se traga los errores de cuota → la app parece guardar y **pierde todo** en silencio | 🔴 Crítico |
| 2 | Un JSON corrupto en `localStorage` **destruye los datos** y los sustituye por los de ejemplo, sin avisar | 🔴 Crítico |
| 3 | No hay validación al importar: un examen sin fecha **rompe la pantalla de Exámenes** y no hay forma de salir | 🔴 Crítico |
| 4 | `server.py` sirve `data/state.json` **sin PIN** por HTTP estático (+ listado de directorios) | 🔴 Crítico (si usas sync) |
| 5 | El Kanban muestra **"NaN de undefined"** en la fecha y el campo de fecha sale vacío | 🟠 Alto |
| 6 | El selector de temas (**33 skins**) no existe en la UI: `skinCards()` nunca se llama | 🟠 Alto |
| 7 | "Borrar todo" **no borra** las 5 copias de seguridad (`aula.snaps`): tus notas siguen ahí | 🟠 Alto |
| 8 | El PIN de notas es decorativo: `n.locked` se escribe pero **nunca se lee** | 🟠 Alto |
| 9 | El horario oficial hardcodeado **machaca el tuyo** cada vez que cambia `timetableId` | 🟠 Alto |
| 10 | 31 ajustes existen en el código pero **no hay ningún control** para cambiarlos | 🟡 Medio |
| 11 | Los avisos solo funcionan **con la app abierta** (no hay notificaciones programadas en Android) | 🟡 Medio |
| 12 | 11 funcionalidades están implementadas pero **sin botón** (voz, modo escritura de fichas, importar CSV, exportar Anki/Markdown, saltar bloque del timer, rejilla del horario…) | 🟡 Medio |

---

---

## 🔧 Estado de los arreglos (actualización, misma fecha)

Esta auditoría se escribió sobre el commit `e820a3a`. Después se ha empezado a arreglar
sobre la misma rama. Esto es lo que ya está hecho **y verificado**:

**Commits:** `f3410d9` (datos y accesibilidad), `2aabe57` (interfaz y pruebas),
`7d2d814` (herramientas y red), `ee04323` (accesibilidad y detalles), `5654dd6`
(fotos en IndexedDB, repetición espaciada real y excepciones de horario), `718e69d`
(receta del APK), `v51` (la app deja de tener servidor), `v52` (navegación sin duplicados), `v53` (fuera la vista Cuatrimestre), `v54` (fuera Guía docente y Papelera), `v55` (Ajustes más cortos), `v56` (horario y calendario reales del centro) y `v57` (horario automático, calendario escolar y la app sin exámenes ni deberes).

### Ronda v58 · auditoría línea a línea de todo el código

**Qué se ha revisado (esta ronda):** el código del repositorio, línea por línea:
`index.html` (227), `js/app.js` (4 188), `js/studio.js` (731), `js/tools.js` (983), `js/media.js` (224),
`sw.js`, las 7 hojas CSS, `manifest.webmanifest`, `apk-overlay/` (Java + layouts) y las pruebas.
Además se pasaron cruces automáticos (acciones `data-action` ↔ manejadores, ids pedidos en JS ↔
existentes en el HTML, ajustes escritos ↔ leídos, exports de `window.Aula`), `eslint` con las reglas
de errores reales (duplicados, variables sin usar, `no-undef`) y un recorrido automático en jsdom de
las 21 vistas con **337 clics** reales y apertura de modales, buscando excepciones y `NaN`.

**Lo que se encontró y ya está corregido** (todo con prueba que lo cubre):

| # | Fallo | Gravedad | Arreglo |
|---|---|---|---|
| 1 | **El bloque de estudio en curso se borraba al abrir la app**: el arranque llamaba a `setMode("work", true)` después de `timerRestore()`, así que el pomodoro en marcha se perdía al cerrar y reabrir | 🔴 Alto | El arranque solo estrena bloque si no había nada guardado (`timerRestore()` devuelve si había estado); al volver sigue corriendo la cuenta atrás |
| 2 | **El buscador de apuntes no filtraba nada**: se guardaba `noteQuery` y se volvía a pintar, pero nadie lo leía | 🔴 Alto | `renderNotes()` filtra por título y texto (sin destapar notas con PIN) y avisa de que no hay resultados |
| 3 | **El botón «Foto» de una nota estaba roto**: llamaba a `shrinkImage()`, que no existía en ningún fichero → `ReferenceError` y aviso de «no se ha podido leer la imagen» | 🔴 Alto | Se implementa `shrinkImage()` (canvas → JPEG, lado mayor 1280 px) y se arregla la comprobación de tamaño, que estaba invertida |
| 4 | **Las flechas del horario no pasaban de semana**: `sch-week` asignaba el delta (−1/0/+1) en vez de sumarlo, así que «›» siempre enseñaba la misma semana siguiente | 🟠 Medio | Ahora se suma (con tope de ±52 semanas) y el botón «Hoy» vuelve a la actual |
| 5 | **El widget «Hoy» del APK enseñaba la etiqueta «EXAMEN»**: el texto estaba fijo en `widget_hoy.xml` y el Java nunca lo sobrescribía | 🟠 Medio | `WidgetStore.java` escribe esa etiqueta con `festivo.kicker` («SIN CLASE», «VACACIONES» o «HOY»); el layout pasa a «SIN CLASE» |
| 6 | **Una vista que fallaba dejaba la app en blanco** (cualquier dato raro, como `aula.snaps` dañado en «Datos locales», rompía el pintado entero) | 🟠 Medio | `render()` envuelve la vista en `try/catch` y enseña un panel con «Volver a Inicio / Exportar copia / Recargar» |
| 7 | `JSON.parse(localStorage.getItem("aula.snaps"))` sin protección en «Datos locales» | 🟠 Medio | Se parsea a salvo y, si no es una lista, se ignora |
| 8 | **Se podía colar HTML/código por una copia importada**: una «foto» con comillas en su data URL se insertaba sin escapar en `src` | 🟠 Medio | Nuevo `safeImgSrc()`: solo `data:image/…` o `blob:` y siempre escapado (avatares, fotos de notas y miniaturas) |
| 9 | `hidratar()` montaba un selector CSS con ids de una copia importada | 🟡 Bajo | Se escapa con `CSS.escape` |
| 10 | **Conversor de bases**: `parseInt()` se comía los dígitos inválidos («19» en base 8 daba 1 en silencio) | 🟠 Medio | Se valida el número según la base y se avisa |
| 11 | **Máscaras de red**: `255.255.0.255` se aceptaba como /16 | 🟡 Bajo | Se comprueba que los unos son contiguos; `/26` y `26` valen igual |
| 12 | **Calculadora RAID**: sin discos enseñaba «0 GB · sin redundancia» | 🟡 Bajo | Pide discos y tamaño; RAID 1 avisa de que hacen falta 2 |
| 13 | **Modo «Escribir» de fichas**: al acertar, la ficha se quedaba en pantalla | 🟠 Medio | Se programa el repaso y avanza (`Aula.gradeCard`), con aviso de acierto/fallo |
| 14 | El enlace «Configurar Ollama» del asistente era `data-view` fuera de la barra: **no hacía nada** | 🟡 Bajo | Ahora navega con `data-action="go"` |
| 15 | El historial del chat se guardaba entero en el estado, sin límite | 🟡 Bajo | Se queda con los últimos 40 mensajes |
| 16 | **Calendario escolar**: las flechas de mes se podían pulsar sin fin más allá del curso | 🟡 Bajo | El cursor se queda dentro del curso y las flechas se desactivan en el primer y último mes |
| 17 | **Tema automático**: de noche oscurecía la app pero no la barra del sistema, no cambiaba solo al llegar la hora y el primer pintado podía parpadear | 🟡 Bajo | `applyTheme()` calcula el tema efectivo una vez (color de sistema y clases incluidas), se revisa cada 15 s y el script de arranque de `index.html` ya lo aplica antes de pintar |
| 18 | **Textos que ya no tocan**: la portada, «empezar de cero», «Datos», «Borrar todo», la descripción de `index.html` y del manifiesto, y el modal de la semana nueva seguían hablando de exámenes y deberes | 🟡 Bajo | Reescritos (probado: ninguna vista los menciona) |
| 19 | **Código muerto** que despistaba: `#live-clock`, `#ai-status-pill/text`, el simulador `sim-*`, `#set-prio`/`defaultPrio`, `schDay`, `agendaFilter`, `START_HOUR/END_HOUR/SLOT_H`, `backupsRaw`, `lastSaveSize`, `early`, `subName`, `exceptionKind`, alias sin usar de `studio.js`, el menú lateral (`#menu-btn`, `#sidebar`, `#nav`), el botón flotante oculto y `#task-count` | 🟡 Bajo | Eliminados (0 selectores muertos tras el repaso); `.ics` ahora **usa** `icsFold` de verdad, plegando las líneas a 75 octetos contando bytes UTF-8 |
| 20 | La guarda `data:image` de las fotos antiguas no validaba el tipo de imagen | 🟡 Bajo | `md()` y las miniaturas pasan por `safeImgSrc()` |
| 21 | **Instantáneas de «Datos locales» a prueba de basura**: si `aula.snaps` tenía algo que no era una lista, «Punto de restauración» y «Restaurar» lanzaban una excepción | 🟠 Medio | `leerSnaps()`/`guardarSnaps()`: se parsea a salvo y solo se aceptan listas de copias con id |
| 22 | `settings.startHour`/`endHour` con valor `0` (medianoche) caían al valor por defecto por culpa de `|| 8`: los bloques de estudio y los huecos libres salían mal | 🟡 Bajo | Se comprueba con `Number.isFinite` en vez de `||` |
| 23 | **Agenda, pestaña Mes**: «‹» y «›» sumaban 30 días en vez de un mes, así que el calendario se iba de fecha (31 de enero → 2 de marzo) | 🟡 Bajo | Se avanza de mes en mes (`setDate(1)` + `setMonth(±1)`) |
| 24 | **Agenda, «Reservar estudio»**: el bloque duraba 45 minutos pasara lo que pasara, aunque el hueco fuese de 10 o de 90 (`(st().subjects||[]).length ? 45 : 45`) | 🟠 Medio | El bloque ocupa el hueco entero, con tope de 10 a 180 minutos |

**Verificación de esta ronda:** `npm test` = **182 comprobaciones ✓ / 0 ✗** (37 nuevas, una por fallo
de la tabla), recorrido automático de las 21 vistas con 337 clics y 10 modales **sin excepciones**,
`eslint` sin errores reales (solo quedan avisos de configuración de globals: `Response`, `Aula`,
`speechSynthesis`) y comprobación de que no queda ningún selector ni ajuste huérfano.

| Bug | Estado | Cómo se ha arreglado |
|---|---|---|
| BUG-01 cuota silenciosa | ✅ hecho | `save()` avisa en pantalla, ofrece exportar y deja de mentir. Guardado diferido + `flushSave` al cerrar |
| BUG-02 JSON corrupto destruido | ✅ hecho | Se guarda copia cruda en `aula.smr.v4.bak`, se explica y hay botón «Recuperar copia» |
| BUG-03 importar sin validar | ✅ hecho | `sanitize()` sanea cualquier JSON (propio, importado o del servidor) y la importación pide confirmación con resumen |
| BUG-04 Kanban NaN | ✅ hecho | Campo `left` (días) en vez de `due` (fecha): «hoy», «atrasada», «sin fecha» |
| BUG-05 servidor sin PIN | ✅ resuelto de raíz | **El servidor ya no existe**: se ha borrado `server.py` y toda la sincronización. No hay nada que escuchar en la red, así que no hay fuga posible |
| BUG-06 CORS del APK | ✅ resuelto de raíz | Sin servidor propio no hay CORS ni origen cruzado. El APK carga los ficheros empaquetados (Capacitor) y el Service Worker se salta a propósito dentro de la app |
| BUG-07 horario oficial machacón | ✅ hecho | Ya no se aplica solo: hay botón «Restaurar horario oficial» con confirmación y deshacer |
| BUG-08 PIN decorativo | ✅ hecho | Bloqueo real de lectura, búsqueda y vista previa + pantalla de PIN honesta («evita miradas, no cifra») |
| BUG-09 avisos limitados | ✅ aclarado | La propia interfaz dice el alcance; el APK puede programarlos. Pendiente: notificaciones nativas del APK |
| BUG-10 Pomodoro frágil | ✅ hecho | Estado del bloque en `aula.timer` con hora de fin: sobrevive a recargas y al segundo plano |
| BUG-11 minutos negativos | ✅ hecho | `sanitize()` recorta a 0-1440 y el formulario rechaza negativos y fechas futuras |
| BUG-12 intérprete de frases | ✅ hecho | Sinónimos por módulo (14/15 frases de prueba acertadas) y **vista previa** antes de guardar |
| BUG-13 .ics mal formado | ✅ hecho | CRLF, `DTSTAMP`, hora local coherente, escapado, `VALARM`, tareas con `DTEND`, plegado a 75 octetos |
| BUG-14 fotos gigantes | ✅ hecho | Ya no viven en el estado: se guardan comprimidas (1.280 px) en **IndexedDB** (`js/media.js`) y la nota las referencia por id. La migración de las fotos antiguas es automática, la copia de seguridad las incluye, Ajustes mide lo que ocupan y avisa al 80 %; si el navegador no deja usar IndexedDB, se sigue guardando dentro del estado como antes |
| BUG-15/16 borrado incompleto | ✅ hecho (y la papelera se retiró en la v54) | «Borrar todo» limpia toda clave `aula.*` y cachés; las instantáneas bajan de 5 a 3 y avisan si no caben |
| BUG-17 bajar estado a lo bruto | ➖ ya no aplica | El botón «Bajar estado» se ha eliminado con el resto de la sincronización: la app solo importa las copias JSON que eliges tú |
| BUG-18 Ollama colgado | ✅ hecho | `AbortController` a 45 s con mensaje claro |
| BUG-19 guía docente | ➖ ya no aplica | La vista «Guía docente» se retiró en la v54: era la que prometía más de lo que hacía |
| BUG-20 guardar en cada tecla | ✅ hecho | Versiones cada 2 minutos como mucho y guardado 600 ms después de dejar de escribir |
| BUG-21 guardar en cada render | ✅ hecho | `scheduleSave()` con retardo de 400 ms |
| BUG-22 botón atrás | ✅ hecho | `pushState` por vista y `popstate`: atrás navega por la app en lugar de cerrarla |
| BUG-23/24 versiones a mano | ✅ hecho | `APP_VERSION` única (`v50`), título coherente, README sin APK fantasma |
| BUG-25 FOUC y colores del manifest | ✅ hecho | Script previo a la pintura + `color-scheme`; manifest oscuro acorde con el tema por defecto |
| BUG-26 CSS inyectado por color | ✅ hecho | `safeColor()` en todos los estilos y saneado de datos importados/sincronizados |
| BUG-27 Service Worker | ✅ hecho | Nunca devuelve `index.html` para JS/CSS/imágenes; precache recurso a recurso con avisos |
| BUG-28/29 logros | ✅ hecho | El logro de tema compara con el tema real y el logro «madrugador» usa datos reales |
| BUG-30 `crypto.subtle` sin https | ✅ hecho | Mensaje honesto en lugar de excepción |
| BUG-31 confeti al marcar tarea | ✅ hecho | Respeta `settings.confetti` en todos los caminos |
| BUG-32 contraseñas sesgadas | ✅ hecho | Aleatorio por rechazo + uno de cada conjunto + mezcla |
| BUG-33 RAID 10 impar | ✅ hecho | Avisa de que el disco sin pareja no se usa |
| BUG-34 GB/GiB mezclados | ✅ hecho | Base 10/2 etiquetada y cálculo de copia explicado |
| BUG-35 IPv6 | ✅ hecho | Validación real (rechaza `gggg::`, `:::`), IPv4 embebida y compresión RFC 5952 |
| BUG-36 regex que congela | ✅ hecho | Límite de longitud, veto de cuantificadores anidados, tope de 500 coincidencias y corte a 300 ms |
| BUG-37 chmod | ✅ hecho | `4` → `--r--`, se ignoran setuid/sticky avisando |
| BUG-38 modo examen eterno | ✅ hecho | Se guarda la hora de fin, se restaura al abrir y hay botón para desactivarlo |
| BUG-39/40 onboarding | ✅ hecho | Bloque muerto eliminado; el asistente funciona y respeta la elección de datos de ejemplo |

**Además (mejoras de la misma tanda):**

- **Accesibilidad:** zoom permitido, `color-scheme`, foco visible, `aria-live` en los avisos,
  salto al contenido, `prefers-reduced-motion`, 11 temas con contraste AA corregido,
  **0 botones y 0 campos sin nombre accesible** en las 25 vistas, `aria-current` en la navegación,
  foco atrapado dentro de los diálogos y devuelto al cerrar, y menos toques accidentales
  (quitar una falta o una tarea pide confirmación).
- **Lo que estaba programado y no se podía usar:** rejilla de 33 temas con categorías,
  saltar bloque, modo escritura de fichas, importar CSV de horario, exportar Markdown/Anki/ICS,
  dictado, deshacer, huecos libres del horario convertidos en bloques de estudio,
  buscador global sobre notas/exámenes/tareas/módulos/fichas/glosario y las 37 herramientas,
  radar por módulo y mapa de calor de 28 días.
- **Datos a futuro:** `state.schemaVersion` para poder migrar sin parches sueltos, y botón de
  deshacer visible (antes solo existía con Ctrl+Z).
- **Repaso y apuntes (tanda `5654dd6`, v50):**
  - **Fotos en IndexedDB** (`js/media.js`, base `aula-smr-media`): el estado guarda la
    referencia, no la imagen. Se arregla además el markdown truncado a 32 caracteres del
    BUG-14, las fotos se ven **mientras escribes y en Vista**, se rellenan solas en cuanto
    se leen del almacén, la exportación las mete dentro del JSON y el borrado definitivo
    las suelta. Con 4,5 MB de cuota se avisa antes de que falle el guardado.
  - **Repetición espaciada de verdad (SM-2)**: `easeFactor` (1,3–3,2), `reps`, `lapses`,
    `interval` e historial de las últimas 20 respuestas, con los cuatro botones
    (Otra vez / Difícil / Bien / Fácil) enseñando el intervalo resultante, estadísticas
    nuevas/aprendiendo/maduras y reencolado de los fallos. Simulación: secuencia de «Bien»
    → 1, 6, 15, 38, 95, 238 días; un fallo vuelve a 0 días sin perder el historial.
  - **Excepciones de horario por fecha**: «esta clase se cancela», «se mueve a tal día»,
    «clase extra» y «es fiesta». Lo usan el horario, la agenda, la próxima clase, el botón
    de inicio y los huecos libres de studio.js, así que lo que se ve coincide con el día real.
- **Solo local (v51, esta tanda):** fuera `server.py`, el bloque «Servidor/Sync» de la vista
  *Datos locales* (antes «Servidor»), el indicador de sincronización del HTML y sus reglas CSS,
  y los ajustes `syncUrl`/`syncPin` (se limpian también de los estados importados). El
  **asistente** responde con el motor local (apuntes + horario + calendario) y, si conectas
  tu **Ollama** en tu red, tira de él; hay botón «Probar conexión» (`/api/tags`, 8 s) y si no
  contesta sigue el motor local. Se añadió `capacitor.config.json` para que el APK sea
  reproducible, y dentro del APK (`isNativeShell()`) no se registra Service Worker: los
  ficheros ya van dentro y una caché solo serviría versiones viejas.
- **Datos reales del centro (v56):** el horario y el calendario de las imágenes, dentro.
  Curso **2026-27 del 14/09/2026 al 18/06/2027**, con los festivos locales a efectos escolares
  **09/09/2026 (Fiestas de Villena), 07/12/2026 y 08/02/2027** (los antiguos 08/09, 10/09 y
  13/04/2027 ya no lo son). Las dos plantillas de horas del centro se pueden cargar desde
  Ajustes o desde el propio Horario y quedan anotadas en `settings.timetableKind`:
  **curso 15:15–21:45** y **temporal (septiembre y junio) 16:00–21:45**, con los 7 tramos
  exactos del documento. Plan L–V de 2.º SMR con los módulos reales (IPE I, DIG, SEG, SER,
  PRO, WEB, OPT, SOS, TUT), su profesorado y el aula de cada clase (**AULA 1NF3**, **AULA 2**,
  **AULA 3**), que ahora viaja con cada clase: en el horario se lee «AULA 1NF3» y no una
  etiqueta genérica. El Horario avisa en septiembre y junio de que toca la plantilla temporal,
  con botón para cargarla de un toque, y el Calendario recuerda las fechas del curso y los
  festivos locales. Un fallo real que salió al probarlo: había **dos** manejadores para
  «Restaurar horario», y el viejo (sin plantilla) se quedaba el clic; se eliminó.
- **Horario que se cambia solo, calendario escolar y app sin exámenes (v57):**
  el horario pasa a ser **por fechas reales** (semana navegable con ‹ / Hoy / ›) y **solo pinta
  clase los días lectivos** según el calendario del centro; los festivos, las vacaciones y los
  días fuera del curso salen en blanco con el motivo escrito. La plantilla de horas **se cambia
  sola**: en septiembre y junio aplica la temporal (16:00–21:45) y el resto del curso la de
  15:15, al abrir la app, cada 15 s y al volver del segundo plano, conservando ids, excepciones
  y asistencia (si has añadido clases tuyas, no toca nada y lo dice). La pestaña *Calendario*
  del Horario es ya el **calendario escolar** septiembre 2026 → junio 2027: días lectivos,
  festivos con nombre, vacaciones, «Sin curso» antes del 14/09, leyenda y resumen del mes.
  Y se han retirado de la app los **exámenes** y **los deberes**: fuera las vistas Exámenes,
  Tareas, Plan y Tablero, sus tarjetas de Inicio, sus avisos, el intérprete de frases que los
  creaba, los widgets nativos de examen/tareas (de 24 a 19) y el .ics de entregas; el .ics
  ahora exporta clases + festivos + vacaciones. **Notas** sigue viva, pero con la **nota de
  cada módulo** (editable en Calificaciones o en el módulo) en lugar de notas por examen, y la
  **Agenda** deja de repetir el horario: ahora es tu plan de estudio (bloques reservados, huecos
  libres y minutos hechos).
- **Ajustes más cortos (v55):** fuera la sección **«Tema visual»** (33 tarjetas y sus filtros)
  y la de **«Instalar como app»**, y de Inicio el aviso *«Ponla en la pantalla de inicio»*.
  Se mantiene el cambio claro/oscuro y el tema que ya tuvieras puesto. Con ellos se ha ido su
  código (SKIN_CATS, skinCards, filtros por categoría, acciones `set-skin`/`skin-cat`) y el CSS
  que solo usaban (`.skin-grid`, `.skin-card`, `.skin-swatch`, `.skin-cats`, `.skin-toolbar`).
- **Vistas retiradas (v54):** fuera **«Guía docente»** (importaba PDF/TXT y sacaba fechas y
  pesos) y **«Papelera»**. Al quitar la papelera, borrar una nota es definitivo pero avisa
  («Se borra del todo…») y sigue estando el botón *Deshacer el último borrado* de Ajustes, con
  las fotos liberadas del almacén. Si un móvil tenía notas dentro de la papelera, **vuelven
  solas a Apuntes al abrir** (con un aviso), en vez de desaparecer sin dejar rastro.
- **Vistas retiradas (v53):** fuera **«Cuatrimestre»** (la línea de fechas tipo Gantt): no
  aportaba nada que no dieran la Agenda y el Cuatrimestre del panel. Se eliminó el botón de
  «Más», la vista, sus estilos (`gantt-*` y `.timeline`) y su ruta; ahora la app tiene 27 vistas.
- **Navegación (v52):** la hoja «Más» ya no repite lo que está en la barra de abajo
  (se quitaron «Exámenes» y «Calificaciones», que duplicaban los botones de abajo), con un
  aviso en la propia hoja y una prueba que falla si vuelve a colarse un repetido.
- **Pruebas:** `npm test` ejecuta **111 comprobaciones** con jsdom en 18 secciones (arranque de
  las 25 vistas, datos corruptos, cuota, borrado, importación, temporizador, frases, PIN,
  `.ics`, etiquetas, SM-2, excepciones de horario, fotos en IndexedDB, copia con fotos y
  **«sin red»** —con un espía de `fetch` que demuestra que el chat no llama a nada si no
  configuras tu Ollama— y **navegación** —que «Más» y la barra de abajo no compartan vistas—)
  y hay CI en `.github/workflows/tests.yml`. También `.gitignore` y `package.json`.

**Pendiente (lo que queda de los sprints 3 y 4):**

- Notificaciones programadas reales en el APK (Android) para que suenen con la app cerrada.
- ~~El APK no es reproducible desde el repo~~ **✅ hecho**: el flujo `.github/workflows/apk.yml`
  compila, firma (`apk-overlay/keystore`), comprueba (firma, versión y los widgets) y publica
  el APK en *Releases* en cada cambio, además de la receta manual de `apk-overlay/README.md`.
- Refactor en módulos y poda de CSS (307 selectores redefinidos, 281 `!important`).
- CSP, `eslint` y política de privacidad/aviso legal.
- Reproducir (o retirar) el APK del README: hoy no está en el repositorio.

---

## 1. Bugs confirmados (reproducidos)

### 🔴 BUG-01 · `save()` silencia los errores de cuota — pérdida de datos silenciosa
`js/app.js:500-503`

```js
function save() {
  if (state.settings && state.settings.guest) return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}   // ← se traga TODO
  pushWidgets();
}
```

`localStorage` tiene ~5 MB. Con **dos fotos** en apuntes (cada una hasta 1,8 MB en base64) ya se puede llenar. Cuando se llena, `setItem` lanza `QuotaExceededError` y aquí se ignora: la app sigue funcionando como si hubiera guardado, el usuario trabaja horas y al cerrar la app **todo desaparece**.

**[verificado]** Simulé `setItem` lanzando `QuotaExceededError`: `save()` no lanza, no avisa, no hace nada.

**Arreglo:** capturar el error, mostrar un aviso persistente ("No se puede guardar: memoria llena"), sugerir exportar JSON y bloquear la adición de fotos nuevas. Además: mover adjuntos a IndexedDB y dejar en `localStorage` solo el texto.

---

### 🔴 BUG-02 · Un JSON corrupto destruye los datos y los sustituye por los de ejemplo
`js/app.js:489-497`

```js
try {
  const raw = localStorage.getItem(KEY);
  ...
} catch { return seedDemo(); }     // ← y después render() → save() sobreescribe la clave
```

`load()` está dentro de un `try` que abarca **todo** (parseo, normalización, migraciones). Cualquier fallo —JSON corrupto, un campo con el tipo cambiado, un `subjects` que no es array— devuelve los datos de demo. Como `render()` termina llamando a `save()` (`js/app.js:889`), la clave se sobrescribe: **el dato original ya no se puede recuperar ni con herramientas**.

**[verificado]** Con la clave `aula.smr.v4` = `{roto`, tras arrancar la app el valor guardado es el estado de ejemplo.

**Arreglo:** separar el parseo (con su propio try/catch) de la normalización; ante error, **no guardar**, mostrar un diálogo con "Exportar copia cruda / Empezar de cero"; y mantener una copia de seguridad rotativa (`aula.smr.v4.bak`) antes de sobrescribir.

---

### 🔴 BUG-03 · Importar o arrastrar datos sin validar rompe vistas y no hay salida
`js/app.js:1450`

```js
const items = [...state.exams].sort((a, b) => a.date.localeCompare(b.date))   // ← a.date puede no existir
```

`importJSON()` (`js/app.js:2674-2690`) hace `{...defaultState(), ...p}` **sin comprobar ni un solo campo**: ni que `exams`/`tasks` sean arrays, ni que cada examen tenga `date` y `title`. Tampoco hay `try/catch` alrededor de `render()`.

**[verificado]** Añadiendo un examen sin fecha, la vista Exámenes lanza `Cannot read properties of undefined (reading 'localeCompare')`. Lo mismo ocurre en `renderTasks` (`app.js:1630`), `renderPlan` (`app.js:1763`) y `collectCmd` (`app.js:2589`, `e.title.toLowerCase()`).

**Arreglo:** `sanitize(state)` que normalice cada colección (arrays + campos obligatorios con valores por defecto), `render()` envuelto en try/catch con pantalla de recuperación ("algo se ha roto → exportar / restaurar copia"), y una pantalla "Modo seguro" que no dependa de datos.

---

### 🟠 BUG-04 · Kanban: "NaN de undefined" y campo de fecha vacío
`js/studio.js:193-208`

```js
const due = t.due ? daysUntil(t.due) : 99;          // 193: due pasa a ser un NÚMERO
return { ...t, col: ..., due };                     // 195: sobrescribe la fecha original
...
<small>${esc(subjectName(t.subjectId))} · ${t.due ? fmtDate(t.due) : "sin fecha"}</small>   // 205
<input type="date" value="${t.due || ""}" ... />    // 208: "5" no es una fecha válida
```

`fmtDate()` espera un ISO y recibe un número → `new Date("5T00:00:00")` → `NaN`.

**[verificado]** Con una tarea que vence dentro de 5 días, la tarjeta del tablero dice literalmente `Seguridad informática · NaN de undefined`; con vencimiento hoy dice "sin fecha"; el input de fecha sale en blanco (y al tocarlo machaca la fecha buena con "hoy").

**Arreglo:** guardar `daysLeft` en otra propiedad (`left`) y dejar `due` intacto.

---

### 🟠 BUG-05 · El servidor sirve los datos sin PIN
`server.py:97` + `server.py:184`

```python
super().__init__(*args, directory=str(ROOT), **kwargs)   # sirve TODO el repo
...
sys.path → super().do_GET()                              # cualquier ruta desconocida → fichero estático
```

`/api/state` exige PIN, pero `/data/state.json` es un fichero normal dentro del directorio servido.

**[verificado]** Con el servidor arrancado con `--pin 1234`:
- `GET /api/state` → `401` ✅
- `GET /data/state.json` → **200 con todo el estado** (nombre, exámenes, notas) ❌
- `GET /data/` → **listado de directorios** con los backups rotados ❌

**Arreglo:** bloquear en `Handler` cualquier ruta que empiece por `/data/` (404), desactivar `list_directory()` y, a ser posible, sacar `data/` fuera de `ROOT`.

---

### 🟠 BUG-06 · La sincronización no puede funcionar desde el APK (CORS mal)
`server.py:208-214`

Solo `do_OPTIONS()` manda `Access-Control-Allow-Origin`. Las respuestas de `GET /api/state`, `PUT /api/state` y `/api/health` **no** lo llevan.

**[verificado]** `curl -D - http://127.0.0.1:8099/api/health -H "Origin: …"` → no aparece ninguna cabecera CORS.

Consecuencia: si abres Aula desde el APK (`capacitor://localhost`) o desde otro origen y quieres sincronizar con `server.py`, el navegador bloquea la lectura. Y al revés, `Access-Control-Allow-Origin: *` en un servidor con PIN por cabecera es un olor raro: mejor mismo origen o un token de verdad.

**Arreglo:** añadir las cabeceras CORS en `end_headers()` (no solo en OPTIONS), restringir el origen si se puede y documentarlo.

---

### 🟠 BUG-07 · El horario oficial machaca el del usuario
`js/app.js:406-418` y `js/app.js:495`

```js
if (out.settings.timetableId !== TIMETABLE_ID) applyOfficialTimetable(out);
```

`applyOfficialTimetable()` **reemplaza `st.events` entero**, renombra módulos por coincidencia de alias, fuerza `startHour=15`, `endHour=23` y `remindHour=14`. Se ejecuta en cada `load()` si `timetableId` no coincide (por ejemplo, al importar un JSON antiguo o si cambias el ID del centro). No pregunta, no avisa, no guarda copia.

Además, el horario real de un grupo concreto (clase `2CFM`, profesores con nombre y apellidos, festivos de Villena) está **hardcodeado** en el código: es un dato personal dentro del repo, y si el instituto cambia un aula o un profesor, cada usuario recibe el cambio a la fuerza o ninguno.

**Arreglo:** mover el horario a un JSON de "plantillas" importables; aplicar la plantilla solo en el onboarding o con un botón explícito ("Restaurar horario oficial"), nunca en `load()`.

---

### 🟠 BUG-08 · "PIN de notas" decorativo y PIN en claro
`js/app.js:2781` (se guarda el PIN), `js/studio.js:678-682`:

```js
if (action === "note-lock") {
  const pin = st().settings.pin;
  if (!pin) { toast("Pon un PIN en Ajustes"); return; }
  const n = ...; if (n) { n.locked = !n.locked; toast(n.locked ? "Nota protegida" : "Nota libre"); }
}
```

`locked` **no se lee en ningún otro sitio** del código. Una nota "protegida" se ve igual en la lista, en la búsqueda, en el asistente y en el JSON exportado (donde va también el PIN en texto plano).

**[verificado]** `grep -rn "locked" js/` → 1 sola aparición (la que lo escribe).

**Arreglo:** o implementarlo de verdad (cifrar el contenido con AES-GCM derivando clave del PIN con PBKDF2 y pedirla al abrir), o quitar el botón. Un candado que no cierra nada es peor que no tenerlo.

---

### 🟡 BUG-09 · Los avisos solo suenan con la app abierta
`js/app.js:249-297` (`tickNotify`) + `js/app.js:3351` (`setInterval` de 15 s) + `js/app.js:3312` (`visibilitychange`).

No hay `AlarmManager`/`WorkManager` en el overlay Android ni `showTrigger`/Notification Triggers en el SW. Fuera de la app (pantalla bloqueada, app cerrada) no llega nada. La UI lo vende como "Clase (10 min antes)" y "Racha en peligro" sin matizar que hay que tener la app abierta.

**Arreglo a corto:** ponerlo claro en la UI ("avisos mientras la app está abierta o en segundo plano reciente"). **A medio:** programar notificaciones nativas desde el plugin Capacitor (AlarmManager + BroadcastReceiver) y/o `periodicSync` en el APK.

---

### 🟡 BUG-10 · El Pomodoro no sobrevive a un recambio de app ni al background
`js/app.js:2437-2497`

- El estado del temporizador **no se guarda**: si recargas o el móvil cierra la pestaña, la sesión en curso se pierde sin más.
- El conteo es `setInterval` restando 1 por tick; con la pestaña en segundo plano los navegadores móviles lo estrangulan → **el tiempo real diverge del mostrado**.
- `completeTimer()` acredita `timer.total / 60` minutos completos, sin comprobar cuánto ha pasado de verdad.
- `navigator.wakeLock` se pide una vez; si la app pasa a segundo plano Android libera el lock y no se vuelve a pedir (falta re-pedirlo en `visibilitychange`).

**Arreglo:** guardar `startedAt`, `endsAt`, `mode` y `subjectId` en `localStorage` y calcular `remaining` desde la hora del sistema (`endsAt - Date.now()`); recuperar la sesión al abrir; re-pedir el wake lock al volver visible.

---

### 🟡 BUG-11 · Se pueden registrar minutos negativos (y bajar tu XP)
`js/app.js:2615-2623`, campo `minutes` sin `min` efectivo en la validación del submit:

```js
state.sessions.push({ ..., minutes: Number(data.minutes) || 0, type: "manual" });
```

**[verificado]** Insertando una sesión de `-500` min, el total de estudio pasa de **838 → 338** min y el XP/racha/nivel con él.

**Arreglo:** `clamp(Number(data.minutes), 1, 600)` y fecha no futura.

---

### 🟡 BUG-12 · El intérprete de lenguaje natural asigna el módulo equivocado y nunca avisa
`js/app.js:3129-3135` (`matchSubject`): busca la primera asignatura que comparta **una palabra de más de 3 letras**.

**[verificado]** Reproduciendo su lógica exacta con tus 10 módulos:

| Frase | Módulo asignado | Debería ser |
|---|---|---|
| "examen de redes el viernes" | Proyecto intermodular Sistemas microinformáticos y redes | Servicios en red |
| "practica de word mañana" | Seguridad informática (fallback a `subjects[0]`) | Aplicaciones web |
| "entrega de apache y dns" | Seguridad informática | Servicios en red |
| "examen de ipv6" / "subnetting y vlan" | Seguridad informática | Servicios en red |

Y `parseWhen()` (`app.js:3116-3128`) pone **+3 días por defecto** cuando no entiende la fecha, así que una captura sin fecha acaba en una fecha inventada sin decírtelo.

**Arreglo:** (a) tabla de sinónimos por módulo (ya existe `aliases` en `OFFICIAL_MODS`, se puede reutilizar), (b) puntuación por número de coincidencias y longitud, (c) **previsualizar** la captura interpretada ("Examen · Servicios en red · vie 18 sep") antes de guardar, en vez de crear el registro y confiar en que acierte.

---

### 🟡 BUG-13 · Exportación .ics mal formada
`js/app.js:2523-2538`

Falta lo que exige el RFC 5545: `UID`, `DTSTAMP`, `DTEND` (solo se emite `DTSTART`), plegado de líneas de más de 75 caracteres y escapado de `;` y saltos de línea en `SUMMARY`. Solo se escapan las comas.

Resultado: Outlook/Google Calendar pueden rechazar los eventos o importarlos como instantáneos sin duración.

**Arreglo:** generar `UID` estable (`id@aula-smr`), `DTSTAMP` con la hora de export, `DTEND` = hora + 1 h (o campo de duración), plegar líneas y escapar `\ ; , \n`.

---

### 🟡 BUG-14 · Las fotos en apuntes quedan rotas y engordan el almacenamiento
`js/studio.js:656-672`

```js
n.attachments.push({ id, name: f.name, data: r.result, kind: "img" });       // base64 completo
n.content += `\n\n![foto](${r.result.slice(0, 32)}…)\n`;                    // ← recortado a 32 chars
n.content += `\n<!--img:${n.attachments.length - 1}-->\n`;
```

- El markdown de la imagen está **truncado a 32 caracteres**: en la vista previa se ve basura, nunca la foto.
- El adjunto real (hasta 1,8 MB → ~2,4 MB en base64) va dentro del JSON de estado, que se guarda entero en `localStorage` en **cada tecla** que escribes (ver BUG-20).
- No hay OCR, aunque el mensaje invita a "escribir el texto a mano".

**Arreglo:** guardar adjuntos en IndexedDB y referenciarlos por id; renderizar la imagen desde el id; opción de comprimir a ~1200 px antes de guardar.

---

### 🟡 BUG-15 · Los "puntos de restauración" pueden reventar (y no se borran nunca)
`js/studio.js:594-603`: guarda **hasta 5 copias completas del estado** dentro de `localStorage`, sin `try/catch`. Con fotos o muchas sesiones, `setItem` lanza `QuotaExceededError` → excepción no capturada en medio del manejador de clic (rompe esa acción y puede dejar la UI a medias).

Y como `doWipe()` (`js/app.js:2659-2665`) solo hace `state = defaultState()`, las copias de `aula.snaps` **sobreviven al "Borrar todo"**.

**[verificado leyendo código]** `doWipe()` no toca `aula.snaps` ni las claves `aula.nt.*`.

**Arreglo:** snapshots fuera de `localStorage` (IndexedDB o descarga a fichero), `try/catch` con aviso, y limpieza de **todas** las claves de la app en el borrado total (con aviso explícito de qué se borra).

---

### 🟡 BUG-16 · "Modo invitado" que pierde el trabajo
`js/studio.js:615-616` + `js/app.js:501`

`guest-on` pone `settings.guest = true` pero **no lo guarda** (save() sale antes), así que al recargar vuelves a modo normal sin avisar. Mientras estás en invitado, todo lo que edites se descarta en silencio (y si pulsas "Salir", `save()` guarda de golpe lo que creías no persistente).

**Arreglo:** que el invitado sea una sesión explícita con banner fijo ("Modo invitado: no se guarda") y un botón "Guardar ahora"; o eliminar la función.

---

### 🟡 BUG-17 · "Bajar estado" del servidor machaca sin preguntar
`js/studio.js:572-591`: `Object.assign(st(), j.state)` sustituye arrays completos sin confirmación, sin merge, sin copia previa. Un clic y tus apuntes locales desaparecen si el servidor tenía otro estado.

**Arreglo:** diálogo de confirmación con resumen ("el servidor tiene 3 exámenes y 12 notas; lo local tiene 8 y 40"), snapshot automático antes de aplicar y aviso de conflicto.

---

### 🟡 BUG-18 · El asistente (Ollama) puede colgarse y nadie se entera
`js/studio.js:243-258`: `fetch` sin `AbortController`/timeout, sin estado de "pensando…", sin indicador de error salvo el fallback local. Si la URL no responde, el usuario ve el botón "Preguntar" sin reacción durante minutos.

**Arreglo:** timeout de 20 s con `AbortController`, spinner/bloqueo del botón, mensaje de error claro y aviso de privacidad ("tus apuntes se envían a esta URL").

---

### 🟡 BUG-19 · "Importar guía docente" promete más de lo que hace
`js/studio.js:80-105` (`extractPdfStrings`) convierte el PDF a texto quedándose con los bytes ASCII imprimibles. En PDFs reales (comprimidos con Flate) eso produce ruido, no texto. Con ese ruido, `guide-apply` crea exámenes cuyo **título son 40 caracteres de contexto** alrededor de la fecha.

**Arreglo (v54):** la vista se ha **retirado**. En vez de prometer un análisis de PDF que no
puede hacer sin añadir `pdf.js`, se quita de la app: las fechas se añaden a mano o con la
captura rápida. (`extractPdfStrings` y `parseGuideText` ya no existen.) Si algún día se
quiere volver a ella, la vía correcta es empaquetar `pdf.js` local y limpiar los títulos.

---

### ⚪ BUG-20 y menores (pero conviene arreglarlos)

| ID | Problema | Dónde |
|---|---|---|
| BUG-20 | `persistNote()` se dispara en **cada pulsación de tecla** → `JSON.stringify` de todo el estado + una versión nueva en el historial por letra | `js/app.js:3051`, `2397-2410` |
| BUG-21 | `render()` llama a `save()` al final de **cada** render (navegar = reescribir todo) | `js/app.js:889` |
| BUG-22 | El botón atrás de Android sale de la app: se usa `history.replaceState`, así que las vistas no entran en el historial y el listener `hashchange` rara vez actúa | `js/app.js:2607`, `3325-3329` |
| BUG-23 | `document.title` alterna `Aula SMR` y `Aula` según el temporizador | `js/app.js:2479` |
| BUG-24 | Versión `v48` duplicada a mano en `README.md`, `sw.js` (nombre de caché), `index.html` (pie) y `app.js` | — |
| BUG-25 | FOUC: `<html class="dark" data-theme="dark" data-skin="hub">` está fijo en el HTML; quien use tema claro ve un flash negro en cada apertura, y `theme-color` (#000000 fijo) descuadra con el manifest (`background_color: #8daed9`, un azul que no pega con nada) | `index.html:2`, `manifest.webmanifest` |
| BUG-26 | `esc()` no se aplica a valores interpolados en `style="background:${subjectColor(...)}"` → un JSON importado con `"color": "red;background-image:url(...)"` inyecta CSS | `js/app.js` (varias) |
| BUG-27 | SW: ante el fallo de **cualquier** JS/CSS devuelve `index.html` (HTML servido como JS → pantalla en blanco), y `addAll(...).catch(()=>{})` deja el precache incompleto sin que nadie lo sepa | `sw.js:46`, `140`, `154` |
| BUG-28 | Los logros "Cambio de look" se desbloquea solo (compara con el skin `"redes"` pero el skin por defecto es `"hub"`) | `js/app.js:1000` |
| BUG-29 | Código muerto en los logros: `early` se calcula con un `return false` hardcodeado | `js/app.js:955` |
| BUG-30 | `crypto.subtle` (SHA-256 de la caja de herramientas) **no existe en contexto no seguro**: sirviendo por `http://IP:8080` —justo el método que recomienda el README— la herramienta falla con excepción no capturada | `js/tools.js:801` |
| BUG-31 | Al cerrar un bloque, `confetti()` y `buzz()` se disparan también al marcar una tarea, con `state.settings.confetti` de por medio pero `confetti()` llamada directa en un sitio | `js/app.js:2890` |
| BUG-32 | El generador de contraseñas usa módulo directo sobre el buffer aleatorio (sesgo estadístico) y no garantiza que salga al menos un carácter de cada conjunto marcado | `js/tools.js:186-198` |
| BUG-33 | `RAID 10` con número impar de discos calcula capacidad como si fuera par | `js/tools.js:784` |
| BUG-34 | "GB vs GiB" y "tiempo de copia" mezclan base 10 y base 2 sin decirlo (`1e9` bits), y `toPrecision(6)` imprime `1.00000` | `js/tools.js:755-772` |
| BUG-35 | `expandV6()` tiene código muerto (`parts`, filtro sin usar) y acepta hex inválidos (`gggg::`) | `js/tools.js:606-625` |
| BUG-36 | Regex de la caja de herramientas sin flags y sin límite → una expresión catastrófica congela la pestaña | `js/tools.js:827-834` |
| BUG-37 | `applyOctal()` hace `padStart(3,"0")` tras recortar a 3 dígitos: `chmod 7777` o `chmod 4` se interpretan mal sin avisar | `js/tools.js:176-186` |
| BUG-38 | El cronómetro del modo examen (`exam-lock`) se activa con un `setTimeout` de 90 min: si cierras la app, el modo se queda "puesto" sin control visible | `js/studio.js:511-514` |
| BUG-39 | El bloque de bienvenida de `renderDashboard` (`finish-onboard`) **no tiene manejador** y encima es inalcanzable (la vista hace `return` antes si no está onboarded) | `js/app.js:1339` |
| BUG-40 | Al terminar el onboarding siempre se pone `demo = false`, así que el aviso "Datos de ejemplo / Empezar de cero" **nunca** aparece aunque hayas elegido el ejemplo | `js/app.js:2928` (skip/finish) y `2942` (on-next) |

---

## 2. Funciones implementadas que no se pueden usar (sin botón)

Comprobado renderizando las 28 vistas de entonces y contando botones en el DOM: **123 acciones pintadas para 170 manejadores**. Estas están programadas pero no tienen ningún botón que las invoque:

| Función | Estado | Dónde está el código |
|---|---|---|
| **Selector de 33 temas/skins** (`skinCards`) | Función nunca llamada. En Ajustes hay **0 botones** `set-skin`. Solo puedes alternar claro/oscuro | `app.js:1112`, `514` (`skinCat`) |
| **Dictado por voz** (`voice-fab` / `toggleVoice`) | 0 botones en toda la app; el micrófono nunca se puede pulsar | `app.js:2856`, `3163` |
| **Saltar bloque del Pomodoro** (`timer-skip`) | handler sin botón | `app.js:2901` |
| **Modo escritura de fichas** (`card-mode` / `card-typed` / `_cardMode === "type"`) | El bloque de "Escribe la respuesta" está tras una condición que nadie puede activar | `app.js:1605`, `studio.js:693` |
| **Importar horario CSV** (`csv-import`) | El `change` de `#csv-file` existe, pero no hay forma de abrir el selector | `studio.js:620` |
| **Exportar a Anki** (`export-anki`) | sin botón | `studio.js:627` |
| **Exportar apuntes a Markdown** (`export-md`) | sin botón | `studio.js:621` |
| **Imprimir/PDF de apuntes** (`export-pdf-notes`) | sin botón (solo existe "chuleta" en Repaso rápido) | `studio.js:634` |
| **Añadir clase en la rejilla horaria** (`slot-add`) | El horario es una lista, no una rejilla: el handler nunca recibe clic | `app.js:2874` |
| **Abrir módulo** (`open-mod`) | Duplicado de `open-subject`, nunca pintado | `app.js:2861` |
| **Filtro de tareas** (`task-filter`) y **pestaña de exámenes** (`exam-tab`) | Variables de estado y manejadores sin UI | `app.js:2891`, `2867` |

Y **9 funciones muertas** en `app.js`: `maybeNotify`, `greeting`, `medals`, `heatDays`, `todayTimeline`, `skinCards`, `chk`, `cycleSkin`, `radarSVG` (+ `val`). Consecuencia visible: el menú "Más" promete **"Calificaciones · Radar, media y simulador"**, pero `radarSVG()` no se llama en ningún sitio → **el radar no existe**; tampoco el mapa de calor de estudio ni el saludo personalizado.

---

## 3. Cosas que están bien (no todo va a ser palos)

- **Offline de verdad**: el Service Worker precachea HTML, CSS, JS e iconos; la app arranca sin red. La estrategia network-first con fallback es correcta para este caso.
- **Sin dependencias ni build**: 454 KB en total, cero npm, cero CDN. Se abre en cualquier navegador. Para el público objetivo (móvil justo de recursos, wifi del instituto) es una decisión acertada.
- **Datos portables**: export/import JSON + `.ics` + snapshots internos. Buen instinto.
- **Herramientas SMR**: 37 utilidades. El subnetting está **correcto** (probado con /0, /31, /32, clases, wildcard), chmod octal/simbólico, RAID 0/1/5/6/10 y conversión de unidades funcionan bien.
- **Detalles de plataforma bien resueltos**: `env(safe-area-inset-*)`, `100dvh`, `prefers-reduced-motion`, `color-scheme`, `theme-color` dinámico, `-webkit-tap-highlight-color`, iconos maskable en el manifest.
- **Sistema de temas**: 33 skins con variables CSS coherentes y bien organizadas por familias; los colores de acento, líneas y sombras se recalculan solos.
- **Gamificación bien pensada**: XP, niveles, rachas, comodín semanal, logros por categorías. Para un ciclo de FP es un gancho real.
- **`server.py`**: backups rotados (12), escritura atómica con `.tmp` + `replace`, bloqueo con `threading.Lock` y SSE para notificar cambios. Está mejor hecho que el resto del backend.
- **CSS de impresión y `focus-mode`** existen y funcionan.

---

## 4. Lo que mejoraría (no es bug: es producto)

### 4.1 Datos y confianza
1. **Copias de seguridad automáticas**: al abrir, si la última copia tiene >7 días, guardar una copia comprimida en IndexedDB y ofrecer descargarla. Hoy el usuario no tiene ninguna red.
2. **Advertencia de "sin guardar"** cuando `localStorage` esté por encima del 80 % de cuota, con botón "Exportar y limpiar".
3. **Versionado de datos**: `state.schemaVersion` + migraciones por versión (`v4 → v5`) en vez de parches sueltos (`if (settings.skin === "pokemon")`).
4. **Historial de cambios global** (no solo en notas): quién cambió qué y cuándo, con "deshacer" en todas las acciones (hoy `undo` solo cubre borrados, y **no tiene botón**: la acción `undo` está manejada pero no pintada, solo funciona con Ctrl+Z).

### 4.2 Estudio y utilidad real para clase
5. **Panel "hoy" unificado** con la siguiente acción concreta ("faltan 3 días para el parcial de SOR → 40 min de estas 2 notas"), en vez de 6 tarjetas que repiten información.
6. **Vista semanal del horario en rejilla** con horas reales (los datos y constantes `START_HOUR/SLOT_H` ya existen pero están muertos) y detección de huecos como en `freeSlots()` de studio.js.
7. **Excepciones por fecha**: poder decir "el martes 15 no hay clase" o "esta clase se cambia al jueves". Hoy el horario es puramente semanal y los festivos son una lista fija en código.
8. **Fichas con repetición espaciada de verdad** (SM-2 real, con `easeFactor`, `lapses` y estadísticas), en lugar del intervalo `x2 / x3.5` actual.
9. **Estadísticas con objetivo por módulo**: "llevas 3 h de 12 h previstas para Servicios en red" con aviso cuando el ritmo no da.
10. **Integración .ics de solo lectura** (URL de Google Calendar del instituto) además de exportar.

### 4.3 UX
11. **Buscador global real**: `Ctrl+K` funciona, pero solo busca notas y exámenes; debería indexar tareas, módulos, fichas, apuntes y herramientas (37).
12. **Acciones masivas**: marcar todas las tareas de un módulo, borrar exámenes pasados, archivar el trimestre.
13. **Onboarding más corto** (7 pantallas para configurar un horario que ya viene cargado es demasiado) y **skippable en un toque**.
14. **Feedback de guardado**: un indicador discreto ("guardado hace 1 min") en vez de nada.
15. **Estados vacíos útiles**: hoy `"<div class='empty'>Vacía.</div>"` no explica cómo llenarlo ni lleva a la acción.
16. **Modo profesor/exportar para compartir** o al menos "copiar resumen de la semana" para pegar en el grupo de clase.

### 4.4 Accesibilidad (y esto sí es importante)
17. **Quitar `user-scalable=no` y `maximum-scale=1`** (`index.html:5`): impide el zoom y es un fallo directo de WCAG 1.4.4. Con texto de 11 px y skins densos, el zoom es una ayuda real.
18. **`:focus-visible` en condiciones**: hay **3 reglas de `:focus` en 148 KB de CSS** y 278 `!important`. Navegando con teclado o en Android TV no se ve dónde estás.
19. **Etiquetas de verdad**: 12 inputs de Ajustes y 27 en total no tienen `<label for>` ni `aria-label` (los `<label>` no están asociados a nada). Falta `aria-live` en la región de toasts y `aria-current="page"` en la navegación.
20. **Botones sin nombre accesible**: los 8 selectores de color (solo color de fondo), las fotos de avatar e iconos de app (`<img>` sin texto alternativo).
21. **Diálogos**: `openModal` pone `role="dialog"` y `aria-modal`, pero no hay **trampa de foco** ni devolución del foco al cerrar; el `Escape` está bien.
22. **Contraste**: medidos los 30 pares `--muted`/fondo de las skins. **Fallos**: `gameboy` 2.75:1, `tokyo` 2.76:1, `kawaii` 2.94:1 (por debajo incluso del mínimo para texto grande, 3:1); y `dracula` 3.03, `isla` 3.40, `pergamino` 3.89, `cafe` 4.06, `minimal` 4.23, `azul` 4.41 quedan por debajo de AA (4.5:1) para texto normal. Como el `--muted` se usa para metadatos y ayudas, hay texto difícil de leer en 9 de 33 temas.
23. **Área táctil**: `.att` (Presente/Retraso/Falta), `.icon-del` (×) y `.chip` están por debajo de 44×44 px en varios sitios; y "Asistencia" reacciona a un toque doble quitando el registro sin confirmación.

---

## 5. Rendimiento

| Métrica | Valor | Comentario |
|---|---|---|
| `js/app.js` | 189 KB (52 KB gzip) | Se ejecuta entero al arrancar, en 3 ficheros sin módulos |
| CSS total | 148 KB | 7 capas que se pisan entre sí: **278 `!important`** y 307 selectores redefinidos (`.modal` 7 veces, `.toasts` 8 veces…) |
| `render()` | reescribe `innerHTML` de toda la vista | pierde foco y scroll interno, y vuelve a construir cadenas grandes |
| `save()` | `JSON.stringify` del estado completo | se llama **en cada render** y **en cada tecla** al escribir una nota |
| Iconos | 23 avatares × ~10 KB precacheados | bien, pero van en el bloque de instalación del SW (retrasa el primer `install`) |
| `setInterval(15 s)` | recalcula `widgetPayload()` (con varios `sort` y `filter` sobre todo el estado) y toca el DOM | da igual si no hay widgets nativos: `pushWidgets()` sale antes, pero el resto sigue |

**Mejoras concretas:** `requestAnimationFrame` + render por vista con *dirty flags*; debounce de `persistNote` (500 ms) y guardado en `visibilitychange`/`beforeunload`; separar el estado en "ajustes" (pequeño, síncrono) y "contenido" (grande, IndexedDB); minificar con esbuild en un `npm run build` opcional (sin obligar a build para desarrollo); y consolidar las 7 hojas CSS en 2 (base + temas) eliminando duplicados.

---

## 6. Repositorio, proceso y mantenibilidad

1. **No hay `.gitignore`**: `data/` (estado sincronizado y backups), `__pycache__/`, `*.apk`, `node_modules/` acabarían dentro de Git. Es lo primero que añadiría.
2. **No hay tests, ni linter, ni CI, ni `package.json`**. Con `app.js` de 3.368 líneas y 153 funciones, un mínimo de `eslint` + un test smoke con jsdom (el que usé para auditar) habría cazado BUG-03, BUG-04 y BUG-08 solos.
3. **`README.md` miente en la primera línea relevante**: dice que `Aula-SMR-v48.apk` está en la carpeta y no está. Tampoco explica `apk-overlay/` ni `server.py` más allá de una línea.
4. **El APK no es reproducible desde el repo**: `apk-overlay/apply.py` espera un proyecto Capacitor externo por parámetro (`sys.argv[1]`), y no hay instrucciones para generarlo. O se documenta el proceso completo (con versión de Capacitor, `capacitor.config`, iconos, `build.gradle`) o el overlay se marca como "no soportado".
5. **`python3 -m http.server` no sirve para el SW**: sin `Service-Worker-Allowed`/tipos MIME correctos y sin los headers de `server.py`, el README empuja al usuario a un camino que rompe la instalación como PWA en algunos navegadores. Mejor recomendar `python3 server.py`.
6. **Un solo `app.js` de 189 KB** con 3 capas de módulos comunicándose por `window.Aula` (getters que exponen el estado mutable) es el mayor coste de mantenimiento. Dividir en `store.js`, `ui.js`, `views/*.js`, `timer.js`, `notify.js`, `achievements.js` (o módulos ES) haría el resto del trabajo mucho más barato.
7. **`window.Aula`** expone `state` mutable: cualquier módulo puede corromper el estado sin pasar por el `save()`. Un store con `set()`/`subscribe()` lo evita.
8. **Sin versionado de assets** (`app.js?v=hash`): el SW cachea por URL, así que una actualización depende de que el SW haga red primero. Con nombres con hash es determinista.
9. **Sin política de privacidad ni aviso legal**: se guardan nombres de profesores, horarios y notas de un menor. Y no hay forma de exportar/borrar "todo lo personal" de golpe (ver BUG-15).
10. **Nada de `content-security-policy`** ni separación de estilos inline: cientos de `style="..."` embebidos. No es urgente en una app local, pero complica cualquier endurecimiento futuro.

---

## 7. Plan de trabajo propuesto (por orden de dolor)

### Sprint 1 — "que no se pierdan datos" (medio día) — ✅ completado
- [x] BUG-01 `save()` con aviso de cuota + bloqueo de fotos si no cabe
- [x] BUG-02 no sobrescribir nunca el JSON roto + copia `.bak` rotativa
- [x] BUG-03 `sanitize()` + `try/catch` en `render()` + pantalla de recuperación
- [x] BUG-15/16 borrado total completo (`aula.snaps`, `aula.nt.*`, cachés) + snapshots con try/catch
- [x] BUG-04 Kanban (arreglo de 3 líneas)
- [x] BUG-11 validación de minutos

### Sprint 2 — "que lo que existe se pueda usar" (1 día) — ✅ completado
- [x] BUG-06/BUG-05 servidor: CORS correcto + bloquear `/data/`
- [x] BUG-07 sacar el horario oficial de `load()` y convertirlo en plantilla importable
- [x] Selector de temas en Ajustes (`skinCards` + categorías) — 33 temas recuperados
- [x] Botones para: saltar bloque, modo escritura de fichas, exportar Anki/MD, importar CSV, voz
- [x] BUG-08 decidir PIN: implementado y con aviso honesto de su alcance
- [x] BUG-17 confirmación antes de "Bajar estado"

### Sprint 3 — "que se sienta bien" (2-3 días) — ✅ completado
- [x] Temporizador persistente y fiable (BUG-10)
- [x] Avisos: alcance explicado en la propia interfaz (BUG-09). Falta el APK
- [x] Accesibilidad: zoom, `:focus-visible`, labels, nombres accesibles, contraste de las 9 skins flojas (sección 4.4)
- [x] NLP con sinónimos y previsualización antes de guardar (BUG-12)
- [x] `.ics` correcto (BUG-13), fotos en IndexedDB (BUG-14)
- [x] Repetición espaciada real (SM-2) y excepciones de horario por fecha (4.2)
- [ ] Limpieza: 9 funciones muertas (hecho en `2aabe57`), ajustes fantasma y poda de CSS pendiente

### Sprint 4 — "que aguante el curso" (a decidir)
- [ ] Refactor en módulos + store con `subscribe()`
- [x] Tests (jsdom, 74 comprobaciones) + GitHub Actions. Falta `eslint`
- [x] `.gitignore` + README real (APK retirado del README)
- [x] Adjuntos en IndexedDB, export/borrado completo de datos personales
- [ ] CSP y política de privacidad

---

## Anexo A · Métricas medidas

| Métrica | Valor |
|---|---|
| Ficheros versionados | 61 (22 avatares + 3 iconos + resto de código y capas CSS) |
| Líneas totales | 9.225 (`wc -l`): JS 5.002, CSS 3.586, HTML 237, SW 156, Python 244 |
| Vistas / pantallas | 25 (se retiraron «Cuatrimestre» en la v53 y «Guía docente» y «Papelera» en la v54) |
| Herramientas SMR | 37 |
| Skins definidas | 33 (+ 2 temas claro/oscuro) |
| Acciones `data-action` manejadas | 170 (123 con botón) |
| Funciones nunca llamadas en `app.js` | 9 (+ `val`) |
| Ajustes leídos por `saveSettings()` sin control en la UI | 31 (6 de ellos no se usan en ninguna parte) · Ollama ya se guarda y se prueba desde la UI (v51) |
| `!important` en CSS | 278 |
| Selectores CSS redefinidos | 307 |
| Reglas `:focus` en CSS | 3 |
| `try/catch` vacíos en app.js + studio.js | 15 |
| Skins con contraste `--muted` < 4.5:1 | 9 (3 de ellas < 3:1) |

## Ronda v59 · Rediseño de interfaz (estética Trade Republic)

**Objetivo del usuario:** «mejores mucho más la interfaz, hay muchas cosas que se ven como el culo… que sea intuitiva y súper guapa, con la estética de Trade Republic, manteniendo la misma esencia» + rehacer el calendario escolar del Horario.

### Qué se hizo

1. **Una sola hoja de interfaz.** `css/ui.css` (≈1.650 líneas, 35 secciones) sustituye a `hub.css`, `look.css`, `plus.css` y `polish.css`, que se **borran** (2.426 líneas retiradas). Se carga la última, tras `styles.css`, `skins.css` y `themes.css`, así que manda ella sin pelearse con las pieles.
2. **Capa de tokens en tres niveles**, para no romper las 14 pieles ni los 20 temas:
   - `:root` → medidas, formas y derivados que **ningún** tema define (`--surface-2`, `--chip`, `--muted-2`, `--radius-sm/lg/xs`, `--nav-h`, `--pad`), calculados a partir de los tokens del tema (`color-mix`) para que cada piel conserve su carácter.
   - `html[data-skin="hub"]` / sin skin → identidad de la casa (radio 22 px, tipografía del sistema).
   - `html[data-theme="dark"|"light"]` → paleta, con la misma prioridad que tenía `hub.css` en la v58, así que **ninguna piel cambia de comportamiento** respecto a lo que ya había.
3. **Cromo nuevo en todas las vistas:** cabecera compacta, tarjetas de radio grande, botones con acción principal en blanco sobre negro, chips, campos de 16 px (sin zoom al enfocar en Android), barra inferior de 5 con etiqueta y pastilla de activo, panel «Más», modales tipo hoja, avisos y buscador (⌘K).
4. **Calendario escolar reescrito** (pestaña *Calendario* del Horario): cabecera con mes y subtítulo del curso, resumen del mes (días de clase / festivos / vacaciones), aviso de vacaciones cuando el mes las toca, rejilla de semanas completas con colores por tipo de día, punto para festivo/vacaciones, leyenda, lista de los días sin clase y tarjeta con las fechas del curso 2026-27.
5. **Ajustes que la hoja vieja daba por hechos:** «Tamaño del texto» (`data-ui-size`), modo compacto (`data-compact`), bloqueo de examen (`body.exam-lock` oculta la captura) y el aviso de invitado, que ahora es un chip real en la cabecera (`#guest-chip`).
6. **Capas de apilado ordenadas** (el fallo clásico de este tipo de rediseños): barra inferior 80, panel «Más» 45, superposiciones 100, modales 110, buscador 120, avisos 140. La barra queda por encima del panel «Más» y el panel reserva el hueco de la barra, como en la v58.
7. **Sin CSS muerto propio:** de las 232 clases que usan el HTML y los cuatro JS, todas menos 6 tienen regla. Las 6 restantes están verificadas como inofensivas (`dark`/`light` en `documentElement`, `is-loading` —ya con estilo de carga—, `is-touch` —ya con reglas táctiles—, `more-open` y `work`, que se usan como estado).

### Comprobaciones

- `npm test` → **198 comprobaciones ✓** (15 nuevas de esta ronda: rejilla de semanas completas, resumen, leyenda, marcadores, salto de día a su semana, hoja única enlazada la última, hojas retiradas, llaves cuadradas de `ui.css`, chip de invitado).
- Contraste WCAG de la paleta nueva: texto 19,0:1 · secundario 5,8:1 · verde 9,5 · rojo 6,3 · ámbar 10,4 · azul 6,9 (todo AA o mejor).
- Llaves de `ui.css` cuadradas (610/610) y `node --check` limpio en `js/app.js` y `tests/smoke.test.js`.

### Lo que no se pudo verificar (honestidad)

No hay navegador headless disponible en este entorno (`playwright`, `chromium` y Electron están bloqueados), así que **no hay capturas**: la revisión visual se ha hecho leyendo el HTML que genera cada vista en jsdom y comprobando que cada clase pintada tiene su regla. Los 20 temas y las 14 pieles se han revisado por código, no a ojo.

---

## Ronda v60 · Segunda pasada de interfaz (pulido fino)

Segunda vuelta sobre la interfaz, ya con la hoja única de la v59 como base. Cambios, todos verificables en el código:

### Calendario escolar, otra vez a mejor

Se rehízo el marcado y el CSS (la v59 dejaba puntos bajo los números y una lista con fechas en texto monoespaciado):

- **Días redondos** del tamaño justo para el dedo (≈47 px) en rejilla de semanas completas; los fines de semana bajan a gris, los días fuera del curso al 40 % de opacidad.
- **Hoy** es un círculo blanco con el número en negro y `aria-current="date"`; festivos en rojo suave y vacaciones en ámbar suave, sin puntos sueltos.
- **Píldoras de contexto** bajo el resumen: vacaciones que tocan el mes, el próximo día sin clase («En 21 d · …») y un atajo **Ver hoy** cuando estás en otro mes.
- La lista de días sin clase pasa a filas con **ficha de día** (número grande + día de la semana) teñida según el tipo, motivo y fecha completa; la leyenda usa los mismos colores que la rejilla.
- Se retiró el marcado antiguo (`.mk`, `.cal-vaca`) y el test se actualizó a la estructura nueva.

### Lo que se veía peor, arreglado

1. **Módulos (antes «Módulos», dos columnas).** Con nombres como «Itinerario personal para la empleabilidad II» en 170 px de ancho el texto se rompía en cinco líneas. Ahora es una **lista de una columna** con ficha de color (código del módulo), nombre, profesor/aula, horas y **nota** a la derecha; la tarjeta de «nuevo módulo» va con borde punteado. Arriba, cabecera con módulos, horas estudiadas y nota media.
2. **Herramientas y panel «Más».** Los 40 iconos llevaban colores fijos de la paleta vieja (21 valores distintos, algunos casi fluorescentes). Ahora cada icono usa `--c` con una **paleta de 11 acentos por tema** (`--acc-*`), con valores propios en claro y en oscuro, y el icono va sobre un fondo del propio color.
3. **Horario.** Tres párrafos de texto al principio (`sch-hint`, aviso de plantilla y leyenda de asistencia) pasan a **una fila de píldoras** (horario temporal + tramo, días de clase de la semana, leyenda P/R/F) y el rango de fechas sube al título.
4. **Notas.** El radar iba suelto entre secciones como un dibujo sin contexto: ahora va en una caja con título y pie («cada eje, un módulo»).
5. **Agenda.** Era la vista menos acabada (encabezados `<h3>` sueltos y párrafos sin tarjeta): ahora tiene **tarjetas** para bloques, huecos libres y resumen en tres cifras; el tablero de mes usa celdas cuadradas propias (`.cal-dense`) en vez de heredar los círculos del calendario escolar, con el nombre del módulo dentro.
6. **Ajustes.** El botón **Guardar** vivía al final de una pantalla de 21 KB: ahora va en una barra fija (`.set-actions`, `position: sticky`) que flota por encima de la barra inferior.
7. **Cromo general.** Superficies con hairline y brillo interior (`--card-in`, `--card-bd`, `--card-sh`) en vez de sombras duras; **foco visible** para teclado (`:focus-visible`); numeraciones tabulares en todos los marcadores; titulares con `text-wrap: balance`; estados vacíos con fondo suave; respuesta táctil homogénea en todo lo pulsable; cabecera con hairline al hacer scroll; `prefers-reduced-transparency` respetado; y respaldos `100vh` antes de cada `100dvh`.
8. **Utilidades en vez de estilos en línea.** Se sustituyeron 16 `style="width:100%;margin…"` por clases (`.btn-block`, `.mt-8`, `.mb-12`, `.seg-timer`, `button.row`…), de forma que la interfaz se puede reajustar sin tocar JS.

### Comprobaciones

- `npm test` → **216 comprobaciones ✓** (12 nuevas: ninguna vista enseña `undefined`/`NaN`/`[object Object]` —se recorren las 20—, estructura de las tarjetas de módulos, píldoras del horario, barra de guardar de ajustes y paleta de acentos en claro y oscuro).
- Sin IDs duplicados, sin botones sin nombre accesible y sin colores hexadecimales en línea en ninguna de las 21 vistas (comprobado sobre el DOM real con jsdom).
- Sigue sin haber navegador headless en este entorno: la revisión es por código, DOM y comprobaciones automáticas, no por capturas.

---

## Ronda v61 · Exámenes, foco, calendario a prueba de cortes y chat de Ollama

Peticiones del usuario, una a una:

1. **El calendario del Horario «se ve cortado».** Se ha reescrito el marcado y el CSS del calendario escolar para que **no pueda** salirse de su tarjeta:
   - Las columnas son `repeat(7, minmax(0, 1fr))` (antes `1fr`, que puede crecer con el contenido).
   - Cada casilla es `width: min(100%, 46px)` con `aspect-ratio: 1/1` y `justify-items: center`: siempre cuadrada, nunca más ancha que su columna, y con tope de altura (antes podía estirarse).
   - Respaldo para navegadores sin `aspect-ratio` (`height: 40px`).
   - Se han compactado resumen, píldoras y leyenda (12 px de separación, cifras de 19 px) para que el mes entero quepa de una vez en pantallas normales.
   - El subtítulo ya no se recorta con puntos suspensivos (`curso hasta el 18 de junio`), y las píldoras de contexto pueden partirse en dos líneas en vez de empujar la tarjeta.
2. **Barra de abajo: fuera Apuntes, dentro Exámenes.** Los cinco huecos pasan a ser Inicio · Horario · Más · **Exámenes** · Notas. Apuntes se muda a la hoja «Más» (y sigue sin duplicarse: la regla de la v52 se mantiene).
3. **Los exámenes vuelven** (la v57 los había retirado): vista propia con cabecera de «próxima prueba» y cuenta atrás, tres cifras (por delante, con nota, media), filtros *Próximas / Pasadas / Todas*, lista de tarjetas con día, módulo, tipo, hora, aula y temario, formulario completo (módulo, título, tipo, fecha, hora, aula, temas, nota) y borrado con confirmación. Se sanean al cargar, se guardan en el estado, **se exportan al .ics** y aparece una tira en Inicio cuando hay algo cerca. Los deberes siguen fuera (eso no se ha tocado).
4. **Fuera el botón flotante «Salir de foco».** Ese botón se quedaba encima de la pantalla todo el rato, no solo en modo foco. Ahora la salida vive **dentro de la cabecera** y solo se ve cuando el modo foco está activo (la cabecera ya no se oculta en foco, si no no habría manera de salir desde el móvil).
5. **Chat de Ollama en «Más».** Acceso directo en la hoja, y la vista deja de mandarte a «Datos locales»: tiene su caja de conexión con dirección del servidor, modelo (con lista de los que tengas descargados en Ollama), guardar, probar conexión y volver al motor local, además de atajos de pregunta. Sigue sin haber nube: solo se habla con la dirección que escribas tú.

### Comprobaciones

- `npm test` → **263 comprobaciones ✓** (45 nuevas: exámenes de punta a punta, .ics con la prueba, foco sin botón flotante, chat con su configuración y atajos, y el calendario acotado).
- Se ha recorrido el DOM de las 23 vistas: ninguna clase pintada sin regla, ningún `undefined` en pantalla, sin errores de consola.
- Sigue sin haber navegador headless en este entorno: la revisión es por código, DOM y pruebas automáticas.

---

## Anexo B · Cómo reproducir los hallazgos críticos

```bash
# BUG-05 y BUG-06 ya no se pueden reproducir: el servidor se eliminó en la v51.
# Comprobación de que no queda superficie de red en la app:
grep -rn "fetch(" js/ | grep -v "11434"      # solo el Ollama que configures tú
grep -rni "servidor\|sync-" index.html js/*.js css/ | grep -v "servidor web\|servidor de correo\|servidor de nombres"

# BUG-02 y BUG-03: estado corrupto y examen sin fecha
#   DevTools → Application → localStorage → aula.smr.v4 = "{roto"  → recargar
#   DevTools → pegar en consola: Aula.state.exams.push({id:'x',title:'sin fecha'}); Aula.go('exams')

# BUG-04: kanban
#   Crear una tarea con fecha a 5 días → menú Más → Tablero → leer la fecha de la tarjeta
```

---

**Conclusión honesta:** la app tiene muchísimo producto dentro (28 vistas en el momento de la auditoría, 37 herramientas, 33 temas, XP, hábitos, sync, widgets Android) construido encima de una base frágil: un único fichero de 189 KB, sin validación de datos, sin tests y con un `save()` que miente. No hay que rehacerla: hay que **blindar la capa de datos** (Sprint 1) y **terminar de conectar lo que ya está programado** (Sprint 2). Con eso se pasa de "demo muy ambiciosa" a "app que puedes usar todo el curso sin miedo".
