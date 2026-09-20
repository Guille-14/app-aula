# Auditoría completa de Aula SMR

**Fecha:** 11 de septiembre de 2026
**Alcance:** todo el repositorio (`index.html`, `js/app.js`, `js/studio.js`, `js/tools.js`, `sw.js`, `server.py`, 7 hojas CSS, `manifest.webmanifest`, `apk-overlay/`, README).
**Commit auditado:** `e820a3a` (rama `arena/01a0902e-app-aula`, creada desde `main`).
**Ronda v58:** commits `6c70d71` y `de1c2a1` (auditoría línea a línea + arreglos, 182 pruebas ✓).
**Ronda v59:** rediseño de interfaz (una sola hoja `css/ui.css`, calendario escolar nuevo, 198 pruebas ✓).
**Ronda v60:** segunda pasada de pulido (calendario redondo, módulos en lista, acentos por tema, 216 pruebas ✓).
**Ronda v61:** exámenes con su pestaña, foco sin botón flotante, calendario acotado y chat de Ollama (263 pruebas ✓).
**Ronda v62:** revisión con navegador real: media y boletín arreglados, 20 rejillas acotadas y nada se sale de la tarjeta (275 pruebas ✓).
**Ronda v67.4.2:** «No funciona la IA de ollama»: el APK no podía salir por `http://` (contenido mixto y tráfico en claro), y cualquier fallo se contaba igual; ahora cada fallo se distingue y se explica cómo arreglarlo (493 pruebas ✓).
**Ronda v67.7.1:** «no funciona lo de cambiar el icono de la app» — el manifiesto declaraba 24 lanzadores (el de MainActivity, siempre el dragón, más los 23 alias), así que cambiar de icono no servía de nada; ahora el único lanzador es el alias que eliges (680 pruebas ✓).
**Ronda v67.8.0:** re-análisis completo aplicado: iconos comprimidos con pérdida imperceptible (−61 %/−69 %), los 33 skins por encima de 4,5:1 de contraste WCAG (antes 9 por debajo), los `blob:` huérfanos se revocan, el CSS muerto del viejo layout con barra lateral desaparece, la tipografía queda acotada a una escala de 14 tamaños (antes 33), el botón del temporizador sube a 44 px y `save()` deja de reescribir localStorage en cada navegación (693 pruebas ✓).
**Ronda v67.9.0:** pulido de la sección Herramientas: la calculadora IPv6 arranca con una IPv6 válida (antes una URL que fallaba), el conversor Bin/Dec/Hex recupera la opción Octal (la validación existía pero era inalcanzable), todas las calculadoras numéricas recalculan mientras escribes (antes solo Subnetting), las seis listas «toca para copiar» que no lo decían ahora lo avisan, el pin «Blanco/Verde» del T568 pasa de amarillo a verde pastel, y los ~250 botones de copiar y las pestañas de la chuleta ganan `aria-label`/`role="tablist"` (703 pruebas ✓).
**Ronda v67.10.0:** informe de rendimiento/UX (Gemini) adaptado a esta PWA vanilla sin backend: de lo aplicable, el skeleton de las fotos gana un pulso que se apaga con `prefers-reduced-motion` y el estado vacío de Apuntes ofrece la acción («Nueva nota») dentro del propio estado; el resto (virtualización React, code-splitting, Zustand/React Query, N+1, índices y paginación por cursor, Zod, carpetas por feature) no tiene equivalente porque no hay React ni servidor (706 pruebas ✓).
**Ronda v67.20.0:** «añade en Más una calculadora de faltas» y «cambia los 4 avatares nuevos» — la calculadora que vivía escondida en Herramientas → Utilidades estrena apartado propio en la hoja «Más» (vista `faltas`, con su título en la cabecera y su entrada en el buscador Ctrl+K), reutilizando el mismo motor y el mismo estado guardado: lo que tocas desde «Más» y desde «Herramientas» es la misma cuenta. Los avatares de Snivy, Cyndaquil, Froakie y Oshawott se sustituyen por ilustraciones nuevas del mismo concepto (estudiando con el portátil, 1254×1254 como los anteriores; los iconos del lanzador se regeneran solos en la próxima compilación del APK). De paso, dos fallos reales: 132 h al 20 % salía en pantalla como «26.400000000000002 h» (el límite ahora se redondea a un decimal), y los cuatro avatares de la v67.19 se quedaron fuera del precache del Service Worker, de modo que sin conexión el selector los mostraba rotos; ahora una comprobación avisa si cualquier avatar del paquete falta en el precache (769 pruebas ✓).
**Ronda v67.15.0:** los avisos ganaron su propio sonido: una campanita suave de dos notas (`smsr_ding.wav`, sintetizada a 22 kHz y metida en `res/raw` por el overlay) en lugar del timbre genérico de Android. Como el sonido de un canal ya creado no se puede cambiar (regla de Android), la primera vez que corre esta versión se borra y se recrea el canal (migración de una sola vez con marca en localStorage): los que ya tenían la app la ganan sin reinstalar. De paso se arregló un fallo real: `probar()` y el bloque de estudio no creaban el canal, así que en una instalación nueva el aviso de prueba se perdía en silencio (sin canal, Android 8+ descarta la notificación); ahora `probar()`, `programarBloque()` y `sincronizar()` comparten el helper `canal()`. El comprobador del APK vigila que `smsr_ding` va dentro (757 pruebas ✓).
**Ronda v67.14.0:** «el icono se ve con zoom y las notificaciones son feas y sosas» — (1) el icono del lanzador usaba el arte a sangre como capa de fondo del icono adaptativo y el launcher enmascara a 108 dp dejando solo visibles los 66 dp centrales: el icono salía recortado y «con zoom»; ahora `apply.py` genera las capas de verdad por icono (fondo difuminado + arte al 62 % centrado, que cabe en la zona segura ni siquiera con máscara circular) y la comprobación del APK vigila que las capas y el icono de notificación van dentro. (2) los avisos usaban el icono genérico del sistema (sin icono propio el plugin cae a `ic_dialog_info`), sin acento de color y con el texto truncado: ahora cada aviso lleva la silueta blanca del dragón (`ic_noti`), el dragón a color como icono grande (`ic_noti_l`), el acento naranja de la marca (`#DA7419`), texto completo expandible (`largeBody`) y el módulo en el título de las clases («IPE en 10 min»); los valores por defecto también van en `capacitor.config.json` (756 pruebas ✓).
**Ronda v67.13.0:** «las notificaciones no funcionan» — los avisos programados tenían dos fallos graves: se programaban con `allowWhileIdle: false` (Android no despierta el móvil del reposo y podía guardarlos «para luego») y, en móviles Android 12+, las alarmas exactas van bloqueadas por defecto (y el APK no las pedía), de modo que el plugin de Capacitor caía a alarmas imprecisas que el teléfono puede retrasar horas o no disparar; ahora todo se programa para sonar con el móvil en reposo, el manifiesto pide `SCHEDULE_EXACT_ALARM` y `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`, y Ajustes comprueba los tres estados (permiso de notificaciones, alarmas exactas y batería) con botones que abren la pantalla de Android que toca; al conceder las alarmas exactas, se repasa el plan para que lo ya programado suene a la hora (748 pruebas ✓).
**Ronda v67.12.1:** el jueves del horario oficial ponía 3 horas de Sistemas operativos en red y el documento del centro son 2 (a las 17:00 entra Aplicaciones web, y Servicios en red también a las 20:05); `PLAN_VERSION` sube para que se recoloque solo (730 pruebas ✓).
**Ronda v67.12.0:** la optativa pasa a llamarse Programación; Programación y SOR nacen con esquema «media de los temas + aprobarlos todos» (regla nueva «todos» en el motor de notas, activa también en los esquemas ya montados y por defecto en los nuevos); sus clases acaban el 27/02/2027 y el calendario lo respeta (729 pruebas ✓).
**Ronda v67.11.3:** el botón «volver» seguía como barra del 100 %: `#view` es un flex en columna y lo estiraba (`align-items: stretch`), y además conservaba el aspecto nativo del navegador. Ahora lleva `align-self: flex-start`, `appearance: none` y el mismo lenguaje visual de los chips (719 pruebas ✓).
**Ronda v67.11.1:** «Volver» de las herramientas salía gigante (el SVG sin acotar, 300×150) y los rótulos del radar de Calificaciones metían artículos/preposiciones en el recorte; ahora el icono va a 16 px y el rótulo omite palabras vacías (717 pruebas ✓).
**Ronda v67.11.0:** segunda pasada de Herramientas: los resultados de las calculadoras se tocan para copiar, Subnetting dibuja los 32 bits con red/host en dos colores, el T568 estrena conector RJ45 en SVG, la chuleta gana un buscador por descripción con debounce, se añade la referencia de pitidos BIOS (AMI/Award/Phoenix) y las funciones de cálculo quedan expuestas y probadas como puras (715 pruebas ✓).
**Ronda v67.7:** el contraste del modo oscuro se mide y se sube (las tarjetas ya no se funden con el negro de la OLED), los campos del esquema tienen forma de caja, la vibración la hace el motor háptico de Android, las entregas de la Agenda se deslizan con el dedo y el simulador «¿qué nota necesito?» dice lo que hace falta sacar en lo que queda —o que ya no llegas, con el máximo real— (665 pruebas ✓).
**Ronda v67.6:** la Agenda se organiza como la del instituto —cada módulo con sus exámenes y entregas—, los exámenes van de una hora a otra y las entregas tienen plazo (se abre → se cierra) y estado (pendiente · entregado · corregido), que se cambia desde la propia fila (582 pruebas ✓).
**Ronda v67.5:** la nota de cada módulo se calcula como la calcula tu profe — componentes con peso, notas «sobre X» y reglas que pueden suspender (aprobar todos los RA) — y Exámenes pasa a ser una Agenda con trabajos y entregas que llenan el componente solos (548 pruebas ✓).
**Ronda v67.4 (y v67.4.1):** la auditoría de interfaz del usuario: la barra de abajo vuelve y no se queda escondida, el calendario, la semana, los exámenes y las notas dejan de mentir (476 pruebas ✓).
**Ronda v67.3:** el horario del centro cuadro a cuadro (31 clases, Sistemas 7 h y el jueves sin última hora) (440 pruebas ✓).
**Ronda v67.2:** el horario del centro definitivo (15:10–22:15), sin «huecos libres» inventados, la foto de perfil que no cambiaba y los botones de Ajustes flotando (437 pruebas ✓).
**Ronda v67.1:** la hoja «Más» vuelve a verse pequeña, como antes del rediseño (401 pruebas ✓).
**Ronda v67:** el bloque de estudio avisa con la app cerrada, «Compartir horario» en texto y recordatorio de copia de seguridad (394 pruebas ✓).
**Ronda v66:** «Compartir» un apunte con sus fotos desde el propio apunte, y el comprobador del APK vigila también el FileProvider del que depende (365 pruebas ✓).
**Ronda v65:** los botones de exportar (copia JSON, calendario, Markdown y Anki) funcionan dentro del APK con la hoja de compartir de Android — antes no hacían nada—, el .ics lleva avisos para el calendario del móvil y el comprobador del APK vigila los plugins (356 pruebas ✓).
**Ronda v64:** los avisos se pueden tocar (abren su pantalla), se puede probar que suenan, se explica el permiso de Android y la app avisa cuando hay versión nueva (336 pruebas ✓).
**Ronda v63:** cache-first de verdad en el Service Worker, minificado antes de publicar (y dentro del APK), avisos programados en Android, CSS sin duplicados y pantalla ancha (326 pruebas ✓).
**Ronda v62-b:** los diálogos salían desplazados media pantalla por la herencia de `styles.css`; ahora son hojas con tirador, scroll y botones alcanzables (281 pruebas ✓).
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

## Ronda v62 · Revisión con navegador de verdad: anchuras, media y boletín

Hasta ahora la interfaz solo se podía revisar leyendo el código y con jsdom (que no calcula
tamaños). Esta ronda se ha montado un **navegador headless real** (Chromium por npm, con sus
bibliotecas) y se han sacado capturas y medidas de las 22 vistas con datos de verdad
(6 módulos, 16 fichas, 34 sesiones, 5 pruebas). Eso ha destapado fallos que no se ven en el código.

