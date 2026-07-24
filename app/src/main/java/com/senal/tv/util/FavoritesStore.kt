package com.senal.tv.util

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.favoritesDataStore by preferencesDataStore(name = "senal_favorites")

@Singleton
class FavoritesStore @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val key = stringSetPreferencesKey("favorite_channel_ids")

    val favorites: Flow<Set<String>> = context.favoritesDataStore.data.map {
        it[key] ?: emptySet()
    }

    suspend fun toggle(channelId: String): Boolean {
        var nowFavorite = false
        context.favoritesDataStore.edit { prefs ->
            val current = prefs[key]?.toMutableSet() ?: mutableSetOf()
            nowFavorite = if (current.contains(channelId)) {
                current.remove(channelId)
                false
            } else {
                current.add(channelId)
                true
            }
            prefs[key] = current
        }
        return nowFavorite
    }

    suspend fun isFavorite(channelId: String, current: Set<String>): Boolean =
        current.contains(channelId)
}
