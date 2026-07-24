package com.senal.tv.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Single-row cache of the serialized /API/catalog payload.
 * Offline-first: UI always hydrates from Room first, then refreshes from network.
 */
@Entity(tableName = "catalog_cache")
data class CatalogEntity(
    @PrimaryKey val id: Int = SINGLETON_ID,
    val jsonPayload: String,
    val cachedAtEpochMs: Long,
) {
    companion object {
        const val SINGLETON_ID = 1
    }
}

@Entity(tableName = "channel_cache")
data class ChannelEntity(
    @PrimaryKey val id: String,
    val name: String,
    val number: Int,
    val logoUrl: String?,
    val streamUrl: String,
    val category: String,
    val epgNow: String?,
    val sortOrder: Int,
)

@Entity(tableName = "vod_cache")
data class VodEntity(
    @PrimaryKey val id: String,
    val title: String,
    val posterUrl: String?,
    val streamUrl: String,
    val description: String?,
    val category: String,
    val sortOrder: Int,
)