### Lo que estaba mal y ya está arreglado

1. **Nota media mal calculada** (el más gordo). `weightedGPA()` hacía `Number(subject.grade)`:
   un módulo *sin nota* es `""`, y `Number("") === 0`. Resultado: los módulos sin nota contaban
   como un cero y la media se hundía (con 4 módulos de los que 2 no tienen nota, salía **4,1**
   en vez de **7,0**). Ahora solo entran los que tienen nota, ya acotada al máximo configurado.
2. **El boletín de Gráficos salía todo en «—»**. Buscaba las notas por `subjectId`, pero
   `graded` es una lista de **módulos**: la clave es `id`. Nunca coincidía.
3. **Veinte rejillas con `1fr` a pelo** (`1fr 1fr`, `repeat(7, 1fr)`…). `1fr` es
   `minmax(auto, 1fr)`: si el contenido no cabe, la columna **crece** y la fila se sale de la
   tarjeta. En un móvil de 360 px se salían las tarjetas de Estadísticas, Repaso, Fichas,
   Ajustes, Herramientas, Logros… Todas usan ya `minmax(0, 1fr)`.
4. **Filtros de módulos en una sola línea con scroll lateral**: un nombre largo
   («Proyecto intermodular Sistemas microinformáticos y redes») dejaba el filtro cortado a
   media pantalla. Ahora envuelven en varias líneas.
5. **Glosario**: la etiqueta del módulo era una columna a la derecha que se quedaba con el
   ancho y dejaba la definición en un hilo de 55 px (y de 20 px en pantallas pequeñas…).
   Pasa a ir debajo, dentro del texto, y los términos ya se leen.
6. **Mazo de fichas**: «Editar» y «×» se comían media fila. «Editar» es ahora un lápiz
   compacto y el texto de la ficha manda.
7. **Chips largos** (una fecha en palabras, un aviso del calendario) se salían de la tarjeta
   en las cabeceras: ahora se parten en dos líneas dentro de su píldora.
8. **Formularios**: en móvil estrecho un `input` con su hueco mínimo empujaba la columna de
   al lado fuera de la tarjeta (Ajustes). Los campos y controles pueden encogerse (`min-width: 0`).
9. **Tarjetas de texto a media anchura**: en pantallas ≤ 460 px, las tarjetas con texto y
   cifras (Estadísticas, Fichas, Repaso) pasan a una sola columna; las de cifras siguen a dos.

### Comprobaciones

- `npm test` → **275 comprobaciones ✓** (12 nuevas: la media sin los módulos vacíos, el
  boletín de Gráficos, ninguna rejilla con `1fr` a pelo, los filtros que envuelven, los chips
  que se parten, las filas que encogen y las tarjetas que se apilan).
- Recorridas las 22 vistas en Chromium a 360 × 780: **sin errores de consola, sin `undefined`
  ni `NaN` en pantalla y sin desbordes**, y probados a mano la hoja «Más», el alta de una
  prueba, el calendario del centro, el tema claro, el modo concentración y el tamaño de texto
  grande.
- Quedan tres avisos de 2 px por un `box-shadow` de un icono (no desplazan nada): no se tocan.

---

## Ronda v62-b · Los diálogos aparecían desplazados media pantalla (fallo crítico)

Siguiendo con la revisión en navegador real, se probaron los **seis formularios de uso diario**
(nueva prueba, nueva nota, nueva ficha, nuevo módulo, nuevo hábito, perfil) y apareció el peor
fallo de los últimos tiempos:

> Al abrir cualquier diálogo, la hoja **salía descuadrada**: el título a la izquierda en una
> columna y el formulario a la derecha, todo amontonado y cortado por el borde de la pantalla.
> Los campos se salían por la izquierda (x = −128 px en un móvil de 360) y no había manera de
> rellenarlos con comodidad.

**Causa.** Dos fallos sumados:

1. `openModal()` generaba `<div class="modal">` con el `<h2>` y el `<form>` como hijos directos.
   `.modal` es un contenedor flex (caja completa, alineado abajo): sin la hoja `.modal-card` que
   lleva el tirador, el fondo, las esquinas y el scroll, los dos hijos se ponían **uno al lado
   del otro**.
2. `.modal-card` existía en `css/ui.css` desde el primer commit, pero **no se usaba en ningún
   sitio**: nadie la había puesto en el HTML.

Y por debajo, un tercer problema peor: `css/styles.css` (la hoja antigua, todavía cargada)
define `.modal` como una caja centrada con `position: fixed; left: 50%; top: 50%;
transform: translate(-50%, -50%); width: min(560px, calc(100vw - 24px))`. Como `ui.css` no lo
reseteaba, la hoja nueva heredaba ese **desplazamiento de media caja** (x = −168 px) y salía
fuera de pantalla por la izquierda.

**Arreglo.**

- El contenido del diálogo va dentro de `.modal-card` (tirador, fondo, esquinas, scroll propio
  al 90 % de alto y animación de subida desde abajo).
- `.modal` resetea explícitamente lo que le llega de `styles.css`: `position: absolute; inset: 0;
  transform: none; width: auto; max-height: none; overflow: visible`.
- Comprobado en Chromium: los seis diálogos salen pegados abajo, centrados, con scroll y con los
  botones alcanzables; guardado, edición y borrado de una prueba de punta a punta sin errores
  de consola, y el dato llega al almacenamiento y sobrevive a una recarga.

**Nota de mantenimiento.** Las hojas antiguas (`styles.css`, `skins.css`, `themes.css`) siguen
cargándose antes que `ui.css` y definen clases genéricas (`.sidebar`, `.topbar-title`,
`.brand-mark`, `.modal`…). Se ha hecho un repaso automático de todas ellas: las únicas clases
que el HTML usa de verdad y que llegaban con posicionamiento heredado eran `.modal` (arreglada)
y las demás no aparecen en el marcado actual. Si se retoman algún día esas hojas, conviene
borrarlas en vez de seguir resetando.

---

## Ronda v62-b (bis) · El control del APK tumbó la entrega por la versión con puntos

Al publicar la v62.1, el flujo del APK **falló en el paso de comprobación** (el APK se compiló
bien, pero no se publicó la Release): el comprobador buscaba `APP_VERSION = "v<dígitos>"` y la
versión era `"v62.1"`, con punto. Resultado: «FALLO versión de la web dentro del APK».

**Arreglo.** El comprobador acepta ahora versiones con puntos (`v[\d.]+`) y, además, **contrasta
la versión de la web con la del `package.json`** (de la que sale la etiqueta de la Release): si
la web dice `v61` y el paquete es 62, avisa con el detalle en vez de dar el visto bueno. Se
publican también `app_esperada` y `paquete` en `.datos-apk` para poder verlo en el resumen.

**Y una prueba más** (`npm test`): la versión de `js/app.js` tiene que coincidir con la del
`package.json`, y la caché del service worker tiene que llevar ese número. Es justo el fallo que
acaba de tumbar la entrega, así que a partir de ahora se avisa antes de compilar el APK.

---

---

---

---

## Ronda v67.12.1 · El jueves del horario, como el documento del centro

El plan oficial tenía el jueves `sor, sor, sor, web, web, ser`: tres horas seguidas de Sistemas
operativos en red. En el documento del centro el bloque azul de SOR es de 15:10 a 17:00 (dos
horas), a las 17:00 entra Aplicaciones web y por la tarde hay Servicios en red a las 19:10 **y** a
las 20:05. Nuevo plan: `sor, sor, web, web, ser, ser`. `PLAN_VERSION` 3 → 4 para que
`actualizarHorarioOficial` recoloque el horario ya guardado sin tocar asistencias ni avisos.

**Pruebas: 729 → 730 ✓**, y las mismas pasan sobre el minificado.

## Ronda v67.12.0 · Asignaturas: Programación, media de temas y fin de clases el 27 de febrero

1. **Optativa → Programación.** La plantilla oficial y los datos guardados («Módulo optativo»)
   pasan a llamarse Programación; sinónimos e intérprete de frases incluidos.
2. **Media de temas con todos aprobados.** Nueva regla de esquema `reglas.todos`: un componente
   (tema) por debajo de la mitad suspende el módulo aunque la media dé. El simulador trata la
   mitad de cada tema como suelo. Programación y SOR reciben esquema sembrado (marcador
   «Tema 1», igual peso: la ponderada es la media) vía `ESQUEMAS_CONOCIDOS`; el 60 % trabajos /
   40 % exámenes lo aplica él al notar cada tema, como acordamos.
3. **Clases hasta el 27/02/2027.** Migración de una vez (`fin-clases-feb-v1`) fija su
   `settings.endDate`; `dayInfo` y la tira semanal usan el rango efectivo (el suyo), no solo el
   calendario oficial. Después: prácticas, con horario pendiente de que lo pase él.

Además se arreglaron tres pruebas que se pudrían con el calendario (fecha fija del bloque de
avisos, semana «fuera» solo antes de empezar el curso y el nombre nuevo de la optativa).

**Pruebas: 719 → 729 ✓**, y las mismas pasan sobre el minificado.

## Ronda v67.11.3 · «Volver» como chip compacto

El contenedor `#view` (`.hub-scroll`) es `display:flex; flex-direction:column`, así que todo hijo
se estira al ancho completo por defecto; el `inline-flex` de la v67.11.0 no ganaba a eso. La
v67.11.2 acotó el icono pero la barra seguía al 100 % y con el borde/fondo nativo del navegador.
Ahora `.tool-back` lleva `align-self: flex-start`, `appearance: none` y estética de chip
(`border-radius: 999px`, fondo `--surface-2`), coherente con el resto de la app.

**Pruebas: 718 → 719 ✓**, y las mismas pasan sobre el minificado.

## Ronda v67.11.1 · Dos regresiones de la sección Herramientas/Calificaciones

1. **Botón «Volver» gigante.** El `<svg>` de `wrap()` no lleva `width/height` y ninguna regla CSS lo
   acotaba, así que el navegador lo pintaba a 300×150 y tapaba cada herramienta. Añadida
   `.tool-back svg { width:16px; height:16px; flex:0 0 auto }`.
2. **Rótulos del radar ilegibles.** El acortador cogía 3 letras de *cada* palabra, incluidas «de»,
   «la», «para», «II», que se comían el recorte de 5-6 caracteres. Ahora filtra artículos,
   preposiciones, conjunciones y numerales antes de recortar («Sistemas de gestión de redes» →
   SISGE, no SISDE).

**Pruebas: 715 → 717 ✓**, y las mismas pasan sobre el minificado.

## Ronda v67.11.0 · Herramientas, 2.ª pasada

Nuevo informe (de nuevo con sabor React/TS) aplicado en vanilla sobre `js/tools.js`. Lo que pedía y
ya existía: navegación por tarjetas de acceso rápido (el hub ya las tiene), estética de consola en la
chuleta (`<code>`), clasificación RFC1918/APIPA/multicast (la herramienta «Clases y rangos» y el campo
«Clase» de Subnetting) y la calculadora GB↔GiB («GB vs GiB»). Lo nuevo:

1. **Resultados copiables.** `kv()` pinta cada fila como botón `data-action="copy-text"` con
   `aria-label`; tocar Máscara/Red/Broadcast/etc. lo copia con el toast de feedback.
2. **Visualizador de bits.** Subnetting añade una tira de 32 celdas (red en azul, host en verde) con
   leyenda y `aria-label`, para ver el «préstamo de bits».
3. **RJ45 en SVG.** El T568 dibuja los dos conectores (A y B) con sus 8 pines coloreados, además de la
   lista.
4. **Buscador de la chuleta.** Campo «Buscar por comando o descripción» que filtra Linux/Cisco/
   PowerShell con debounce (160 ms), igual que los buscadores de puertos/códigos/acrónimos, que
   también pasan a debounce.
5. **Beeps BIOS.** Nueva herramienta con pestañas AMI / Award / Phoenix y el significado de cada
   secuencia de pitidos.
6. **Funciones puras probadas.** `window.AulaTools.calc` expone `calcSubnet/parseIp/intToIp/expandV6/
   compressV6`; las pruebas verifican /24, /27 y /30 y que octeto >255 o CIDR >32 se rechazan sin
   lanzar.

