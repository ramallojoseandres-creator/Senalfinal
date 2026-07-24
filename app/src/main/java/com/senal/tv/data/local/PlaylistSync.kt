package com.senal.tv.data.local

import android.content.Context
import com.senal.tv.BuildConfig
import com.senal.tv.util.TokenStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.ByteArrayInputStream
import java.io.File
import java.util.zip.GZIPInputStream
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Downloads the authenticated M3U playlist used by SEÑAL 1.8.4:
 *   GET {baseUrl}playlist.m3u
 *   Authorization: Bearer <jwt>
 *
 * Caches the raw payload for offline boot.
 */
@Singleton
class PlaylistSync @Inject constructor(
    @ApplicationContext private val context: Context,
    private val tokenStore: TokenStore,
    private val okHttpClient: OkHttpClient,
) {
    data class SyncResult(
        val source: String,
        val channels: Int,
        val updated: Boolean,
        val error: String? = null,
        val entries: List<M3uEntry> = emptyList(),
    )

    private val cacheFile: File
        get() = File(context.filesDir, "playlist.m3u")

    fun hasLocalCache(): Boolean = cacheFile.exists() && cacheFile.length() > 32L

    suspend fun loadLocalOnly(): SyncResult = withContext(Dispatchers.IO) {
        if (!hasLocalCache()) {
            return@withContext SyncResult("empty", 0, false, error = "Sin caché local")
        }
        val text = cacheFile.readText()
        val entries = M3uParser.parse(text)
        SyncResult("cache", entries.size, false, entries = entries)
    }

    suspend fun refreshFromServer(): SyncResult = withContext(Dispatchers.IO) {
        val token = tokenStore.getToken()
        if (token.isNullOrBlank()) {
            return@withContext SyncResult("auth", 0, false, error = "Sesión requerida")
        }

        val url = BuildConfig.BASE_URL.trimEnd('/') + "/playlist.m3u"
        val request = Request.Builder()
            .url(url)
            .header("Authorization", "Bearer $token")
            .header("Accept", "audio/x-mpegurl, application/vnd.apple.mpegurl, text/plain, */*")
            .get()
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    return@withContext SyncResult(
                        source = "network",
                        channels = 0,
                        updated = false,
                        error = "HTTP ${response.code}: no se pudo descargar playlist",
                    )
                }
                val rawBytes = response.body?.bytes() ?: ByteArray(0)
                if (rawBytes.isEmpty()) {
                    return@withContext SyncResult("network", 0, false, error = "Playlist vacía")
                }

                val text = decodePlaylistBody(rawBytes)
                if (looksLikeHtml(text)) {
                    return@withContext SyncResult(
                        source = "network",
                        channels = 0,
                        updated = false,
                        error = "El servidor devolvió HTML en vez de M3U (¿token inválido?)",
                    )
                }

                cacheFile.writeText(text)
                val entries = M3uParser.parse(text)
                SyncResult(
                    source = "network",
                    channels = entries.size,
                    updated = true,
                    entries = entries,
                )
            }
        } catch (t: Throwable) {
            val fallback = loadLocalOnly()
            if (fallback.channels > 0) {
                fallback.copy(error = t.message)
            } else {
                SyncResult("network", 0, false, error = t.message ?: "Error de red")
            }
        }
    }

    suspend fun ensureCatalogReady(forceNetwork: Boolean = false): SyncResult {
        if (!forceNetwork && hasLocalCache()) {
            val local = loadLocalOnly()
            if (local.channels > 0) return local
        }
        return refreshFromServer()
    }

    private fun decodePlaylistBody(bytes: ByteArray): String {
        val gzip = bytes.size >= 2 && bytes[0] == 0x1f.toByte() && bytes[1] == 0x8b.toByte()
        val stream = if (gzip) GZIPInputStream(ByteArrayInputStream(bytes)) else ByteArrayInputStream(bytes)
        return stream.bufferedReader(Charsets.UTF_8).use { it.readText() }
    }

    private fun looksLikeHtml(text: String): Boolean {
        val head = text.trimStart().take(64).lowercase()
        return head.startsWith("<!doctype") || head.startsWith("<html")
    }
}
