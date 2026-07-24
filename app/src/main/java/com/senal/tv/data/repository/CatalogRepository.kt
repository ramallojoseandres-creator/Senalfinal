package com.senal.tv.data.repository

import com.senal.tv.data.local.CatalogDao
import com.senal.tv.data.local.CatalogEntity
import com.senal.tv.data.local.ChannelEntity
import com.senal.tv.data.local.M3uEntry
import com.senal.tv.data.local.M3uParser
import com.senal.tv.data.local.PlaylistSync
import com.senal.tv.data.local.VodEntity
import com.senal.tv.data.model.Catalog
import com.senal.tv.data.model.Channel
import com.senal.tv.data.model.VodItem
import com.senal.tv.util.FavoritesStore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Offline-first catalog backed by the same source as SEÑAL TV 1.8.4:
 * authenticated `GET /playlist.m3u` → Room cache.
 */
@Singleton
class CatalogRepository @Inject constructor(
    private val playlistSync: PlaylistSync,
    private val catalogDao: CatalogDao,
    private val favoritesStore: FavoritesStore,
    private val authRepository: AuthRepository,
) {

    val catalogFlow: Flow<Catalog> = combine(
        catalogDao.observeChannels(),
        catalogDao.observeVod(),
        favoritesStore.favorites,
    ) { channels, vod, favorites ->
        Catalog(
            live = channels.map { it.toDomain(favorites) },
            vod = vod.map { it.toDomain() },
            categories = buildList {
                add("VIVO")
                add("VOD")
                channels.map { it.category }.filter { it.isNotBlank() }.distinct().forEach { add(it) }
            }.distinct(),
            fromCache = true,
        )
    }.distinctUntilChanged()

    suspend fun refresh(forceNetwork: Boolean = true): Result<Catalog> = withContext(Dispatchers.IO) {
        runCatching {
            val sync = if (forceNetwork) {
                playlistSync.refreshFromServer()
            } else {
                playlistSync.ensureCatalogReady(forceNetwork = false)
            }

            if (sync.entries.isEmpty()) {
                // Try local cache before failing hard
                val local = playlistSync.loadLocalOnly()
                if (local.entries.isEmpty()) {
                    if (sync.error?.contains("Sesión", ignoreCase = true) == true) {
                        authRepository.invalidateSession()
                    }
                    error(sync.error ?: "Playlist vacía")
                }
                persistEntries(local.entries)
                return@runCatching toCatalog(local.entries, fromCache = true)
            }

            persistEntries(sync.entries)
            toCatalog(sync.entries, fromCache = sync.source == "cache")
        }
    }

    suspend fun warmCacheOrNetwork(): Catalog = withContext(Dispatchers.IO) {
        val cached = loadFromRoom()
        if (cached != null && cached.live.isNotEmpty()) {
            // Background refresh; ignore failures
            runCatching { refresh(forceNetwork = true) }
            return@withContext cached
        }
        refresh(forceNetwork = true).getOrElse {
            cached ?: Catalog(
                live = emptyList(),
                vod = emptyList(),
                categories = listOf("VIVO", "VOD"),
                fromCache = true,
            )
        }
    }

    private suspend fun loadFromRoom(): Catalog? {
        val channels = catalogDao.getChannels()
        val vod = catalogDao.getVod()
        if (channels.isEmpty() && vod.isEmpty()) return null
        val favSet = favoritesStore.favorites.first()
        return Catalog(
            live = channels.map { it.toDomain(favSet) },
            vod = vod.map { it.toDomain() },
            categories = listOf("VIVO", "VOD"),
            fromCache = true,
        )
    }

    private suspend fun persistEntries(entries: List<M3uEntry>) {
        val favorites = favoritesStore.favorites.first()
        val live = ArrayList<ChannelEntity>()
        val vod = ArrayList<VodEntity>()

        entries.forEachIndexed { index, entry ->
            val id = entry.tvgId?.takeIf { it.isNotBlank() }
                ?: ("m3u-" + (entry.url.hashCode().toUInt().toString(16)) + "-$index")
            val category = entry.group?.takeIf { it.isNotBlank() } ?: "VIVO"
            if (M3uParser.isVodGroup(entry.group)) {
                vod += VodEntity(
                    id = id,
                    title = entry.title,
                    posterUrl = entry.logo,
                    streamUrl = entry.url,
                    description = entry.group,
                    category = category,
                    sortOrder = index,
                )
            } else {
                live += ChannelEntity(
                    id = id,
                    name = entry.title,
                    number = entry.channelNumber ?: (index + 1),
                    logoUrl = entry.logo,
                    streamUrl = entry.url,
                    category = category,
                    epgNow = null,
                    sortOrder = index,
                )
            }
        }

        catalogDao.replaceCatalog(
            payload = CatalogEntity(
                jsonPayload = "m3u:${entries.size}",
                cachedAtEpochMs = System.currentTimeMillis(),
            ),
            channels = live,
            vod = vod,
        )
        // Touch favorites so Flow recomputes isFavorite flags
        favorites.size
    }

    private suspend fun toCatalog(entries: List<M3uEntry>, fromCache: Boolean): Catalog {
        val favSet = favoritesStore.favorites.first()
        val live = ArrayList<Channel>()
        val vod = ArrayList<VodItem>()
        entries.forEachIndexed { index, entry ->
            val id = entry.tvgId?.takeIf { it.isNotBlank() }
                ?: ("m3u-" + (entry.url.hashCode().toUInt().toString(16)) + "-$index")
            val category = entry.group?.takeIf { it.isNotBlank() } ?: "VIVO"
            if (M3uParser.isVodGroup(entry.group)) {
                vod += VodItem(
                    id = id,
                    title = entry.title,
                    posterUrl = entry.logo,
                    streamUrl = entry.url,
                    description = entry.group,
                    category = category,
                )
            } else {
                live += Channel(
                    id = id,
                    name = entry.title,
                    number = entry.channelNumber ?: (index + 1),
                    logoUrl = entry.logo,
                    streamUrl = entry.url,
                    category = category,
                    epgNow = null,
                    isFavorite = favSet.contains(id),
                )
            }
        }
        return Catalog(
            live = live.sortedBy { it.number },
            vod = vod,
            categories = buildList {
                add("VIVO")
                add("VOD")
                live.map { it.category }.distinct().forEach { add(it) }
            }.distinct(),
            fromCache = fromCache,
        )
    }

    private fun ChannelEntity.toDomain(favorites: Set<String>) = Channel(
        id = id,
        name = name,
        number = number,
        logoUrl = logoUrl,
        streamUrl = streamUrl,
        category = category,
        epgNow = epgNow,
        isFavorite = favorites.contains(id),
    )

    private fun VodEntity.toDomain() = VodItem(
        id = id,
        title = title,
        posterUrl = posterUrl,
        streamUrl = streamUrl,
        description = description,
        category = category,
    )
}