**Pruebas: 706 → 715 ✓** (`testTools2()`), y las mismas pasan sobre el minificado del APK.

## Ronda v67.10.0 · Informe de rendimiento/UX adaptado (sin React, sin backend)

El informe externo asume una app de **profesor** con React + base de datos (alumnos, asistencia,
tablas de notas). Este repo es una PWA **vanilla de alumno, sin servidor**: los datos viven en el
dispositivo (localStorage + IndexedDB) y no hay React, ORM ni API. Por eso la mayoría de puntos no
tienen equivalente; los que sí, ya estaban o se cierran aquí. Verificado contra el código actual.

**No aplica (no existe el stack):** virtualización con `@tanstack/react-virtual`, `React.lazy`,
`Zustand`/`React.memo`, `TanStack Query`/SWR, N+1 del ORM, índices SQL, paginación por cursor, Zod,
carpetas por feature en TypeScript. No hay componentes React ni consultas a servidor que optimizar.

**Ya cubierto (equivalente vanilla):**
- *Code splitting:* `js/tools.js` se carga bajo demanda (`cargarTools()`), no al arrancar.
- *Validación en runtime:* `sanitize()` valida y repara el estado al cargar (el «Zod» de la casa).
- *Guardado optimista/instantáneo:* todo es local; `save()` difiere 400 ms y desde la v67.8 solo
  escribe si algo cambió.
- *Skeletons y CLS:* `.note-img.is-loading` reserva `min-height` (sin saltos de layout).
- *Estados vacíos con CTA:* Mazo, módulos, agenda y herramientas ya traen botón de acción.
- *No depender solo del color:* los chips de estado llevan texto («Entregado») y `aria-label`.
- *Rendimiento de listas:* medido en rondas anteriores — la Agenda escala lineal (~736 ms con 800
  elementos en jsdom, menos en navegador real); no justifica virtualizar a este volumen.

**Se añade ahora:**
1. *Skeleton con pulso:* `@keyframes skeleton-pulse` anima las fotos que cargan, y se apaga con
   `prefers-reduced-motion`.
2. *Estado vacío educativo en Apuntes:* sin notas, el propio estado ofrece «Nueva nota» (antes solo
   el botón de la cabecera).

**Pruebas: 703 → 706 ✓** (`testGemini()`), y las mismas pasan sobre el minificado del APK.

## Ronda v67.9.0 · Pulido de Herramientas

Informe de la sección `js/tools.js` aplicado y verificado contra el código actual.

1. **IPv6 por defecto.** El campo arrancaba con `https://example.com/user/golf`, que al pulsar
   «Normalizar» daba «IPv6 no válida». Ahora arranca con `2001:db8:85a3::8a2e:370:7334`, que
   expande, comprime y cuenta grupos bien (comprobado en jsdom sin tocar nada).
2. **Octal alcanzable.** La validación de base 8 y su comentario ya existían, pero el `<select>`
   solo ofrecía Decimal/Binario/Hex. Se añade `<option value="8">Octal</option>`; «19» avisa de que
   el 9 no existe en base 8 y «17» → 15 decimal.
3. **Recálculo en vivo.** Subnetting era la única que respondía al teclear. Ahora un mapa
   campo→acción en el listener de `input` reutiliza el manejador de cada botón (vlsm, ipbin,
   ranges, wildcard, ipv6, mac, dhcp, chmod-octal, raid, units, backup, conv, hash); con el campo
   vacío se limpia la salida.
4. **Aviso «toca para copiar».** `sheet` ya lo tenía; se añade a `ports`, `http`, `acro`, `dns`,
   `systemd` y `ascii`, que usan el mismo patrón de filas-botón.
5. **T568 Blanco/Verde.** `#f5ee54` (amarillo) → `#dcfce7` (verde pastel, en la familia de los otros
   tres «Blanco/X»), en T568A y T568B.
6. **Accesibilidad.** Los botones `data-action="copy-text"` llevan `aria-label="Copiar …"`, y el
   grupo Linux/Cisco/PowerShell de la chuleta pasa a `role="tablist"` con `role="tab"` y
   `aria-selected` en cada pestaña.

**Pruebas: 693 → 703 ✓** (10 nuevas en `testTools()`), y las mismas pasan sobre el minificado.

## Ronda v67.8.0 · Re-análisis completo (7 mejoras)

Se aplica íntegro el re-análisis externo (hecho sobre la v67.6 de la rama `01a0902`), pero
**re-verificado contra el código actual**, no a ciegas: varias de sus cifras habían cambiado con
la v67.7 (p. ej. el informe citaba 5 skins con contraste bajo y en realidad eran 9; se le escaparon
`oled` 2,14:1, `coral`, `lima` y `pergamino`).

1. **Iconos comprimidos.** `icon-512.png` 273→87 KB (−69 %) y `icon-192.png` 44→17 KB (−61 %),
   cuantizando a 256 colores con Floyd–Steinberg. Se comprobó *mirando* un lado-a-lado y un panel
   de diferencias ×6: imperceptible. Es el mismo orden de magnitud que medía el informe con
   `pngquant`, que aquí no está instalado.
2. **Contraste WCAG de los 33 skins.** El botón primario y el texto quedan ≥4,5:1 en todos. Regla:
   si el acento es saturado y oscuro se mantiene la tinta blanca y se oscurece el acento dentro de
   su tono (`redes`, `cyberpunk`, `lima`, `coral`, `pergamino`, `redteam`); si el acento es claro y
   es la gracia del skin se conserva y se le pone tinta oscura del mismo tono (`kawaii`, `oled`);
   `win95` aclara su teal de `#008080` a `#008a8a` (oscurecerlo empeoraba el contraste con negro).
3. **Blobs huérfanos.** `media.del()` ahora revoca el object URL de la foto borrada (antes solo
   `clear()` lo hacía) y `setLinkIcon()` revoca el favicon/icono anterior cuando era `blob:`.
4. **CSS muerto fuera.** Se retira el layout antiguo `.app` / `.sidebar` / `.nav-item` (incluidos los
   restos dentro de `@media`), y las variables que solo él leía (`--sidebar`, `--sidebar-fg` en los
   33 skins). Se conservan `--nav-*` porque el `.hub-nav` vivo las usa. El JS ya no consulta
   `.nav-item`.
5. **Escala tipográfica.** Los 33 `font-size` distintos quedan en 14 (10–48 px); los medios píxeles
   se redondean al paso más cercano y `.sheet-txt` sigue en 12 px para no romper su prueba.
6. **Objetivo táctil.** `.timer-bar .btn-sm` (el botón «Pausa») sube de 32 a 44 px.
7. **`save()` perezoso.** Compara el JSON con el último guardado correcto y, si no cambió nada, no
   reescribe localStorage ni re-empuja los widgets en cada navegación. La prueba de cuota se ajustó
   para mutar el estado antes de forzar el error (es el caso real que debe avisar).

También se limpian los restos que marcaba eslint (`plProx`, `probarOllama`, un `catch (e)` sin usar).

**Pruebas: 680 → 693 ✓** (13 nuevas: peso de iconos, contraste de los 33 skins, CSS muerto,
escala tipográfica, objetivo táctil, revocación de blobs y guardado perezoso), y las mismas pasan
sobre el código minificado del APK.

## Ronda v67.7.1 · «No funciona lo de cambiar el icono de la app»

Tenías razón, y no era un problema del móvil: era un fallo del manifiesto de Android que hacía
que **cambiar el icono no pudiera funcionar nunca**, por más que la app dijera que sí.

### El fallo

Android enseña en el escritorio un icono por cada componente que declare un `intent-filter`
con `MAIN` + `LAUNCHER`. El cambio de icono se hace con *activity-alias*: 23 alias
(`IcoDragon`, `IcoMewtwo`, …) apuntando todos a `MainActivity`, cada uno con su icono, y
`IconSwitch` (Java) enciende el que eliges y apaga los demás.

El problema es que **la plantilla de Capacitor trae `MainActivity` con SU PROPIO filtro de
lanzador**, y `apply.py` añadía los 23 alias encima sin quitárselo. El manifiesto final
declaraba **24 lanzadores**:

```
ANTES  (v67.7.0)  lanzadores totales: 24  (1 de MainActivity + 23 alias)   MainActivity con lanzador: True
DESPUÉS (v67.7.1) lanzadores totales: 23  (0 de MainActivity + 23 alias)   MainActivity con lanzador: False
```

`IconSwitch` solo enciende y apaga alias; **nunca toca `MainActivity`**. Y el icono de
`MainActivity` es `@mipmap/ic_launcher`, que `write_icons()` reescribe con el dragón. Así que el
escritorio enseñaba el dragón de `MainActivity` para siempre: tocabas Mewtwo, el alias se
activaba, el plugin respondía `{ok: true}`, la app decía «Icono del escritorio cambiado»… y el
escritorio no se movía. En algunos lanzadores además aparecía un segundo icono.

### El arreglo

`apk-overlay/manifest.py` (módulo nuevo) hace las dos cosas juntas: pone los 23 alias **y** le
quita a `MainActivity` su `intent-filter` de lanzador, dejando la actividad intacta y
`exported`. El único lanzador pasa a ser el alias activo, que es justo lo que `IconSwitch`
controla.

No se rompe nada más: los widgets abren la app con un Intent **explícito**
(`new Intent(ctx, MainActivity.class)` en `WidgetStore.openApp`), que no depende del filtro de
lanzador. Y es idempotente: `apply.py` se ejecuta en cada compilación y no duplica los alias.

### Por qué esto no se había visto, y cómo se prueba ahora

`apply.py` necesita Pillow y un proyecto Android entero, así que el runner de `Pruebas` (que
solo hace `npm install && npm test`) nunca lo ejecutaba. Por eso la lógica del manifiesto se ha
sacado a un módulo **sin dependencias** y hay una prueba que:

1. extrae la plantilla real de Capacitor (`node_modules/@capacitor/cli/assets/android-template.tar.gz`),
   que es la entrada exacta que recibe el build, y confirma que trae `MainActivity` con su filtro;
2. la pasa por `preparar_manifest()` de verdad y comprueba **23 lanzadores, ninguno en
   `MainActivity`**, que `MainActivity` sigue declarada y `exported`, que el único alias activo
   de salida es `IcoDragon`, y que pasarla dos veces no duplica nada;
3. compara las **tres listas de iconos** —`manifest.ICONS` (Python), `IconSwitch.IDS` (Java) y
   `AVATAR_PACK` + dragón (JS)— porque si se desincronizan el alias no existe y Android se
   traga el `setComponentEnabledSetting` **sin decir nada**; y que cada criatura tiene su imagen
   en `assets/avatars`.

Verificado con mutaciones: si `preparar_manifest` deja de quitar el filtro, la prueba falla
diciendo «leído: 24»; si se quita una criatura de la lista, fallan la cuenta de alias y la
comparación con el Java.

**Para que lo veas:** instala la v67.7.1 encima. Si el escritorio se queda con el icono viejo,
mantén pulsado el icono → *Desinstalar* y vuelve a abrir el APK: al cambiar el manifiesto,
algunos lanzadores no refrescan el acceso directo hasta que se reinstala.

**Pruebas: 665 → 680 ✓** (15 nuevas), y las mismas pasan sobre el código minificado del APK.

---

## Ronda v67.7 · Contraste en oscuro, vibración de verdad, deslizar entregas y «¿qué nota necesito?»

Cinco cosas que se notan en la mano: lo que antes se fundía con el fondo ahora se recorta, el
esquema se puede escribir sin adivinar dónde, la app vibra como vibran las apps, la Agenda se
maneja con el dedo y la pregunta de siempre («¿cuánto necesito sacar?») la responde la app.

### 1. El contraste en modo oscuro

El problema no era de gusto, era de medida. En una pantalla OLED el negro del fondo está
**apagado de verdad**, y con la tarjeta en `#101012` y los bordes al **7,5 %** de blanco, las
tarjetas se fundían con el fondo: no se veía dónde acababa una lista y empezaba la siguiente.

Dentro de `html[data-theme="dark"]` (y solo ahí; el tema claro no se ha tocado):

