# Señal — Android TV IPTV

App IPTV premium para Android TV construida con **Jetpack Compose for TV**, arquitectura offline-first (Room + Retrofit), reproductor Media3 con zapping seamless y CI en GitHub Actions.

## Backend (senal-server 2.0.1)

Base URL: `http://185.192.20.245:3000/`

| Endpoint | Uso |
|---|---|
| `GET /api/health` | Health check (`ok`, `version`, …) |
| `POST /api/auth/login` | Login TV: `{ username, password, deviceId, deviceName, platform }` → JWT |
| `GET /api/catalog` | Catálogo (requiere `Authorization: Bearer`) |

Headers inyectados por `AuthInterceptor`:

- `Authorization: Bearer <token>`
- `X-Device-Id`
- `X-Device-Name`
- `X-Device-Platform: android-tv`
- `X-Device-Fingerprint`

## Flujo de app

1. Pantalla de **login** (usuario/contraseña del panel Señal).
2. JWT se guarda en DataStore; el catálogo se cachea en Room.
3. Si el token expira (401), la app vuelve al login sin crashear.
4. Banner turquesa “Reconectando…” si `/api/health` falla.

## Arquitectura

```
app/src/main/java/com/senal/tv/
├── di/            # Hilt (OkHttp, Retrofit, Room)
├── network/       # SenalApi + AuthInterceptor
├── data/
│   ├── local/     # Room entities/DAO
│   ├── model/     # DTOs + domain
│   └── repository/# Auth / Catalog / Health / EPG
├── player/        # SenalExoPlayer (Media3, zap sin recreate)
├── ui/
│   ├── login/     # Acceso TV
│   ├── home/      # Reloj, mini-player, LazyRow VIVO/VOD
│   ├── livetv/    # OSD + DPAD zapping + favoritos (hold OK)
│   ├── vod/
│   ├── components/# neonFocus, ReconnectBanner, LiveOsd
│   └── theme/     # Negro / #121212 / #2979FF / #00E5FF
└── util/          # DeviceIdentity, TokenStore, FavoritesStore
```

## Build local

Requisitos: JDK 17 + Android SDK 35.

```bash
echo "sdk.dir=$ANDROID_HOME" > local.properties
./gradlew assembleDebug
```

APK: `app/build/outputs/apk/debug/app-debug.apk`

## CI (GitHub Actions)

Workflow: `.github/workflows/build-apk.yml`

- Trigger: push/PR a `main` o `master`
- Java 17 + Android SDK
- `./gradlew assembleDebug`
- Artifact descargable: `senal-debug-apk`

## Controles Live TV

| Tecla | Acción |
|---|---|
| ↑ / ↓ (o CH+/CH-) | Zapping seamless |
| OK | Mostrar OSD (auto-hide 4s) |
| Hold OK 2s | Toggle favorito |
