package com.senal.tv.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [
        CatalogEntity::class,
        ChannelEntity::class,
        VodEntity::class,
    ],
    version = 1,
    exportSchema = false,
)
abstract class SenalDatabase : RoomDatabase() {
    abstract fun catalogDao(): CatalogDao
}