| token | antes | ahora |
|---|---|---|
| `--line` | `rgba(255,255,255,.075)` | `rgba(255,255,255,.12)` |
| `--line-2` | `rgba(255,255,255,.16)` | `rgba(255,255,255,.2)` |
| `--card-bd` | `rgba(255,255,255,.075)` | `rgba(255,255,255,.10)` |
| `--card-in` | `inset 0 1px 0 rgba(255,255,255,.04)` | `inset 0 1px 0 rgba(255,255,255,.055)` |
| `--surface` | `#101012` | `#131317` |
| `--surface-2` / `--chip` | `#17171a` | `#1b1b20` |

El fondo sigue siendo **negro puro** (OLED): lo que sube es la tarjeta, no el fondo. Medido con la
luminancia relativa de la WCAG, la tarjeta pasa de un contraste de **1,1049** a **1,1332** contra el
negro, y la superficie de segundo nivel de **1,1739** a **1,2242**. Las pruebas leen esos números del
CSS, no el texto: el minificador quita las comillas del selector y reescribe los colores, así que
cualquier comparación de cadena pasaría en casa y se caería dentro del APK.

### 2. Los campos del esquema, con forma de caja

El nombre de cada componente era **una raya de puntos debajo del texto**: no parecía un campo y la
gente tocaba sin saber que ahí se escribía. Ahora `.eval-row-top input` tiene fondo
(`--surface-2`), borde de 1 px, esquinas de 10 px y relleno de 9×12 px, con **40 px de alto**
mínimo (se puede pulsar con el dedo). Al enfocarlo se ilumina **la caja entera**, no solo la raya.

### 3. Vibración nativa (haptics)

`@capacitor/haptics@6` entra en el APK y la vibración la hace el **motor háptico de Android** (un
golpe seco), no el zumbido del navegador. Fuera del APK cae a `navigator.vibrate` sin romper nada, y
si no hay ninguno de los dos, no pasa nada: la vibración nunca puede romper la acción que la provoca.
El interruptor de Ajustes manda siempre.

Un helper, `vibrar(tipo)`, con tres intensidades para que cada gesto se note distinto sin mirar:

* **ligero** (`LIGHT`) al cambiar de pestaña en la barra de abajo,
* **medio** (`MEDIUM`) al marcar una entrega como entregada,
* **fuerte** (`HEAVY`) al terminar un bloque de estudio (lo que ya hacía `buzz()`).

El comprobador del APK (`apk-overlay/comprobar-apk.py`) vigila ahora el plugin `HapticsPlugin` **y**
el permiso `VIBRATE`: sin el permiso el plugin está dentro pero no vibra, y es un fallo que no se ve.

### 4. Deslizar las filas de la Agenda

Como en el correo del móvil: arrastras la fila y debajo aparece, ya escrito, lo que va a pasar.

* **a la derecha** → la entrega pasa a **Entregado**, con una franja verde y su ✓ que se descorre
  debajo de la fila;
* **a la izquierda** → se abre la prueba para **editarla**, con franja azul y ✎.

Tres detalles que son los que hacen que se sienta bien y no un estorbo:

1. **Solo cuentan los gestos claramente horizontales** (`|dx| ≥ 10` y `|dx| ≥ 1,4·|dy|`). Si el dedo
   va hacia abajo, es scroll y se deja correr la página.
2. **Después de deslizar, el clic siguiente no cuenta.** Al levantar el dedo el navegador suelta un
   clic sobre la fila, y sin eso la ficha se abría justo cuando querías marcarla como entregada. Se
   traga en la fase de captura durante 800 ms.
3. La franja **se va viendo según lo que arrastras** y al pasar el umbral se queda fija: se ve
   cuándo el gesto ya vale. Umbral **72 px**, tope **108 px**.

A la derecha solo se puede deslizar una **entrega pendiente** (un examen no se entrega). El consejo
(«Desliza una entrega a la derecha…») sale **una sola vez** y se apunta en
`state.progress.flags.swipeUsado`.

### 5. El simulador «¿qué nota necesito?»

La pregunta de la víspera del examen, respondida con **todos** los componentes que tienen peso,
también los que aún no tienen nota — que es justo lo que la media de «lo que llevas» no hace,
porque esa responde a otra pregunta:

```
necesaria = (objetivo · Σpesos − Σ(peso · nota)) / Σpesos de lo pendiente
```

Todo en la escala del módulo, así que un componente «sobre 4» se convierte antes de entrar. Devuelve
también `actual`, `maxFinal`, `posible`, `yaEsta`, `pendientes` y `minimoPendiente`.

La hoja tiene tres bloques —**Aprobado 5**, **Notable 7**, **Sobresaliente 9**— y cada uno dice lo
que toca: «**5,50** en «Examen de teoría»», «**Ya lo tienes** (aunque saques un 0 en lo que queda)» o
«**Ni con un 10** — lo máximo que puedes acabar es 6,80». Esa última es la mitad útil de la
respuesta: cuando ya no llegas, decir «necesitas un 10,50» no sirve de nada. Además avisa si algún
componente pide un mínimo y si hay RA sin aprobar, que suspenden aunque la media dé.

Caso de control (y prueba): con **6 en prácticas (20 %)**, **4 en el práctico (40 %)** y la **teoría
(40 %) sin nota**, para el 5 pide **5,50 exactos** y para el 7 avisa de que el máximo es **6,80**.
Botón `data-action="eval-simular"` en **Calificaciones** y en la **ficha del módulo**, junto a
«Meter notas».

### 6. Dos fallos que salieron al comprobarlo de verdad

* **Un `//` dentro del CSS.** `//` no es un comentario en CSS: el navegador descarta todo lo que
  viene detrás hasta recuperarse, y se habría llevado por delante la hoja entera del deslizamiento
  **dentro del APK**, que es donde menos se ve. Ahora es un comentario `/* … */` en su propia línea.
* **`tools/probar-minificado.mjs` no copiaba `.github`.** Las pruebas que leen el flujo de la release
  reventaban con un `ENOENT` sobre la copia minificada. Se copia, igual que ya se copiaba
  `apk-overlay`.

**Pruebas: 582 → 665 ✓** (83 nuevas), y las mismas pasan sobre el código minificado que va dentro del
APK. Comprobado con mutaciones: si se devuelve el borde a 0,075, la superficie a `#101012`, el campo
a la raya de puntos, la vibración media a `LIGHT`, el divisor del simulador al peso total o el umbral
del deslizamiento a 90 px, las pruebas fallan diciendo el número que han leído.

---

## Ronda v67.6 · La Agenda por apartados y las entregas con plazo

Lo que pediste, tal cual: «me gustaría que se viera como en Aula» y «en los trabajos que sea de tal
día a tal día», igual que los exámenes son de tal hora a tal hora.

### 1. La Agenda, organizada por módulos

Cada módulo tiene su **apartado** (con su color y cuántas cosas lleva) y dentro van sus pruebas y
entregas en orden de fecha. Cada fila es como la de Aules:

* **icono** según el tipo (examen, práctica, trabajo, recuperación…),
* el **título**,
* la **fecha escrita entera**, con el día de la semana: «martes, 15 de septiembre de 2026, 16:00»,
* en las entregas, **«Apertura: … · Cierre: …»** con las dos palabras en negrita, igual que Aules,
* el **temario o lo que hay que entregar** si lo apuntaste,
* a la derecha, la cuenta atrás y la nota si la tienes.

### 2. El plazo de las entregas (de tal día a tal día)

Al apuntar un **Trabajo**, el formulario cambia solo: pide **«Se entrega»** (el cierre) y **«Hasta
las»**, más **«Se abre»** y **«A las»** (la apertura). Las preguntas del examen (aula, hora de fin)
se esconden, y al volver a «Examen» reaparecen. Si el profe no ha dicho cuándo se abre, se deja
vacío. Un plazo imposible (que abra después de cerrarse) no se guarda.

### 3. Los exámenes, de una hora a otra

Un examen ahora tiene **«Empieza»** y **«Acaba»**: se ve «16:00 – 17:55» en la lista, en la tira de
Inicio y en el calendario que exportas (.ics), que antes le metía 90 minutos fijos. Si no le pones
fin, sigue funcionando como siempre.

### 4. El estado de la entrega, como el desplegable de Aules

Cada entrega trae su **desplegable con los tres estados**: *Pendiente de hacer · Entregado ·
Corregido*, con su color. Se cambia desde la propia fila, sin abrir nada. Al marcar **Corregido** se
abre la entrega para poner la **nota** (que es cuando la sabes), y si puntúa, entra sola en el
componente del esquema (v67.5).

### 5. Avisos de las entregas

Además del «Entrega mañana» y «Entrega en 1 hora» de la ronda pasada, ahora también avisa:

* **«Se abre una entrega»** el día que se abre (con la hora que le pusiste),
* **«Último día para entregar»** el día del cierre, a la hora del resumen.

Los dos se pueden apagar en Ajustes (donde los avisos de exámenes ahora dicen «Examen o entrega»).

### 6. Un fallo que salió al revisarlo con el navegador

El formulario esconde casillas con el atributo `hidden`, pero algunas clases (`.field`,
`.form-row`) traen su propio `display`, así que en pantalla **se seguían viendo** las casillas del
examen dentro de una entrega. Arreglado con una regla general (`[hidden] { display: none
!important; }`) y con una prueba que la vigila: es un fallo que se veía a simple vista y que las
pruebas de casa no cogían.

**Pruebas: 548 → 582 ✓** (34 nuevas), y las mismas pasan sobre el código minificado del APK.

---

## Ronda v67.5 · Calificaciones a tu manera y la Agenda con trabajos

Hasta ahora cada módulo tenía **una nota** y punto: la escribías tú y la app la repetía en el
boletín, en la media y en el radar. Eso vale cuando el profe te da un solo número, pero no cuando
la nota sale de varias partes con pesos distintos y con reglas que la pueden tumbar. Esta ronda la
app aprende a calcularla, y la pestaña de Exámenes pasa a ser una **Agenda** donde caben también
los trabajos y las entregas.

### 1. Esquema de evaluación por módulo (opcional)

Cada módulo puede tener su esquema: **componentes con nombre y peso** («Examen de teoría» 40 %,
«Examen práctico» 40 %, «Prácticas» 20 %), cada uno con su nota y su propio **«sobre X»** (por si
el profe puntúa sobre 20 o sobre 100). La app avisa si los pesos no suman 100 %, pero deja
guardarlo igual: manda lo que diga tu profesor.

Y dos **reglas que pueden suspender aunque la media pondere bien**:

* **«Hay que aprobar todos los RA»**: se activa, se añaden los RA uno a uno y se marcan los
  aprobados. Un RA sin marcar suspende el módulo y la app dice **cuál**.
* **«Exigir la nota mínima de cada componente»**: si un componente se queda por debajo de su
  mínimo, el módulo suspende y se explica el motivo.

La nota final es la **media ponderada**, normalizada por el peso de lo que ya tiene nota: un
componente sin nota **no cuenta como 0**, así la app te va diciendo «lo que llevas» mientras el
curso avanza, igual que la media del ciclo. Y un módulo **sin esquema sigue igual que siempre**:
su nota a mano, sin que nada se rompa.

### 2. La nota entra sola desde la Agenda

El tipo **«Trabajo»** (además de Examen, Prueba, Práctico y Recuperación) trae un interruptor:
**«¿Puntúa para la nota?»**. Si puntúa, se elige su **módulo** y el **componente** del esquema; al
poner la nota del trabajo (cuando la devuelva el profe), el componente y la nota final del módulo
se recalculan solos: **no hay que meter la nota dos veces**. Si no puntúa, es un recordatorio de
entrega y no toca ninguna nota.

Un componente con notas de la Agenda enseña de dónde sale («Lo llena la Agenda: 3 entregas · media
7,50») y trae un enlace para **escribirla a mano** si prefieres que mande tu nota; y al revés, si la
tenías a mano y hay entregas, otro enlace para volver a usar la Agenda.

### 3. Exámenes pasa a ser Agenda

Solo el texto visible: la barra de abajo, el título de la vista y el atajo de «Más» ahora dicen
**Agenda**, con los filtros de siempre (próximas / pasadas / todas) más un segundo filtro
**Exámenes · Trabajos**. El identificador interno sigue siendo `exams`, así que nada de lo guardado
se pierde. Los avisos de la tarde antes y de la hora antes distinguen: «Entrega mañana» y «Entrega
en 1 hora» cuando es un trabajo.

