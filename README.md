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

**Descargar:** [última versión publicada](https://github.com/Guille-14/app-aula/releases/latest) → fichero `.apk`.

- Id de paquete: `es.aula.smr.hub`. Si Android dice **conflicto de paquete**, desinstala antes cualquier Aula SMR o PWA antigua (por ejemplo `Aula-SMR-v48.apk`).
- **Widgets:** mantén pulsado el escritorio → *Widgets* → **Aula SMR** (hay 24: clase, examen, hoy, nota media, racha…).
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
## Asistente (Ollama local, opcional)

El chat responde **sin red** con tus apuntes, tu horario y tu calendario. Si tienes Ollama
en tu ordenador (`ollama serve`, puerto `11434`), escribe su dirección en
**Más → Datos locales → Ollama** y el chat tirará de tu modelo. Hay un botón
«Probar conexión» que dice si responde y cuántos modelos ve; si no responde, se sigue usando
el motor local. Nada sale de tu red.
