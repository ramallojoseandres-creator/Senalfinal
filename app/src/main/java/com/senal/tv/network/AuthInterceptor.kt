package com.senal.tv.network

import android.os.Build
import com.senal.tv.util.DeviceIdentity
import com.senal.tv.util.TokenStore
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Injects auth + device fingerprint headers expected by senal-server 2.0.x:
 * - Authorization: Bearer <token>
 * - X-Device-Id
 * - X-Device-Name
 * - X-Device-Platform: android-tv
 * - X-Device-Fingerprint
 *
 * CORS Allow-Headers on the backend confirms these names (not X-Platform).
 */
@Singleton
class AuthInterceptor @Inject constructor(
    private val tokenStore: TokenStore,
    private val deviceIdentity: DeviceIdentity,
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()
        val token = runBlocking { tokenStore.getToken() }

        val builder = original.newBuilder()
            .header(HEADER_DEVICE_ID, deviceIdentity.deviceId)
            .header(HEADER_DEVICE_NAME, deviceIdentity.deviceName)
            .header(HEADER_DEVICE_PLATFORM, PLATFORM_ANDROID_TV)
            .header(HEADER_DEVICE_FINGERPRINT, deviceIdentity.deviceId)
            .header("Accept", "application/json")
            .header("User-Agent", "Senal-AndroidTV/${Build.VERSION.RELEASE}")

        if (!token.isNullOrBlank()) {
            builder.header(HEADER_AUTHORIZATION, "Bearer $token")
        }

        return chain.proceed(builder.build())
    }

    companion object {
        const val HEADER_AUTHORIZATION = "Authorization"
        const val HEADER_DEVICE_ID = "X-Device-Id"
        const val HEADER_DEVICE_NAME = "X-Device-Name"
        const val HEADER_DEVICE_PLATFORM = "X-Device-Platform"
        const val HEADER_DEVICE_FINGERPRINT = "X-Device-Fingerprint"
        const val PLATFORM_ANDROID_TV = "android-tv"
    }
}
