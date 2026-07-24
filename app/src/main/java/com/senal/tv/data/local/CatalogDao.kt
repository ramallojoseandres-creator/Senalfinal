package com.senal.tv.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import kotlinx.coroutines.flow.Flow

@Dao
interface CatalogDao {

    @Query("SELECT * FROM catalog_cache WHERE id = 1 LIMIT 1")
    fun observeCatalogPayload(): Flow<CatalogEntity?>

    @Query("SELECT * FROM catalog_cache WHERE id = 1 LIMIT 1")
    suspend fun getCatalogPayload(): CatalogEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertCatalogPayload(entity: CatalogEntity)

    @Query("SELECT * FROM channel_cache ORDER BY sortOrder ASC, number ASC")
    fun observeChannels(): Flow<List<ChannelEntity>>

    @Query("SELECT * FROM channel_cache ORDER BY sortOrder ASC, number ASC")
    suspend fun getChannels(): List<ChannelEntity>

    @Query("SELECT * FROM vod_cache ORDER BY sortOrder ASC")
    fun observeVod(): Flow<List<VodEntity>>

    @Query("SELECT * FROM vod_cache ORDER BY sortOrder ASC")
    suspend fun getVod(): List<VodEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertChannels(channels: List<ChannelEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertVod(items: List<VodEntity>)

    @Query("DELETE FROM channel_cache")
    suspend fun clearChannels()

    @Query("DELETE FROM vod_cache")
    suspend fun clearVod()

    @Transaction
    suspend fun replaceCatalog(
        payload: CatalogEntity,
        channels: List<ChannelEntity>,
        vod: List<VodEntity>,
    ) {
        upsertCatalogPayload(payload)
        clearChannels()
        clearVod()
        upsertChannels(channels)
        upsertVod(vod)
    }
}
