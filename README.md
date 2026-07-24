# Señal — Android TV IPTV

App IPTV premium para Android TV construida con **Jetpack Compose for TV**, arquitectura offline-first (Room + Retrofit), reproductor Media3 con zapping seamless y CI en GitHub Actions.

## Backend

Base URL: `http://185.192.20.245:3000/`

| Endpoint | Uso |
|---|---|
| `GET /API/health` | Health check reactivo (banner “Reconectando…”) |
| `GET /API/catalog` | Catálogo live/VOD cacheado en Room |
| `POST /API/auth/login` | Token Bearer (opcional) |
| `GET /API/epg/{channelId}` | EPG actual del OSD |

Headers inyectados por `AuthInterceptor`:

- `Authorization: Bearer <token>`
- `X-Device-Id`
- `X-Device-Name`
- `X-Platform: android-tv`

## Arquitectura

```
app/src/main/java/com/senal/tv/
├── di/            # Hilt (OkHttp, Retrofit, Room)
├── network/       # SenalApi + AuthInterceptor
├── data/
│   ├── local/     # Room entities/DAO
│   ├── model/     # DTOs + domain
│   └── repository/# Catalog / Health / EPG
├── player/        # SenalExoPlayer (Media3, zap sin recreate)
├── ui/
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
