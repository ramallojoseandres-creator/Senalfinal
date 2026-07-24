# Señal — Android TV IPTV

Cliente Android alineado con **SEÑAL TV 1.8.4**
([release Fusor](https://github.com/ramallojoseandres-creator/Fusor/releases/tag/senal-1.8.4))
y **senal-server** en `http://185.192.20.245:3000/`.

## Contrato con el servidor (igual que 1.8.4)

| Endpoint | Uso |
|---|---|
| `GET /api/health` | Health check |
| `POST /api/auth/login` | `{ username, password, deviceId, deviceName }` → JWT |
| `GET /playlist.m3u` | Catálogo M3U autenticado (`Authorization: Bearer`) |

Flujo:
1. Login TV → guarda JWT
2. Descarga `/playlist.m3u` con Bearer
3. Parsea M3U → Room (offline-first)
4. Reproduce streams con Media3 (zapping sin recrear player)

## Build

```bash
./gradlew assembleDebug
```

APK: `app/build/outputs/apk/debug/app-debug.apk`

CI: `.github/workflows/build-apk.yml` → artifact `senal-debug-apk`