### 4. El radar y las vistas de notas

* **Radar**: entraban solo los 12 primeros módulos y los últimos desaparecían sin avisar. Ahora
  entran **todos**, y los que aún no tienen nota salen en gris en vez de desaparecer.
* **Calificaciones**: cada módulo con esquema enseña sus componentes, con su peso, su nota y si la
  llena la Agenda; con un botón para **meter notas** (solo las que tengas) y otro para **editar el
  esquema**. Los módulos sin esquema ofrecen montarlo con la plantilla 40 / 40 / 20.
* **Ficha del módulo**: el mismo bloque, con el botón del esquema y la nota final del tirón.

### 5. Tu primer esquema, ya puesto: Servicios en Red

Como me pasaste los criterios de Servicios en Red, la app lo trae **preparado**: 40 % examen de
teoría, 40 % examen práctico, 20 % prácticas y la regla **«hay que aprobar todos los RA»**
activada. Los RA los añades tú (no me los invento): Calificaciones → Servicios en Red → *Esquema de
evaluación* → *+ Añadir RA*, y marcas los aprobados. Las notas, cuando las tengas, desde **Meter
notas** o apuntando el trabajo en la Agenda.

### 6. Lo que se ha cuidado

Los datos siguen siendo tuyos y locales: el esquema vive dentro de cada módulo y los trabajos en la
misma lista de siempre, todo saneado al cargar (un componente borrado se desenlaza solo, un
«no puntúa» no se pierde). El identificador `exams` no cambia, el estado viejo se lee igual y los
módulos sin esquema se comportan como antes. Los números con coma («9,5») se aceptan en todos los
campos nuevos.

**Pruebas: 493 → 548 ✓** (55 nuevas), y las mismas pasan sobre el código minificado que va dentro
del APK.

---

## Ronda v67.4.2 · «No funciona la IA de ollama»

El informe llegó con cuatro palabras y ninguna pista: «No funciona la IA de ollama». El chat no se
rompía: **siempre** acababa en el motor local, dijera lo que dijera el informe, así que no había
forma de saber qué pasaba. Se revisó el camino entero (página → WebView → red → Ollama) y había
**dos problemas de verdad y uno de confianza**.

### 1. En el APK, la app no podía salir por `http://` (el fallo principal)

La web va dentro del APK en `https://localhost` (Capacitor con `androidScheme: "https"`), y Ollama
en casa escucha en `http://192.168.x.x:11434`. Ahí había dos puertas cerradas:

* **Contenido mixto**: la configuración tenía `android.allowMixedContent: false`, así que el WebView
  bloqueaba cualquier petición desde la página https hacia un http.
* **Tráfico en claro**: desde Android 9 (y aquí se compila con `targetSdk 34`) el sistema prohíbe
  el tráfico sin cifrar salvo que la app lo pida en su manifest. Nadie lo pedía.

Arreglado: `allowMixedContent: true` en `capacitor.config.json` y
`android:usesCleartextTraffic="true"` en el `<application>` del manifest, que el overlay añade
(`apk-overlay/apply.py`) y el comprobador del APK exige (`comprobar-apk.py`). Se aplica sobre el
manifest tal cual sale de `cap sync`, así que el FileProvider, la activity y los 19 widgets siguen
en su sitio (comprobado con el manifest de la plantilla real).

### 2. Plan B para cuando el WebView corta: el puente nativo

Toda llamada a Ollama pasa por `pedirOllama()`: primero el `fetch` normal y, si el WebView lo corta
(contenido mixto, CORS o lo que venga), se reintenta con `CapacitorHttp`, que sale por el lado
nativo de Android y no pasa por las reglas del navegador. El comprobador del APK verifica que esa
clase va dentro del APK.

### 3. Dejar de mentir: cada fallo, con su nombre y su arreglo

Antes, cualquier problema acababa en el mismo «(Ollama no respondió; respondió el motor local.)».
Ahora `diagnosticoOllama()` mira la dirección, el puerto, la respuesta y el puente, y distingue:

| Lo que pasa | Lo que dice la app | Qué propone |
|---|---|---|
| Nadie contesta (Ollama solo en localhost, cortafuegos, otra Wi-Fi) | «El móvil no llega a http://…» | `OLLAMA_HOST=0.0.0.0` (Windows/Mac/Linux), la IP del ordenador y abrir el puerto 11434 |
| Contesta 401/403 | «Ollama contestó 403» | reiniciar con `OLLAMA_ORIGINS=*` |
| Contesta pero tarda más de 8 s | «Ollama no contestó a tiempo» | el ordenador ocupado o dormido |
| Contesta y no hay modelos | «Ollama responde, pero no hay ningún modelo» | `ollama pull llama3.2` |
| Contesta y falta el modelo pedido | «El modelo «x» no está descargado» | `ollama pull x`, y los que ya tienes se tocan abajo |
| Web en https:// con Ollama en http:// | «El navegador no deja salir desde https://» | usar la app instalada o abrir la web en http:// |
| Todo bien | «Conectado con tu Ollama» | — |

El chat, cuando falla, ya no cae en silencio: escribe **quién** ha respondido («Respondió el motor
local del móvil»), **qué** ha pasado y **qué mirar**, con los pasos numerados. El badge de la
cabecera tampoco miente: «Conectado» solo si ha respondido de verdad, «Sin conexión» si ha fallado
y «Sin probar» si hay dirección pero no se ha probado.

### 4. La hoja de configuración enseña el camino

El modal de Ollama (detrás del engranaje) lleva ahora una guía plegable «Si no conecta…» con los
comandos exactos por sistema, recuerda que el móvil tiene que estar en la misma Wi-Fi y, al probar
la conexión, lista los modelos que tienes en el ordenador para elegir uno **de un toque** (sin
escribir). «Probar conexión» enseña el resultado ahí mismo y abre la guía si algo falla.

### 5. La respuesta se quedaba debajo del scroll

Al preguntar, el registro del chat (`max-height: 380px`, con su propio scroll) se quedaba arriba:
la respuesta aparecía por debajo y, en un móvil, eso se lee como «no ha contestado». Ahora, cada
vez que se pinta la vista del chat (`AulaStudio.montarChat()` desde `render()`), el registro baja
solo hasta el último mensaje.

### 6. Un fallo de arranque que salió por el camino

`app.js` pinta la vista antes de que `studio.js` (el módulo del chat, la agenda, las herramientas…)
esté cargado. Al abrir la app directamente en una de esas vistas salía «Módulo no cargado» y se
quedaba ahí. Ahora el módulo repinta la vista en cuanto termina de cargar (y se comprobó en el
navegador: el chat aparece siempre, incluso entrando directo por el enlace).

### Pruebas

**476 → 493 ✓** (17 comprobaciones nuevas: los siete diagnósticos, el reintento por el puente
nativo, el motivo en el chat, el badge, la guía en la hoja, elegir modelo de un toque y las tres
comprobaciones del APK, más el registro que baja solo). `npm run test:min` pasa las mismas 493 sobre el código minificado —que es
el que va dentro del APK—; para eso el minificador ahora copia también `capacitor.config.json`.

Además, una batería nueva en un navegador de verdad contra un **Ollama de mentira** local
(`/tmp/ollama-falso.mjs`): configurar la dirección, «Probar conexión» → «Conectado con tu Ollama»,
preguntar y recibir la respuesta **del modelo** (no del motor local), apagar el servidor y ver el
diagnóstico completo con el badge en rojo y el mensaje nuevo a la vista. 10 de 10 y cero errores
de consola.

---

## Ronda v67.4 · La auditoría de interfaz: la barra de abajo, el calendario y las cosas que mentían

El usuario mandó una revisión pantalla por pantalla (13 capturas) y la abrió con una frase:
«**ANTES QUE TODO ESTO: No se ve la barra de abajo**». Eso fue lo primero que se miró y lo primero
que se arregló; el resto va por orden de gravedad.

### 1. La barra de abajo (lo urgente)

La barra no desaparece sola: la esconden el **modo foco** y el **modo concentración**.

* `body.focus-mode` oculta `.hub-nav` a propósito (es su sentido: «sin distracciones»), pero había
  tres formas de quedarse dentro sin darse cuenta: activar Concentración (90 minutos), pulsar la
  tecla **F** o abrir la app con un bloqueo anterior a medias.
* Al **caducar** el bloqueo de Concentración solo se quitaba la clase `exam-lock`, no `focus-mode`:
  el foco se quedaba pegado y, al volver a abrir la app, **no había barra de abajo ni forma evidente
  de recuperarla**. Lo mismo al salir a mano desde la pantalla de Concentración, que quitaba el
  bloqueo pero dejaba el foco puesto.

Ahora hay un único sitio que toca esas clases (`ponFoco()`), el bloqueo caducado **suelta el foco
solo** (y vuelve la barra), salir de Concentración devuelve la barra en el acto, y la tecla F avisa
por un mensaje de qué está pasando. La app sigue entrando en foco si el bloqueo está vivo: eso es lo
que pediste, pero ya no puede quedarse pegado.

### 2. Inicio: la fecha que se cortaba y la semana en rojo

* «14 de septie…» no era un fallo del navegador: la tarjeta del primer día de clase tenía
  `white-space: nowrap` con puntos suspensivos. Ahora la fecha baja de línea entera y se lee
  completa, también con «Tamaño del texto: grande».
* La tira de la semana pintaba **en rojo todo lo que no es día lectivo**: festivos, vacaciones,
  sábados, domingos y también los días de antes de empezar el curso. En septiembre eso dejaba la
  semana entera en rojo, que en un boletín se lee como «suspenso». Ahora el rojo es solo para el
  festivo; las vacaciones van en ámbar y lo de fuera del curso o el fin de semana en gris.
* El botón «Activar» de los avisos dejaba de ser el más llamativo de la pantalla (era un botón
  grande en negro para algo secundario) y la nota media ya enseña su escala («7.5**/10**»).

### 3. Calendario: los días 9 y 12 salían ovalados

La casilla del día es un círculo de 46 px como mucho, pero el CSS viejo (`css/styles.css`, de la
época del calendario grande) le dejaba **96 px de alto** y, en pantallas táctiles, 46 px: en una
columna de 39 px, aquello era una píldora vertical. Y las casillas de relleno (los días que faltan
para completar la primera y la última semana) seguían pintándose como cajas vacías.

Arreglado: la casilla del mes usa el círculo y nada más, el relleno es invisible pero ocupa su
hueco, y la agenda densa tampoco hereda los 96 px. Medido en Chromium: **39,4 × 39,4 px**, todas las
filas iguales.

### 4. Exámenes: cuatro cosas diciendo lo mismo

Sin ninguna prueba apuntada salían a la vez la tarjeta «Nada a la vista», tres ceros, una caja
«Nada apuntado aquí» y **dos botones** para añadir. Ahora, sin exámenes, hay **un solo estado**
(icono, explicación y un botón «Añadir el primero»); con exámenes, la tarjeta de la próxima prueba
sigue arriba y el botón de abajo es el único.

### 5. Calificaciones: el radar dibujaba 8 módulos de 10 (y el punto rojo de un 7,50)

El texto decía «10 de 10 módulos con nota» y el radar solo pintaba 8 vértices: el código cortaba en
`slice(0, 8)`. Ahora entran todos los módulos (hasta 12), cada punto lleva su color según la nota
(verde aprobado alto, azul aprobado, rojo suspenso) y al tocar un punto sale el módulo con su nota.
La nota de cada módulo ya enseña su escala («7.50**/10**») y el punto que la acompaña habla de la
nota, no del módulo: antes llevaba el color del módulo (y alguno es rojo), así que un 7,50 salía con
un punto rojo al lado y parecía un suspenso. El rojo queda para lo que está suspenso; el verde, para
las notas altas.

**v67.4.1** (esta misma ronda): ese punto rojo al lado de una nota aprobada. El resto del boletín
sigue igual.

### 6. El panel «Más»

* Fuera el subtítulo «Inicio, Horario, Exámenes y Notas ya están en la barra de abajo»: repetía lo
  que ya se ve.
* Las secciones con número impar de apartados (Hábitos suelto) dejan de tener un hueco raro: el
  último ocupa la fila completa.
