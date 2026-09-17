# Aula SMR

App de estudio para **2.º SMR 2026/27** (Sistemas Microinformáticos y Redes).  
Diseño tipo **SMR Hub**. **100 % local**: sin cuenta, sin nube y **sin servidor**.

- No hay servidor propio ni sincronización con nada: se eliminó `server.py` y todo el
  bloque de «Servidor/Sync» que había en la vista *Datos locales*.
- Los datos viven en el dispositivo: `localStorage` (estado) e **IndexedDB** (fotos).
- El **asistente** funciona con un motor local que responde con tus apuntes y tu calendario.
  Opcionalmente puedes conectar tu propio **Ollama local** (tu PC, tu red); si no responde,
  el chat sigue con el motor local. No se llama a ninguna API de pago ni a ningún servidor externo.

## Android — APK

**Descargar:** [última versión publicada](https://github.com/Guille-14/app-aula/releases/latest) → fichero `.apk`
(enlace fijo al último APK: `https://github.com/Guille-14/app-aula/releases/latest/download/Aula-SMR.apk`).

El APK lo compila y lo firma GitHub Actions en cada cambio (`.github/workflows/apk.yml`), así que
las versiones nuevas se instalan **encima** de la anterior sin perder nada.

- Id de paquete: `es.aula.smr.hub`. Si Android dice **conflicto de paquete**, desinstala antes cualquier Aula SMR o PWA antigua (por ejemplo `Aula-SMR-v48.apk`).
- **Widgets:** mantén pulsado el escritorio → *Widgets* → **Aula SMR** (hay 19: clase, hoy, horario, días sin clase, nota media, racha, fichas…)
- **Avisos:** en Ajustes → Avisos, pulsa «Programar avisos en el móvil» y acepta el permiso de
  *notificaciones*. A partir de ahí la tarjeta avisa de otras dos cosas que el móvil puede estar
  bloqueando y da un botón para cada una: las **alarmas a la hora exacta** (en Android 12+ van
  bloqueadas por defecto) y la **optimización de batería** (en muchos móviles corta los avisos
  en segundo plano). Con las tres cosas activas, suenan aunque la app esté cerrada y el móvil
  bloqueado. «Probar aviso» suena a los 5 segundos.
- **Compilar el APK desde este repositorio:** receta completa en [`apk-overlay/README.md`](apk-overlay/README.md) (Capacitor + `apk-overlay/apply.py` + Gradle, y cómo firmarlo y publicarlo).
- Sin APK también funciona: instálala como PWA desde Chrome (ver abajo).

## Instalar como PWA (sin APK)

Sírvela por HTTP desde tu ordenador (solo para instalarla; después funciona sin conexión).
No abras `index.html` como archivo (`file://`).

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

En el móvil, misma Wi‑Fi: `http://IP-DEL-PC:8080`.

- **Android (Chrome):** menú ⋮ → Instalar aplicación.
- **iPhone (Safari):** Compartir → Añadir a pantalla de inicio.

## Datos

- **Exportar JSON** / **Importar** en Ajustes.
- **Al borrar una nota** se pide confirmación y se borra del todo (ya no hay papelera); en Ajustes tienes **«Deshacer el último borrado»** (guarda los últimos 20 cambios).
- **Borrar todo** pide confirmación dentro de la app y borra también las copias automáticas (hay un botón aparte para borrar solo las copias).
- Copia automática: cada 6 h se guarda una copia del estado anterior (`aula.smr.v4.bak`) y se puede recuperar desde Ajustes.
- Las fotos de las notas se reducen antes de guardarse y viven en **IndexedDB**, no dentro del estado.
## Horario y calendario del centro

- El **horario es el del centro**: L–V con los 7 tramos reales, el aula de cada clase y la
  **plantilla que cambia sola** en septiembre y junio (entrada a las **16:00**) y el resto del
  curso a las **15:10** (y hasta las 22:15). Se cambia al abrir la app, cada 15 s y al volver del segundo plano.
- El horario solo enseña clase **los días que toca**: si es festivo, vacaciones, fin de semana o
  el curso no ha empezado, ese día sale en blanco con el motivo.
- La pestaña **Calendario** del Horario es el **calendario escolar 2026-27** (septiembre a junio):
  días lectivos, festivos con su nombre, vacaciones y las fechas de inicio y fin de curso.
- Puedes exportar todo a **.ics** (clases semanales + festivos y vacaciones) desde Ajustes.

## Asistente (Ollama local, opcional)

El chat responde **sin red** con tus apuntes, tu horario y tu calendario. Si tienes Ollama
en tu ordenador (`ollama serve`, puerto `11434`), escribe su dirección en
**Más → Datos locales → Ollama** y el chat tirará de tu modelo. Hay un botón
«Probar conexión» que dice si responde y cuántos modelos ve; si no responde, se sigue usando
el motor local. Nada sale de tu red.
