# Clave de firma del APK

`aula-srm.p12` es la clave con la que se firman los APK de Aula SMR.

- Tipo: PKCS#12 · alias `aula` · RSA 2048 · válida 30 años
- Contraseña: `aula-smr-2026` (la misma para el almacén y para la clave)
- Certificado: `C=ES, O=Aula SMR, CN=Aula SMR`

## ¿Por qué está aquí dentro y no en un sitio secreto?

Porque **es lo que permite actualizar la app sin desinstalarla**. Android solo acepta
instalar un APK encima de otro si va firmado con la *misma* clave. Si cada compilación
usara una clave nueva (lo que pasa con los APK de depuración), cada versión obligaría a
desinstalar la anterior y a recuperar los datos a mano desde una copia JSON.

Guardarla en un repositorio **privado** es la forma más simple de que tú (o GitHub Actions,
que compila el APK) tengáis siempre la misma clave. Es una app personal y auto-firmada: no
hay ninguna tienda ni terceros de por medio.

## Aviso importante

**Si algún día haces público este repositorio, avisa para cambiar esto**: cualquiera con
esta clave podría firmar un APK falso que Android aceptaría como una actualización de Aula
SMR. La alternativa segura (y equivalente) es guardar la clave en *GitHub Secrets*, que este
token no puede crear. Se haría así, en dos minutos y sin tocar el código:

```bash
# En tu ordenador, con la clave delante:
base64 -w0 aula-srm.p12 > clave.txt
gh secret set AULA_KEYSTORE_B64 --repo Guille-14/app-aula < clave.txt
gh secret set AULA_STORE_PASS   --repo Guille-14/app-aula   # pega la contraseña
gh secret set AULA_KEY_PASS     --repo Guille-14/app-aula   # la misma
gh secret set AULA_KEY_ALIAS    --repo Guille-14/app-aula   # aula
```

Y en el flujo `.github/workflows/apk.yml`, antes de compilar:

```yaml
- name: Clave desde Secrets
  run: |
    echo "${{ secrets.AULA_KEYSTORE_B64 }}" | base64 -d > apk-overlay/keystore/aula-srm.p12
  env:
    AULA_STORE_PASS: ${{ secrets.AULA_STORE_PASS }}
```

El script `apk-overlay/preparar-gradle.py` ya lee `AULA_KEYSTORE`, `AULA_KEY_ALIAS`,
`AULA_STORE_PASS` y `AULA_KEY_PASS` del entorno si existen, así que no hay que cambiar nada más.

## ¿Cómo sé que un APK es mío?

El SHA-256 del certificado aparece en la página de cada *Release* y se puede comprobar:

```bash
# Con el APK descargado y el SDK de Android instalado:
apksigner verify --print-certs Aula-SMR-v54.apk

# O sin herramientas, directo del almacén:
keytool -list -v -keystore apk-overlay/keystore/aula-srm.p12 -storepass aula-smr-2026
```

Debe coincidir con el que muestra la Release y con el de la app ya instalada
(`Ajustes → Aplicaciones → Aula SMR` no lo muestra, pero `apksigner` sí).
