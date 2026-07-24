package com.senal.tv.util

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.tokenDataStore by preferencesDataStore(name = "senal_auth")

@Singleton
class TokenStore @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val key = stringPreferencesKey("bearer_token")

    val tokenFlow: Flow<String?> = context.tokenDataStore.data.map { it[key] }

    suspend fun getToken(): String? = tokenFlow.first()

    suspend fun setToken(token: String?) {
        context.tokenDataStore.edit { prefs ->
            if (token.isNullOrBlank()) {
                prefs.remove(key)
            } else {
                prefs[key] = token
            }
        }
    }
}