* Y con el panel abierto ya **no parece que haya dos pestañas activas**: el botón «Más» se enciende
  con un punto debajo, sin el relleno de pestaña activa que compartía con la vista de debajo.

### 7. Herramientas: cabecera repetida, colores de feria y buscador

El título «Herramientas SMR» aparecía dos veces (cabecera y rótulo), cada tarjeta iba de un color
distinto sin que significara nada y con 37 herramientas había que bajar a ojo. Ahora: un solo
título, **un color por sección** (y el icono de cada tarjeta de ese color), y un **buscador** que
filtra por nombre, explicación o sección («chmod» deja la tarjeta a la vista), con su botón para
borrar y un estado claro cuando no hay resultados.

### 8. El chat: la configuración sale de en medio

Dentro del chat estaban los campos de dirección y modelo de Ollama con sus botones de probar: quien
solo quiere preguntar tropezaba con la configuración. Ahora hay un **engranaje** en la cabecera del
chat que abre la configuración en una hoja aparte, y en Ajustes → Datos locales la misma tarjeta
abre ese mismo sitio (una sola fuente de verdad).

### 9. Ajustes y formularios: interruptores en vez de casillas

Las opciones de sí/no (Ajustes y el asistente inicial) eran casillas de escritorio. Ahora son
**interruptores** de 50 × 30 px, con el texto a la izquierda y el mando a la derecha, y 54 px de
alto para el dedo. El tema deja de estar duplicado (la casilla «automático» y el botón grande):
ahora es un segmentado **Claro · Oscuro · Auto** en un solo control.

### 10. Lo demás que salió en la revisión

* **Leyenda de asistencia**: «P presente · R retraso · F falta» pasa a tres puntos con el color de
  cada botón (verde, ámbar, rojo).
* **Un solo tipo de estado vacío** (icono, título, explicación y, si toca, un botón): el de
  Exámenes, el de un día sin clase en el Horario y el del radar usan la misma pieza.
* **Aire al final del contenido**: `padding-bottom` = alto de la barra + 34 px (108 px reales con la
  barra de 74), para que la barra nunca corte la última tarjeta.
* **«Festivo local (Villena)»** se repetía tres veces en la ficha del curso; ahora la fila lleva la
  fecha delante y el nombre detrás, así cada festivo se distingue.
* El título de la vista de Herramientas cabe en la cabecera del móvil («Herramientas» en vez de
  «Herramientas SMR»).

**Pruebas: 440 → 476 ✓** más una batería nueva en el navegador (32 comprobaciones: barra visible al
abrir, bloqueo caducado que suelta el foco, bloqueo vivo que lo mantiene, salir de Concentración,
colores de la semana, fecha sin recorte, un solo botón en Exámenes, radar con los 10 módulos,
casillas redondas, rejilla de «Más», buscador del taller, engranaje de Ollama y control de tema
único). Sin errores de consola en ninguna vista.

## Ronda v67.3 · El horario, casilla a casilla

La v67.2 se publicó con el horario leído de un vistazo y **cuatro casillas equivocadas**: el martes
tenía tres horas de Seguridad (son dos, y luego Optativo), el miércoles tres de Optativo (son dos, y
a las 19:10 toca Servicios), el jueves la tanda de Aplicaciones web estaba una hora antes de sitio
(el día empieza con **tres** horas de Sistemas operativos) y el viernes acababa con Sistemas a las
20:05 cuando en realidad ocupa las **dos últimas** horas (19:10–21:00).

Releyendo las dos hojas del centro con calma —los recreos parten la tabla en bloques de dos o tres
horas, y cada módulo ocupa las casillas contiguas que marca la hoja— el reparto definitivo es:

| Tramo | Lunes | Martes | Miércoles | Jueves | Viernes |
|---|---|---|---|---|---|
| 1.º (15:10) | Seguridad | Itinerario | Proyecto | Sistemas op. | Tutoría |
| 2.º (16:05) | Seguridad | Digitalización | Proyecto | Sistemas op. | Itinerario |
| 3.º (17:00) | Itinerario | Seguridad | Optativo | Sistemas op. | Servicios |
| 4.º (18:15) | Sistemas op. | Seguridad | Optativo | Aplicaciones web | Servicios |
| 5.º (19:10) | Sistemas op. | Optativo | Servicios | Aplicaciones web | Sistemas op. |
| 6.º (20:05) | Servicios | Aplicaciones web | Sostenibilidad | Servicios | Sistemas op. |
| 7.º (21:20) | Servicios | — | — | — | — |

Con esto, las horas semanales son 31 y cuadran con la hoja: Sistemas 7, Servicios 6, Seguridad 4,
Itinerario 3, Optativo 3, Aplicaciones web 3, Proyecto 2, Digitalización 1, Sostenibilidad 1 y
Tutoría 1.

El sello del plan sube a 3, así que quien ya tenga el horario de la v67.2 **se le vuelve a cuadrar
solo** al abrir la app (mismo mecanismo: conserva el id de cada clase, y con él la asistencia y las
excepciones).

**Pruebas: 437 → 440 ✓** (el reparto día a día, las horas de cada módulo y la actualización desde el
plan sellado de la v67.2).

## Ronda v67.2 · El horario del centro, de verdad

El usuario mandó las dos hojas del centro (temporal de septiembre/junio y curso completo) y pidió:
«Pon bien los horarios de clase anda. Y los huecos que ponías al final, como horas libres, elimínalas».
De paso, dos fallos que él mismo vio en Ajustes: los botones de guardar flotando y la foto de perfil.

### 1. El horario estaba mal (y ahora está tal cual la hoja del centro)
El documento definitivo cambia las horas y alguna asignatura respecto al primer documento que tenía la
app. Comparado hoja a hoja:

* **Horario del curso: 15:10–22:15** (antes 15:15–21:45), con clases de **55 minutos** y el último
  tramo de **21:20 a 22:15** (antes 21:00–21:45).
* **Horario temporal (septiembre y junio): 16:00–21:45**, clases de 45 minutos. Esta parte ya estaba
  bien y no se ha tocado.

El reparto de módulos, tramo a tramo, según la hoja (L = lunes … V = viernes):

| Tramo | Lunes | Martes | Miércoles | Jueves | Viernes |
|---|---|---|---|---|---|
| 1.º | Seguridad | Itinerario | Proyecto | Sist. operativos | Tutoría |
| 2.º | Seguridad | Digitalización | Proyecto | Sist. operativos | Itinerario |
| 3.º | **Itinerario** | Seguridad | Optativo | Sist. operativos | Servicios |
| 4.º | Sist. operativos | Seguridad | Optativo | Aplic. web | Servicios |
| 5.º | Sist. operativos | Optativo | Servicios | Aplic. web | Sist. operativos |
| 6.º | Servicios | Aplic. web | Sostenibilidad | Servicios | Sist. operativos |
| 7.º | Servicios | — | — | — | — |

Los cambios respecto a lo que había: el lunes a las 17:00 toca **Itinerario personal** (no Seguridad)
y el jueves el día acaba a las 21:00 (sin la última hora). Las horas semanales cuadran con la hoja:
Sistemas 7, Servicios 6, Seguridad 4, Itinerario 3, Optativo 3, Aplicaciones web 3, Proyecto 2 y una
hora de cada uno de los demás (31 clases). *(La tabla se corrigió en la v67.3: la primera lectura de
las hojas, en la v67.2, metió cuatro casillas mal; ver la ronda siguiente.)*

### 2. A quien ya tuviera el horario viejo se le pone al día solo
Nadie tiene que volver a cargar nada. Al abrir la app, si el horario guardado es el del centro (se
reconoce por sus horas) y tiene la versión antigua del plan, se sustituye por el nuevo **conservando
el id de cada clase que sigue existiendo** (mismo día y mismo módulo), así que la asistencia
apuntada, las excepciones (una clase movida o suspendida) y los avisos programados siguen valiendo.
Los bloques de estudio propios se quedan donde estaban. Si hay alguna clase puesta a mano (una hora
que no es del centro), no se toca nada: mejor no pisar datos del usuario.

### 3. Fuera las «horas libres» que salían al final del día
En la vista Horario, cada día acababa con dos filas de «Hueco libre»: una de 15:00 a 16:00 (antes de
entrar) y otra de 21:45 a 23:00 (después de salir), calculadas con la jornada de los ajustes
(8:00–21:00… 15:00–23:00) en vez de con tus clases. Eran ruido, y el usuario tenía razón en que
sobraban. Ahora el margen es **de la primera a la última clase del día**, así que:

* Un día normal no enseña ningún «hueco libre»: ni antes de entrar ni después de salir.
* Si de verdad te queda una hora suelta entre clases (por ejemplo, una clase suspendida), sí se
  ofrece para estudiar: eso sí es un hueco.
* En la Agenda pasa lo mismo: los «huecos libres» del día solo salen cuando existen de verdad (antes
  salían siete huecos inventados cada día, por la jornada del ajuste), el contador desaparece si no
  hay ninguno y la tarjeta «Huecos libres» no se pinta vacía.

### 4. La foto de perfil no cambiaba (fallo real)
Al elegir una criatura de la galería, la app **guardaba la elección** pero seguía enseñando la letra
en la cabecera. La causa: la cabecera pasaba la imagen por `safeImgSrc()`, que por seguridad solo
acepta `data:` y `blob:` (fotos del usuario); las criaturas son rutas de la app (`assets/avatars/…`)
y se descartaban. Ahora hay una lista blanca de verdad: criaturas de la app o foto propia, y nada
más. Comprobado en el navegador con la bolita de Charizard: cabecera, tarjeta de perfil y galería
marcada.

### 5. Los botones de Ajustes ya no flotan
`Guardar ajustes` y `Volver a configurar desde el principio` eran `position: sticky; bottom: …` con
fondo difuminado: se quedaban **encima** de las tarjetas mientras bajabas por los ajustes. Ahora van
al final de la lista, en su sitio (estáticos), uno debajo del otro.

**Pruebas: 401 → 437 ✓** (36 nuevas: tramos y plan del documento, reparto por días, horario
actualizado sin perder asistencia, sin pisar clases propias, huecos de verdad en Horario y Agenda,
la galería de perfil y los botones de Ajustes). Pasan también sobre el código minificado del APK, y
el barrido de las 21 vistas sigue sin errores ni desbordes.

## Ronda v67.1 · La hoja «Más» vuelve a verse pequeña

Queja del usuario, palabra por palabra: «En el apartado de "más" no me gusta que se vea tan grande,
antes que estaba con cada apartado más pequeño estaba genial eso». Tenía razón y el culpable era el
rediseño de la v59.

### Qué había pasado
En la versión original cada apartado de «Más» era una tarjeta pequeña (icono de 36 px, texto de
13,5 px, 8 px de hueco). Al rediseñar la interfaz en la v59 se agrandó todo: icono de 38 px, texto de
13,5 px con nombre y descripción más separados, relleno de 14 px, **alto mínimo de 92 px** y hueco de
10 px. Además, en un móvil de 360 px la rejilla pasaba a **una sola columna**: cada apartado ocupaba
todo el ancho y la lista se hacía interminable.

Medido en el navegador, en un móvil de 360 × 780: antes se veían **1,75 apartados por pantalla** (en
dos columnas) y la hoja medía **2.204 px** de recorrido; con el CSS de la v59 se veían **1 por
pantalla** (una columna) y llegaba a **2.204 px**. Ahora: **2 apartados por pantalla**, **78 px** por
tarjeta, **1.146 px** de recorrido y los 15 apartados sin desbordes ni con texto grande.

### Qué se ha hecho
Volver al tamaño pequeño de siempre, sin perder el icono de color:

* Tarjetas de **9 px de relleno, hueco de 4 px** y **sin alto mínimo** (78 px reales), icono de 26 px
  y nombre a 12 px con la descripción a 10 px pegada debajo.
* **Dos columnas también en móvil estrecho**: el nombre de cada apartado es corto, no necesita el
  ancho entero. (La regla de «una columna por debajo de 460 px» sigue valiendo para las tarjetas de
  texto largas: `.stack-phone`, `.review-grid`, `.tools-grid`.)
* Huecos de 8 px entre tarjetas y 6 px de margen antes de cada sección.

