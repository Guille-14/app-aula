#!/usr/bin/env bash
# Compila el APK firmado de Aula SMR.
#
#   Uso:   bash apk-overlay/build.sh
#   Salida: android/app/build/outputs/apk/release/app-release.apk
#
# Necesita: Node 20+, JDK 17, Android SDK (platform 34) y Pillow.
# Este mismo script es el que ejecuta GitHub Actions (.github/workflows/apk.yml),
# así que lo que compilas en tu casa es exactamente lo que se publica.

set -euo pipefail
cd "$(dirname "$0")/.."                     # raíz del repositorio

VERSION=$(node -p "require('./package.json').version")
CODE=$(node -e "
  const [a,b,c] = require('./package.json').version.split('.').map(Number);
  console.log(a*10000 + b*100 + c);
")
echo "== Aula SMR $VERSION (versionCode $CODE) =="

echo "-- 1/5  web que va dentro del APK"
rm -rf www && mkdir -p www
cp -r index.html manifest.webmanifest sw.js css js assets www/

echo "-- 2/5  proyecto Android (Capacitor)"
if [ ! -d android ]; then
  npm install --no-audit --no-fund --save-dev @capacitor/cli@6 @capacitor/core@6 @capacitor/android@6
  npx cap add android
fi
npx cap copy android

# Gradle necesita saber dónde está el SDK (en los runners viene en el entorno)
SDK="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
if [ -n "$SDK" ] && [ -d "$SDK" ]; then
  echo "sdk.dir=$SDK" > android/local.properties
fi

echo "-- 3/5  overlay: 24 widgets, iconos y alias"
python3 apk-overlay/apply.py android

echo "-- 4/5  versión y firma"
python3 apk-overlay/preparar-gradle.py "$VERSION" "$CODE"

echo "-- 5/5  compilando (Gradle)"
cd android
./gradlew assembleRelease --no-daemon
cd ..
APK=android/app/build/outputs/apk/release/app-release.apk
ls -la "$APK"
echo "APK listo: $APK"
