package com.senal.tv.data.repository

import com.senal.tv.data.local.CatalogDao
import com.senal.tv.data.local.CatalogEntity
import com.senal.tv.data.local.ChannelEntity
import com.senal.tv.data.local.VodEntity
import com.senal.tv.data.model.Catalog
import com.senal.tv.data.model.CatalogResponseDto
import com.senal.tv.data.model.Channel
import com.senal.tv.data.model.VodItem
import com.senal.tv.data.model.toDomain
import com.senal.tv.network.SenalApi
import com.senal.tv.util.FavoritesStore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Offline-first catalog source of truth.
 * 1) Emit Room cache instantly
 * 2) Refresh from /API/catalog in background
 * 3) On network failure, keep serving cache — zero empty loading states
 */
@Singleton
class CatalogRepository @Inject constructor(
    private val api: SenalApi,
    private val catalogDao: CatalogDao,
    private val favoritesStore: FavoritesStore,
    private val json: Json,
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

    suspend fun refresh(): Result<Catalog> = withContext(Dispatchers.IO) {
        runCatching {
            val dto = api.catalog()
            val favSet = favoritesStore.favorites.first()
            val domain = dto.toDomain(favSet)
            persist(dto, domain)
            domain.copy(fromCache = false)
        }
    }

    suspend fun warmCacheOrNetwork(): Catalog = withContext(Dispatchers.IO) {
        val cached = loadFromRoom()
        val network = refresh()
        network.getOrElse {
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

    private suspend fun persist(dto: CatalogResponseDto, domain: Catalog) {
        val payload = CatalogEntity(
            jsonPayload = json.encodeToString(dto),
            cachedAtEpochMs = System.currentTimeMillis(),
        )
        catalogDao.replaceCatalog(
            payload = payload,
            channels = domain.live.mapIndexed { index, ch ->
                ChannelEntity(
                    id = ch.id,
                    name = ch.name,
                    number = ch.number,
                    logoUrl = ch.logoUrl,
                    streamUrl = ch.streamUrl,
                    category = ch.category,
                    epgNow = ch.epgNow,
                    sortOrder = index,
                )
            },
            vod = domain.vod.mapIndexed { index, item ->
                VodEntity(
                    id = item.id,
                    title = item.title,
                    posterUrl = item.posterUrl,
                    streamUrl = item.streamUrl,
                    description = item.description,
                    category = item.category,
                    sortOrder = index,
                )
            },
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