Comprobado en Chromium a 360 y 320 px: ningún texto se corta ni se sale de su tarjeta, y se ve bien
en tema oscuro, en tema claro y con «Tamaño del texto: grande» (ahí las tarjetas crecen a 82 px y
siguen sin desbordar).

**Pruebas: 394 → 401 ✓** (7 nuevas que fijan el tamaño de la hoja «Más», para que no vuelva a
agrandarse por descuido). Pasan también sobre el CSS minificado del APK.

## Ronda v67 · El bloque avisa aunque cierres la app, horario para compartir y «haz copia»

### 1. El bloque de estudio avisa con la app cerrada
Hasta ahora el pomodoro solo sonaba **si la app estaba en pantalla**: si empezabas los 25 minutos y
te ibas a hacer otra cosa (que es exactamente lo que se hace), no te enterabas de que había
terminado. Dentro del APK los avisos ya los programa Android desde la v63, pero el temporizador no
los usaba. Ahora sí:

* Al empezar el bloque se programan **dos avisos**: uno al segundo («Enfocado hasta las 21:00 · 25
  min de estudio. Puedes cerrar la app: te aviso al terminar») y el importante, **a la hora exacta
  del final** («Bloque terminado · +25 min. Toca para el descanso»).
* Se cancelan al pausar, al reiniciar, al darle a «Terminar» y al cambiar de modo — nada de avisos
  fantasma de bloques que abandonaste.
* Al tocar la notificación se abre el temporizador (`extra.vista`).
* Si el móvil se reinicia en mitad del bloque, al volver a abrir la app el aviso se **reprograma**
  con el tiempo que queda.
* Se respeta el interruptor de Ajustes: sin «avisos del móvil» activados, el temporizador no
  programa nada.

Comprobado en el navegador con un Capacitor de mentira: al pulsar INICIAR salen los dos avisos
(2147483002 a +1 s y 2147483001 a los 25 min) y al pausar se cancelan los dos.

### 2. Compartir el horario
Botón **Compartir horario** en la pestaña Semana del Horario: genera el horario en texto plano
(días, horas, módulos y aulas, con la nota de septiembre-junio si es el horario temporal y la firma
del centro) y lo manda por la hoja de Android o el portapapeles del navegador. Sirve para el grupo
de clase entero: 45 líneas con todo, sin abrir la app.

De paso, el código de compartir de la v66 se generalizó (`compartirTexto`), así que el apunte y el
horario usan la misma senda: un solo sitio donde arreglar el día que cambie algo.

### 3. Recordatorio de copia de seguridad
Los datos viven **solo en el móvil**: no hay nube que los salve. La app no lo exigía en ninguna
parte. Ahora:

* Guarda la fecha de la última copia (y la de instalación) cada vez que exportas JSON.
* Si pasan **14 días** sin guardar una copia y hay datos que merecen la pena (3 apuntes, 5 sesiones
  o 10 fichas), aparece una tarjeta en Inicio: «Hace 30 días de tu última copia» + botón **Guardar
  copia ahora**. Al guardarla, la tarjeta **se va en el acto** (si no, parece que no ha pasado nada).
* Ajustes → Datos dice siempre cuándo fue la última copia («hoy mismo», «ayer», «hace 30 días»).
* Quien acaba de instalar la app **no recibe la bronca el primer día**: el contador arranca al
  abrirla, y el aviso llega a las dos semanas de uso real.

### Detalle que salió en la comprobación
Al probar el botón de la tarjeta en el navegador, el aviso desaparecía del estado pero **seguía en
pantalla** (el guardado no repintaba). Corregido: al guardar la copia, la vista de Inicio se
refresca sola.

**Pruebas: 365 → 394 ✓** (29 nuevas: avisos del bloque arriba/abajo, cancelación, bloque ya
terminado; texto del horario y su botón; días desde la copia, tarjeta sí/no, reset al exportar y
sitio en Ajustes). Barrido de las 22 vistas: ninguna con problemas. Sin errores de JavaScript.

## Ronda v66 · Compartir un apunte (y una comprobación que faltaba)

### Compartir el apunte que estás leyendo
Nuevo botón **Compartir** en la barra del apunte. Manda el texto tal cual (título · módulo +
contenido) y, si el apunte tiene fotos, **hasta 6 adjuntas**:

* **Dentro del APK**: se escribe cada foto en la caché de la app y se abre la hoja de compartir de
  Android, con el texto y los archivos. Sirve igual para mandarlo por WhatsApp, por correo o
  guardarlo en Drive.
* **En el navegador**: usa la hoja del sistema (`navigator.share`) si la hay; si no, copia el
  apunte al portapapeles y lo dice.

Comprobado en el navegador con un Capacitor de mentira: el botón está en su sitio, la llamada sale
con el título y el texto del apunte, y el aviso de confirmación aparece. En las pruebas se cubre
también el caso feo: **si una foto no se puede leer, el apunte se comparte igual** (sin adjuntos),
en vez de quedarse a medias.

### El FileProvider también se comprueba
Al revisar el plugin de compartir apareció que **el FileProvider lo añade `npx cap add android`**,
no el plugin: si ese proyecto Android se regenerara con otra versión del template, compartir
archivos fallaría. El comprobador del APK ahora verifica que exista la autoridad `.fileprovider`
en el manifest, igual que verifica los plugins. (En el APK publicado está: se comprobó.)

**Pruebas: 356 → 365 ✓** (9 nuevas: texto del apunte con y sin contenido, portapapeles,
`navigator.share`, hoja de Android con la foto adjunta en base64, y el fallo de la foto).

## Ronda v65 · Exportar de verdad (y un fallo gordo que nadie veía)

### El fallo: en el APK, los botones de exportar no hacían NADA
El WebView de Android **no tiene gestor de descargas**, y Capacitor no lo suple (lo comprobé en su
código: ni `setDownloadListener` ni nada que lo sustituya). Todos los exportadores de la app
usaban el truco del navegador (`<a download>` con un blob), así que **dentro del APK**:

* «Exportar copia JSON (con fotos)» → no pasaba nada (¡y es la copia de seguridad!),
* «Calendario .ics» → nada,
* «Apuntes a Markdown» y «Fichas a CSV (Anki)» → nada (y esos dos botones, además, ni estaban
  conectados en la vista: los añadí en la v55 pero sin manejador).

Lo peor es que el aviso en pantalla decía «Copia descargada»: mentía.

### El arreglo: una sola forma de guardar, y en Android la hoja de compartir
Nuevo `guardarArchivo(nombre, texto, mime)` en `app.js`:

* **En el navegador**: descarga normal (como antes, que ahí sí funciona).
* **Dentro del APK**: escribe el archivo con `@capacitor/filesystem` y abre la **hoja de compartir
  de Android** (`@capacitor/share`): el alumno decide si lo guarda en Archivos, en Drive o lo
  manda por WhatsApp. El aviso cambia a «Copia lista: elige dónde guardarla».

Los cuatro exportadores pasan por ahí (los de Markdown y Anki se han movido de `studio.js` a
`app.js`, como funciones puras que devuelven texto: `markdownApuntes()`, `ankiCSV()`, `icsTexto()`).
Si el móvil no puede escribir, se avisa en pantalla en vez de decir que se guardó.

Comprobado en el navegador con un Capacitor de mentira: los cuatro botones escriben su archivo en
la caché de la app y llaman a la hoja de compartir (JSON 19 KB, .ics 18 KB, Markdown 1,6 KB, CSV
1,3 KB), **y sin Capacitor los cuatro se descargan** con su contenido correcto.

### Avisos dentro del calendario del móvil
El `.ics` de los exámenes lleva ahora dos `VALARM`: **la víspera y una hora antes**. Así, cuando
importas el calendario a Google Calendar o al del móvil, los recordatorios siguen ahí incluso sin
la app. Las clases **no** llevan avisos a propósito (sonarían 30 veces por semana).

### El comprobador del APK ahora vigila los plugins
Si alguien cambia `cap sync` por `cap copy`, el JavaScript sigue dentro pero **las clases nativas
no**: las notificaciones programadas y el guardado de archivos dejarían de existir, y sería
invisible hasta tenerlo en la mano. Ahora el CI busca en el dex `LocalNotificationsPlugin`,
`FilesystemPlugin` y `SharePlugin`, y comprueba el permiso `POST_NOTIFICATIONS` en el manifest. La
Release publica `plugins` en `.datos-apk`.

**Pruebas: 336 → 356 ✓** (20 nuevas: Markdown con módulo y fotos, CSV con cabeceras de Anki,
comillas y saltos escapados, .ics cerrado y con sus dos `VALARM`, y el guardado en los dos
caminos, incluido el fallo al escribir).

## Ronda v64 · Los avisos se tocan, se prueban y se explican (y aviso de versión nueva)

Cuatro cosas pequeñas que hacen que lo de la ronda anterior se sienta terminado.

### 1. Tocar la notificación abre su pantalla
Cada aviso lleva ahora su vista (`extra.vista`) y la app escucha `localNotificationActionPerformed`:
tocas el aviso de «Clase en 10 min» y abres el **Horario**; el de examen, **Exámenes**; el de fichas
pendientes, **Fichas**; el resumen de la mañana, **Inicio**. La app se pone en esa vista y el
historial queda coherente (misma ruta que usar la barra de abajo). Verificado en el navegador con
un Capacitor de mentira: simular el toque deja la app en `#exams` con la vista pintada.

### 2. «Probar aviso»: saber de una vez si suenan en tu móvil
Nuevo botón en Ajustes → Avisos (solo dentro del APK): programa un aviso real **5 segundos después**
con un id reservado. Si suena, funciona todo el circuito de Android (permiso, canal y alarma); si
no suena, el problema está en los ajustes del móvil y no hay que adivinar. Comprobado: el aviso
queda programado a +5 s y el id es el reservado.

### 3. El permiso de Android se ve y se explica
Ajustes consulta el permiso de verdad (`checkPermissions`) cada vez que se pinta y al volver a la
app. Si está **denegado**, aparece el aviso rojo «Android tiene los avisos bloqueados para esta
app. Actívalos en Ajustes del móvil → Aplicaciones → Aula SMR → Notificaciones», en vez de un botón
que no hace nada al pulsarlo. Probado con permiso concedido y denegado.

### 4. «Nueva versión lista → Actualizar»
El cache-first de la v63 tiene una consecuencia: tras publicar, el service worker nuevo toma el
control pero la pestaña sigue con el código viejo en memoria (por eso hacía falta cerrar y abrir).
Ahora, cuando eso pasa, la app muestra un **aviso que no se va solo**: «Nueva versión lista» con un
botón **Actualizar** que recarga con el código nuevo. La primera vez que se registra el SW no sale
(el `controllerchange` inicial solo estrena). Verificado en el navegador: aparece, se toca y la
página recarga ya con la versión nueva.

Además, los dos recordatorios de examen (víspera a las 18:00 y una hora antes) tienen ya su propio
interruptor en Ajustes, en vez de ir los dos juntos.

**Pruebas: 327 → 336 ✓** (9 nuevas: vista de cada aviso, los dos interruptores de examen por
separado, el aviso de prueba con su id y sus 5 segundos, el permiso concedido y denegado, y el
toque que abre la pantalla). Y las 22 vistas siguen sin errores, sin «undefined» y sin desbordes.

## Ronda v63 · Todo lo que pediste: arranque instantáneo, minificado y avisos de verdad

Punto por punto, lo que decía tu lista (los 10) y qué se ha hecho con cada uno.

### 1. Service Worker cache-first (carga instantánea, con red o sin ella)
Antes el SW iba **network-first para todo**, incluida la app shell: cada apertura esperaba a la
red (con wifi floja, segundos de pantalla en blanco). Ahora los archivos del precache se sirven
**de la caché al instante, sin tocar la red**; solo lo que no está precacheado (tu Ollama, por
ejemplo) sale a la red.

La frescura se garantiza por el **ciclo de versión** del SW: cada publicación cambia `sw.js`
(que contiene `CACHE`), el navegador instala el SW nuevo, llena la caché nueva (`aula-smr-v63`)
y borra la vieja. Además el registro usa `updateViaCache: "none"` (que el `sw.js` no se sirva de
una caché HTTP rancia) y al volver la app a primer plano se llama `update()`.

**Verificado con navegador real**, contando peticiones al servidor:

