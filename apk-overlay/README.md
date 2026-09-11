# APK de Aula SMR — cómo se genera y cómo se publica

Esta carpeta **no es la app**: es el *overlay* que se aplica encima de un proyecto
Android de [Capacitor](https://capacitorjs.com/) para convertirlo en el Aula SMR de verdad.
`apply.py` copia dentro del proyecto:

- **24 widgets nativos** (`WidgetClase`, `WidgetHoy`, `WidgetMedia`, `WidgetMiniRacha`…):
  layouts (`layout/widget_*.xml`), descriptores (`xml/widget_*_info.xml`), los `receiver`
  del `AndroidManifest.xml` y sus textos en `strings.xml`.
- **Iconos de lanzador intercambiables**: 23 `activity-alias` (uno por cada skin/avatar:
  dragón, charizard, gengar…) con `mipmap-anydpi-v26` adaptativo. Android solo enciende uno;
  la app los cambia por código (`IconSwitch.java`).
- **Iconos dibujados a partir de los avatares** de `assets/avatars/` con Pillow (recorte
  cuadrado a sangre, sin esquinas redondeadas: las pone el lanzador).

Paquete: `es.aula.smr.hub`.

---

## 1. Compilar el APK

### Requisitos

| Herramienta | Versión | Nota |
|---|---|---|
| Node.js | 20 o superior | para Capacitor |
| JDK | 17 | lo exige el Gradle de Capacitor 6 |
| Android SDK | `platforms;android-34` + `build-tools;34.0.0` | Android Studio o `sdkmanager` |
| Python | 3.8+ con `Pillow` | `python3 -m pip install pillow` |

### Pasos

```bash
# 0. Desde la raíz del repositorio (donde está index.html)

# 1. Web que se empaqueta dentro del APK (solo lo que la app necesita)
rm -rf www && mkdir -p www
cp -r index.html manifest.webmanifest sw.js css js assets www/

# 2. Proyecto Android de Capacitor (solo la primera vez)
#    capacitor.config.json ya está en el repositorio (appId es.aula.smr.hub, webDir www),
#    así que no hace falta «npx cap init»: Capacitor lee la configuración del fichero.
npm install --save-dev @capacitor/cli@6 @capacitor/core@6 @capacitor/android@6
npx cap add android
npx cap copy android          # copia www/ dentro del proyecto Android

# 3. El overlay: widgets, iconos y alias
python3 apk-overlay/apply.py android
#    -> overlay ok 24 widgets

# 4. Compilar
cd android && ./gradlew assembleDebug
#    APK: android/app/build/outputs/apk/debug/app-debug.apk
```

> La app **no usa ningún servidor**: no hay `server.py` ni sincronización. El WebView carga
> los ficheros empaquetados en `www/` y el Service Worker se salta a propósito cuando la app
> corre dentro del APK (`isNativeShell()`), porque la caché serviría versiones viejas.

> **Ojo:** `apply.py` modifica el `AndroidManifest.xml` (quita el `LAUNCHER` de
> `MainActivity` y añade los alias y los `receiver`). Si vuelves a ejecutarlo sobre un
> manifest ya parcheado, no duplica nada: comprueba antes de escribir.

### Firmar una versión instalable de verdad

Android solo deja instalar un APK encima de otro si va firmado con la **misma clave**; si no,
dice «conflicto de paquete» y hay que desinstalar antes (perdiendo los datos, así que antes
conviene exportar la copia JSON desde Ajustes).

Este repositorio ya trae una clave de firma en `apk-overlay/keystore/` y
`apk-overlay/preparar-gradle.py` la enchufa al proyecto Android, así que los APK que genera
el flujo son **APK de release firmados**, actualizables entre versiones. Para usar otra clave
propia, basta con poner sus datos en las variables de entorno `AULA_KEYSTORE`,
`AULA_KEY_ALIAS`, `AULA_STORE_PASS` y `AULA_KEY_PASS` (ver
[`keystore/LEEME.md`](keystore/LEEME.md)).

Si prefieres firmar a mano, esto sigue valiendo:

```bash
# Una sola vez. Guarda aula.keystore en un sitio seguro y con copia: sin él no hay actualizaciones.
keytool -genkeypair -v -keystore aula.keystore -alias aula \
        -keyalg RSA -keysize 2048 -validity 10000
```

En `android/app/build.gradle`, dentro de `android { … }`:

```gradle
signingConfigs {
    release {
        storeFile file("../../aula.keystore")
        storePassword System.getenv("AULA_KEYSTORE_PASS")
        keyAlias "aula"
        keyPassword System.getenv("AULA_KEY_PASS")
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```

```bash
cd android && ./gradlew assembleRelease
#    APK firmado: android/app/build/outputs/apk/release/app-release.apk
```

---

## 1-bis. Compilarlo sin ordenador: GitHub Actions

El repositorio trae un flujo (`.github/workflows/apk.yml`) que hace **todo esto solo**:
prepara `www/`, añade el proyecto Android, aplica el overlay, firma con la clave del
repositorio, comprueba el APK y lo publica en **Releases**.

- Se lanza al tocar código de la app (en `main` y en las ramas de trabajo) y a mano desde
  la pestaña **Actions → APK → Run workflow**.
- El APK aparece en [Releases](../../releases) como `Aula-SMR-v<versión>.apk` (y una copia
  con nombre fijo, `Aula-SMR.apk`, para tener un enlace que no cambie nunca).
- La página de cada release lleva el **SHA-256** del archivo y el del certificado de firma.
- Si la publicación fallase, el APK queda igualmente como *artefacto* de la ejecución.

Con esto no hace falta instalar el JDK, el SDK ni Gradle en tu ordenador: lo compila GitHub
en sus servidores y te deja el fichero listo para descargar desde el móvil.

Localmente, el mismo trabajo se hace con un solo comando:

```bash
bash apk-overlay/build.sh
# -> android/app/build/outputs/apk/release/app-release.apk
```

## 2. Publicar el APK en GitHub (Releases)

**Usa Releases, no la carpeta del repositorio.** Motivos:

- Un fichero subido al repositorio se queda **para siempre en el historial de git** (aunque
  lo borres después, el peso sigue ahí). Los APK pesan mega­bytes y se reemplazan en cada
  versión.
- GitHub limita a **25 MB** los ficheros subidos por la web a una carpeta y **100 MB** los
  que entran por `git`. En una *release* el límite por fichero es de **2 GB**.
- La página de *releases* da un enlace directo y estable para descargar
  (`https://github.com/USUARIO/REPO/releases/latest`), ideal para pasar por WhatsApp o clase.

### Desde la web (lo más rápido, sin comandos)

1. Abre `https://github.com/Guille-14/app-aula/releases`
2. **Draft a new release**.
3. **Choose a tag** → escribe `v50` → *Create new tag on publish*.
4. Título: `Aula SMR v50 (APK)`. Descripción: qué cambia.
5. Arrastra el `.apk` al recuadro **Attach binaries…** (espera a que termine de subir).
6. **Publish release**.

> Si el APK tiene más de 25 MB, la web de *Releases* no se queja (el límite de 25 MB es solo
> para subir ficheros dentro del árbol del repositorio). Si aun así fallara, usa la línea de comandos.

### Con la línea de comandos (`gh`)

```bash
gh auth login                        # una sola vez
gh release create v50 Aula-SMR-v50.apk \
   --repo Guille-14/app-aula \
   --title "Aula SMR v50 (APK)" \
   --notes "Fotos en IndexedDB, repaso SM-2 y excepciones de horario. Id: es.aula.smr.hub"
```

Si el APK está en otra ruta, pásala tal cual: `gh release create v50 ~/Descargas/Aula-SMR.apk`.

Para añadir el APK a una release ya publicada:

```bash
gh release upload v50 Aula-SMR-v50.apk --repo Guille-14/app-aula
```

### Con `git` (no recomendado para binarios)

```bash
mkdir -p apk && cp ~/Descargas/Aula-SMR-v50.apk apk/
git add -f apk/Aula-SMR-v50.apk      # -f porque .gitignore ignora *.apk
git commit -m "chore(apk): version v50"
git push
```

Funciona, pero cada versión nueva suma su peso al historial para siempre.

---

## 3. Por qué el `.gitignore` ignora `*.apk`

Compilar genera `www/`, `android/`, `apk/*.apk` y a veces `*.keystore`. Nada de eso debe
entrar en el repositorio: el APK va en una *release* y el keystore solo en tu equipo (o en
los *secrets* de GitHub Actions). `git add -f` salta el ignore si alguna vez quieres
incluir algo a propósito.

---

## 4. Problemas típicos

| Síntoma | Causa y arreglo |
|---|---|
| «App no instalada» / «conflicto de paquete» | Ya hay un Aula SMR (o una PWA instalada) con otro firmante. Desinstálala y vuelve a instalar |
| Los widgets no aparecen | `apply.py` no se ejecutó, o se ejecutó **después** de compilar. Ejecútalo y recompila |
| `python3 apk-overlay/apply.py` dice `android dir missing` | Pásale la ruta del proyecto: `python3 apk-overlay/apply.py android` desde la raíz |
| `npx cap copy` no coge los cambios | Repite `npx cap copy android` (o `npx cap sync`) antes de compilar |
| El icono no cambia | Android solo respeta un alias a la vez; hace falta cerrar y abrir el lanzador |
| Gradle se queja del JDK | Capacitor 6 necesita JDK 17 (`JAVA_HOME` apuntando a un JDK 17, no a 21+) |
