# Aula SMR

App de estudio para **2.º SMR 2026/27** (Sistemas Microinformáticos y Redes).  
Diseño tipo **SMR Hub**. **100 % local**: sin cuenta y sin nube. Los datos se quedan en el dispositivo (`localStorage`).

## Android — APK

**Descargar:** [última versión publicada](https://github.com/Guille-14/app-aula/releases/latest) → fichero `.apk`.

- Id de paquete: `es.aula.smr.hub`. Si Android dice **conflicto de paquete**, desinstala antes cualquier Aula SMR o PWA antigua (por ejemplo `Aula-SMR-v48.apk`).
- **Widgets:** mantén pulsado el escritorio → *Widgets* → **Aula SMR** (hay 24: clase, examen, hoy, nota media, racha…).
- **Compilar el APK desde este repositorio:** receta completa en [`apk-overlay/README.md`](apk-overlay/README.md) (Capacitor + `apk-overlay/apply.py` + Gradle, y cómo firmarlo y publicarlo).
- Sin APK también funciona: instálala como PWA desde Chrome (ver abajo).

## Instalar como PWA (sin APK)

Sírvela por HTTP. No abras `index.html` como archivo (`file://`).

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

En el móvil, misma Wi‑Fi: `http://IP-DEL-PC:8080`.

- **Android (Chrome):** menú ⋮ → Instalar aplicación.
- **iPhone (Safari):** Compartir → Añadir a pantalla de inicio.

## Datos

- **Exportar JSON** / **Importar** en Ajustes.
- **Borrar todo** pide confirmación dentro de la app y borra también las copias automáticas (hay un botón aparte para borrar solo las copias).
- Copia automática: cada 6 h se guarda una copia del estado anterior (`aula.smr.v4.bak`) y se puede recuperar desde Ajustes.
- Las fotos de las notas se reducen antes de guardarse para no llenar el almacén del móvil.
- `server.py` es opcional (sync en casa). Ollama solo si pones la URL en Servidor (Más).