| recarga | peticiones al servidor |
|---|---|
| 1.ª tras instalar el SW | **0** |
| 2.ª | 1 (`/sw.js`, la comprobación de versión) |
| 3.ª | 1 (`/sw.js`) |

Y **sin conexión**: la app abre entera (5 pestañas, «3 días para empezar», etc.) y si algún
archivo faltara en la caché, un JS nunca se sustituye por HTML (da 504), que era el fallo que
podía dejarte la app en blanco.

### 2. Buscador de apuntes
Cada tecla llamaba a `render()` **entero** (volviendo a pintar toda la vista y recolocando el
cursor a mano). Ahora hay **debounce de 180 ms** y, cuando toca repintar, solo se reescribe la
lista (`#notes-list.innerHTML`), no la vista. Medido: el nodo de la lista sigue siendo el mismo
y el filtro se aplica tras el debounce.

### 3. Minificado antes de publicar y de empaquetar el APK
Nuevo `tools/minificar.mjs` (terser + clean-css + html-minifier-terser) y script `npm run
minificar`. El paso 1/5 del `build.sh` ya no copia la web: la **minifica** (con respaldo: si
fallara, empaqueta sin minificar antes que quedarse sin APK). Los nombres de archivo no cambian,
así que el precache, las rutas y el comprobador del APK siguen valiendo.

**527 KB → 389 KB (−26 %; gzip 145 KB → 115 KB)**. `app.js` 251→176 KB, `tools.js` 56→44 KB,
`ui.css` 88→69 KB. El APK arranca con menos bytes que parsear, que en un móvil modesto se nota.

### 4. `app.js`, que ya pasa de 4.500 líneas: carga bajo demanda
`js/tools.js` (56 KB, lo más pesado después de `app.js`) **ya no se carga al abrir**: se pide la
primera vez que entras en «Herramientas SMR» (cargador en `app.js`, sin `eval` ni scripts en
línea). Sigue en el precache, así que funciona igual sin conexión. Verificado: al abrir Inicio no
se pide; al entrar en Herramientas aparece la vista y las 37 tarjetas.

### 5. Avatares y fotos
`loading="lazy"` + `decoding="async"` en **todas** las plantillas de imagen (9 en `app.js`),
incluidas las fotos de notas y el icono de la app. Comprobado en el navegador: **47 de 47
imágenes** de Ajustes cargan en diferido. Hay prueba automática para que no se vuelva a colar
ninguna.

### 6. CSS solapado: una fuente de verdad por componente
`styles.css` definía su propio `:root` (paleta crema/naranja que `ui.css` pisaba) y `.modal`,
`.toast`, `.badge`, `.btn`, `.grid`… aparecían dos y tres veces. Nuevo `tools/limpiar-css.py`, que
**demuestra** qué está muerto antes de borrarlo:

* **reglas enteras** cuyo selector existe igual en `ui.css` con todas sus propiedades cubiertas
  (59 reglas fuera: `.btn`, `.grid`, `.timer-bar`, `.btn-primary`, `.toast`…);
* **declaraciones pisadas por especificidad** (`[data-theme="dark"]` pierde contra
  `html[data-theme="dark"]`, gane quien gane por orden): 15 fuera;
* **variables del `:root` viejo** que `ui.css` define siempre: 18 fuera (`--bg`, `--paper`,
  `--ink`, `--accent`, `--shadow`…);
* **reglas repetidas del mismo selector con propiedades disjuntas** unidas (11 fuera).

Se quedan los **tokens** que te gustan y las variables que solo existen ahí (con otra piel
`ui.css` no las define: `--font`, `--radius`, `--serif`, `--sidebar`). Total: **−6 % de CSS**
(`ui.css` −0,3 KB, `styles.css` −4,8 KB, `skins.css` −0,4 KB).

**Verificado sin margen de duda**: se cargan las dos versiones del CSS en la MISMA página (mismo
DOM, mismo estado) y se comparan las capturas **píxel a píxel** en 22 vistas × 2 anchuras (360 y
1280 px): **idénticas**. (En la primera tanda el detector cazó un fallo real que la vista no
mostraba: se había borrado `--font`/`--radius` del `:root` viejo y, con una piel distinta de la
de por defecto, la app perdía la tipografía; restaurado.) Y de paso apareció un fallo de la
herramienta: aplicaba ediciones con índices desplazados y se **comió un `@media`**; corregido y
comprobado que las 11 consultas de medios siguen en su sitio.

### 7. CSP en `index.html`
`default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:
blob:; media-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http: https:;
manifest-src 'self'; object-src 'none'; base-uri 'none'; frame-src 'none'`.

Para poder prohibir el JavaScript incrustado, el script del tema (que tiene que correr antes del
primer pintado) se ha movido a `js/tema.js`. Verificado en Chromium real: 7 vistas + menú «Más» +
modal, **0 violaciones**, y un `<script>` en línea inyectado a mano **no se ejecuta**.

### 8. Avisos que suenan con la app cerrada (Android)
Nuevo `js/avisos.js` + plugin `@capacitor/local-notifications`. Dentro del APK, Android
**programa** los avisos:

* **10 minutos antes de cada clase** (solo días lectivos, con el horario real del día;
  `notifyClass`);
* **exámenes**: la tarde anterior a las 18:00 y una hora antes;
* **resumen por la mañana** a la hora que tengas puesta (`morningSummary`, `remindHour`);
* **fichas de repaso** pendientes a las 18:00 (`notifyCards`).

Se programan 14 días vista, con canal propio, ids estables y tope de 64 avisos; al abrir la app
(o al volver a primer plano) se recalcula el plan con los exámenes y el horario de ese momento
(primero se cancelan los viejos). En Ajustes la tarjeta de Avisos explica la diferencia entre
navegador y APK, el botón pide el permiso de Android y cuenta lo que ha quedado programado
(«Programados 24 avisos · el que viene, hoy a las 15:05»). En el navegador todo sigue como antes
(avisos con la app abierta).

La parte del plan es una **función pura** (`plan(datos, ahora)`) y tiene **pruebas automáticas**
(clase a las 15:15 → aviso a las 15:05, víspera de examen a las 18:00, nada en pasado, festivos
sin clases, interruptores que apagan cada tipo…). El circuito nativo completo está probado con un
Capacitor de mentira en el navegador: canal → cancelar viejos → programar 9 avisos, y con el
permiso denegado no se programa nada. El `build.sh` pasa de `cap copy` a **`cap sync`**, que es lo
que enlaza el plugin (comprobado generando el proyecto Android: `implementation
project(':capacitor-local-notifications')`).

### 9. Pantalla ancha (opcional, hecho)
A partir de 1200 px el marco se ensancha a 1060 px y el Inicio se reparte: las 4 tarjetas del
bento en una fila, la semana en 7 columnas y las listas a dos columnas. Comprobado a 1200, 1280 y
1440 px en las vistas clave: **sin desbordes**; y a 360 px el marco sigue siendo el de móvil.

### 10. Lo que ya estaba bien (y ahora está comprobado)
Sintaxis de los 4 JS, escapado, sin `eval`/`document.write` y delegación de eventos: sigue igual,
más **invariantes nuevas** en las pruebas (todo lo que carga `index.html` está en el precache,
CSP sin scripts en línea, todas las imágenes en diferido, el APK minificado y con plugins).

**Pruebas: 285 → 327 ✓** (42 nuevas). Todo lo de esta ronda está verificado o en el navegador
real o ejecutando el código de verdad (`sw.js` dentro de una caché de mentira).

**Y el APK se prueba antes de publicarlo.** El primer intento de publicar la v63 compiló bien
pero la comprobación tumbó la entrega: terser convierte `const APP_VERSION = "v63"` en
`APP_VERSION:"v63"` y el comprobador exigía el «=». Dos arreglos para que no se repita:
el comprobador acepta las dos formas (y la compara entera, con la «v»), y las comprobaciones de
formato del CSS ya no dependen de espacios ni saltos de línea. Además, `npm run test:min` pasa
**la batería completa sobre la web minificada** (misma copia en un directorio temporal, con
`AULA_ROOT`), y el CI lo ejecuta antes de empaquetar: 327 ✓ igual que en el código de casa.

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

## Ronda v68.0.0 · Pulido de accesibilidad, rendimiento y organización

### 1. Agenda: orden de secciones por módulos (no por fecha)
`renderExams()` agrupaba exámenes por orden de aparición en la lista ordenada por fecha: si un
módulo con fecha lejana aparecía primero, su sección se colaba antes de otro con examen hoy.
Ahora `grupos` se ordena por el orden de inserción en `state.subjects`, igual que en el resto
de la app. **3 pruebas arregladas** (757 ✓).

### 2. Chat: indicador de carga mientras la IA piensa
Al enviar un mensaje, aparece «Pensando…» con pulso animado hasta que la IA responde. Se puede
tocar para descartar. Antes, la UI se quedaba muda durante los 45 s de timeout.

### 3. Modales: trampa de foco y Escape
Los modales ahora atrapan Tab/Shift+Tab (el foco no se escapa al fondo) y Escape los cierra.
Ya tenían `role="dialog"` y `aria-modal="true"`, pero el teclado se perdía.

### 4. Avisos: programación diferencial (diff)
`sincronizar()` ya no cancela los 64 avisos y reprograma desde cero en cada apertura. Compara
el plan nuevo con los ya pendientes en el dispositivo: solo cancela los que ya no sirven y
programa los que faltan. En una apertura normal, 0 operaciones nativas en vez de 128.

### 5. Accesibilidad: anuncio de cambio de vista
Un `aria-live="assertive"` oculto anuncia el nombre de la vista al navegar (lectores de pantalla).
El contenedor `#a11y-announce` lleva `class="sr-only"` y se actualiza al entrar en cada pantalla.

### 6. CSS: tokens de espaciado
Nuevas variables en `:root`: `--gap-xs` (4px), `--gap-s` (8px), `--gap-m` (12px), `--gap-l`
(16px), `--gap-xl` (24px). Son la escala más usada en el CSS (43× gap:8px, 27× gap:12px, etc.)
y están listas para usar en código nuevo.

### 7. Organización: secciones en app.js
11 cabeceras de sección (`// ===== UTILIDADES Y CONSTANTES =====`, `// ===== ESTADO: CARGAR / GUARDAR =====`, etc.)
marcan las zonas lógicas del fichero de 6.200+ líneas. Navegable con búsqueda de texto.

**Pruebas: 757 ✓** (sin cambios, las mejoras son de comportamiento o documentación).

## Ronda v68.0.0 (2.ª pasada) · CSS, atajos y tema automático

### 8. CSS: 15 bloques duplicados eliminados
De 31 selectores duplicados a 19 (los 19 restantes son overrides intencionales de responsive/tema).
Bloques fusionados: `*`, `.card`, `.empty b`, `.hub-nav, .hub-header`, `.modal-card::before`,
`.phone.more-open #nav-more`, `.week-pills`, `::placeholder`, `button.cal-day`.

### 9. CSS: 11 `!important` eliminados del editor
`.editor-title` y `.editor-body` usaban `!important` para limpiar estilos de `.field input`.
Ahora usan `.editor .editor-title` (especificidad 0,2,0 > 0,1,1) en vez de machacar con
`!important`. Total `!important`: 23 → 13 (todas justificadas: reduced-motion, `[hidden]`,
print, exam-lock).

### 10. Atajo Cmd+S / Ctrl+S para guardar
Fuerza un `flushSave()` inmediato y muestra «Guardado». Antes no había forma de guardar
manualmente sin navegar.

### 11. Tema automático: respeta `prefers-color-scheme`
El modo «Auto» ahora primero mira la preferencia del sistema (Android, macOS, Windows) antes
de caer en la regla horaria (21:00–08:00). Si el usuario tiene el sistema en oscuro, la app
se oscurece aunque sean las 14:00. Además, escucha cambios en tiempo real (si el usuario
cambia el tema del sistema, la app reacciona sin recargar).

### 12. Eliminada trampa de foco duplicada
La trampa de Tab en modales estaba implementada dos veces: una dentro de `openModal()` y otra
en el keydown global. Se eliminó la de `openModal()` (la global ya la cubre y además maneja
Escape, Cmd+K, Cmd+Z, etc.).

**Pruebas: 757 ✓** (sin cambios).
