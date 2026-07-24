package com.senal.tv.util

import android.content.Context
import android.os.Build
import android.provider.Settings
import dagger.hilt.android.qualifiers.ApplicationContext
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Stable per-install device identity for X-Device-Id / X-Device-Name headers.
 */
@Singleton
class DeviceIdentity @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val prefs by lazy {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    }

    val deviceId: String by lazy {
        prefs.getString(KEY_ID, null) ?: generateAndPersist()
    }

    val deviceName: String by lazy {
        val model = Build.MODEL?.takeIf { it.isNotBlank() } ?: "AndroidTV"
        val manufacturer = Build.MANUFACTURER?.takeIf { it.isNotBlank() } ?: "Unknown"
        "$manufacturer $model".trim().take(64)
    }

    private fun generateAndPersist(): String {
        val androidId = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ANDROID_ID,
        )
        val uuid = if (!androidId.isNullOrBlank() && androidId != "9774d56d682e549c") {
            UUID.nameUUIDFromBytes(androidId.toByteArray()).toString()
        } else {
            UUID.randomUUID().toString()
        }
        prefs.edit().putString(KEY_ID, uuid).apply()
        return uuid
    }

    companion object {
        private const val PREFS = "senal_device"
        private const val KEY_ID = "device_id"
    }
}
