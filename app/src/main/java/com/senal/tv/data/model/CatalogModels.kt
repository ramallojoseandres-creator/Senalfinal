package com.senal.tv.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Flexible DTOs that tolerate common IPTV catalog shapes from /API/catalog.
 * Field aliases keep us resilient to snake_case / camelCase backends.
 */
@Serializable
data class CatalogResponseDto(
    val categories: List<CategoryDto> = emptyList(),
    val channels: List<ChannelDto> = emptyList(),
    val live: List<ChannelDto> = emptyList(),
    val vod: List<VodItemDto> = emptyList(),
    val movies: List<VodItemDto> = emptyList(),
    @SerialName("live_tv") val liveTv: List<ChannelDto> = emptyList(),
)

@Serializable
data class CategoryDto(
    val id: String? = null,
    val name: String = "",
    val type: String? = null,
    val items: List<ChannelDto> = emptyList(),
    val channels: List<ChannelDto> = emptyList(),
)

@Serializable
data class ChannelDto(
    val id: String? = null,
    @SerialName("channel_id") val channelId: String? = null,
    val name: String = "",
    val title: String? = null,
    val number: Int? = null,
    @SerialName("channel_number") val channelNumber: Int? = null,
    val logo: String? = null,
    @SerialName("logo_url") val logoUrl: String? = null,
    @SerialName("stream_url") val streamUrl: String? = null,
    val url: String? = null,
    val stream: String? = null,
    val category: String? = null,
    @SerialName("category_name") val categoryName: String? = null,
    val epg: String? = null,
    @SerialName("epg_now") val epgNow: String? = null,
    @SerialName("now_playing") val nowPlaying: String? = null,
)

@Serializable
data class VodItemDto(
    val id: String? = null,
    val name: String = "",
    val title: String? = null,
    val poster: String? = null,
    @SerialName("poster_url") val posterUrl: String? = null,
    @SerialName("stream_url") val streamUrl: String? = null,
    val url: String? = null,
    val description: String? = null,
    val category: String? = null,
)

@Serializable
data class HealthResponseDto(
    val status: String? = null,
    val ok: Boolean? = null,
    val uptime: Double? = null,
    val message: String? = null,
)

@Serializable
data class AuthRequestDto(
    val username: String? = null,
    val password: String? = null,
    val token: String? = null,
)

@Serializable
data class AuthResponseDto(
    val token: String? = null,
    @SerialName("access_token") val accessToken: String? = null,
    @SerialName("jwt") val jwt: String? = null,
)

/** Domain models used by UI / player layers. */
data class Channel(
    val id: String,
    val name: String,
    val number: Int,
    val logoUrl: String?,
    val streamUrl: String,
    val category: String,
    val epgNow: String?,
    val isFavorite: Boolean = false,
)

data class VodItem(
    val id: String,
    val title: String,
    val posterUrl: String?,
    val streamUrl: String,
    val description: String?,
    val category: String,
)

data class Catalog(
    val live: List<Channel>,
    val vod: List<VodItem>,
    val categories: List<String>,
    val fromCache: Boolean = false,
)

fun CatalogResponseDto.toDomain(favorites: Set<String> = emptySet()): Catalog {
    val liveFromCategories = categories
        .filter { cat ->
            val type = cat.type?.lowercase().orEmpty()
            type.contains("live") || type.contains("vivo") ||
                cat.name.contains("vivo", ignoreCase = true) ||
                cat.name.contains("live", ignoreCase = true)
        }
        .flatMap { it.items.ifEmpty { it.channels } }

    val mergedLive = (live + liveTv + channels + liveFromCategories)
        .mapIndexedNotNull { index, dto -> dto.toChannel(index + 1, favorites) }
        .distinctBy { it.id }

    val mergedVod = (vod + movies)
        .mapIndexedNotNull { index, dto -> dto.toVod(index) }
        .distinctBy { it.id }

    val categoryNames = buildList {
        add("VIVO")
        add("VOD")
        categories.map { it.name }.filter { it.isNotBlank() }.forEach { add(it) }
        mergedLive.map { it.category }.filter { it.isNotBlank() }.forEach { add(it) }
    }.distinct()

    return Catalog(
        live = mergedLive.sortedBy { it.number },
        vod = mergedVod,
        categories = categoryNames,
    )
}

private fun ChannelDto.toChannel(fallbackNumber: Int, favorites: Set<String>): Channel? {
    val resolvedId = id ?: channelId ?: streamUrl ?: url ?: return null
    val resolvedUrl = streamUrl ?: url ?: stream ?: return null
    val resolvedName = name.ifBlank { title.orEmpty() }.ifBlank { "Canal $fallbackNumber" }
    val resolvedNumber = number ?: channelNumber ?: fallbackNumber
    val resolvedLogo = logo ?: logoUrl
    val resolvedCategory = category ?: categoryName ?: "VIVO"
    val resolvedEpg = epgNow ?: nowPlaying ?: epg
    return Channel(
        id = resolvedId,
        name = resolvedName,
        number = resolvedNumber,
        logoUrl = resolvedLogo,
        streamUrl = resolvedUrl,
        category = resolvedCategory,
        epgNow = resolvedEpg,
        isFavorite = favorites.contains(resolvedId),
    )
}

private fun VodItemDto.toVod(index: Int): VodItem? {
    val resolvedId = id ?: streamUrl ?: url ?: "vod-$index"
    val resolvedUrl = streamUrl ?: url ?: return null
    val resolvedTitle = title ?: name.ifBlank { "Contenido ${index + 1}" }
    return VodItem(
        id = resolvedId,
        title = resolvedTitle,
        posterUrl = poster ?: posterUrl,
        streamUrl = resolvedUrl,
        description = description,
        category = category ?: "VOD",
    )
}
