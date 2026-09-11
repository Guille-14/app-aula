# Aula SMR

App de estudio para **2.º SMR 2026/27** (Sistemas Microinformáticos y Redes).  
Diseño tipo **SMR Hub**. **100 % local**: sin cuenta y sin nube. Los datos se quedan en el dispositivo (`localStorage`).

## Android — APK

El archivo **`Aula-SMR-v48.apk`** está en esta carpeta. Pásalo al móvil e instálalo (hay que permitir *orígenes desconocidos*).

Id: `es.aula.smr.hub` (v48). Si Android dice **conflicto de paquete**, desinstala antes cualquier Aula SMR o PWA antigua. Widgets: Ajustes → Widgets del escritorio.

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
- **Borrar todo** pide confirmación nativa (y ofrece copia).
- `server.py` es opcional (sync en casa). Ollama solo si pones la URL en Servidor (Más).
