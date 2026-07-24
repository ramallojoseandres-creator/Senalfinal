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
 * Matches SEÑAL TV 1.8.4 auth wiring:
 * - Authorization: Bearer <token> (when present)
 * - Accept: application/json
 *
 * Also sends device headers accepted by senal-server CORS
 * (X-Device-Id / Name / Platform / Fingerprint) for login + device binding.
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
            .header("Accept", "application/json")
            .header("User-Agent", "SEÑAL-TV/1.8.4 (Android; ${Build.MODEL})")
            .header(HEADER_DEVICE_ID, deviceIdentity.deviceId)
            .header(HEADER_DEVICE_NAME, deviceIdentity.deviceName)
            .header(HEADER_DEVICE_PLATFORM, PLATFORM_ANDROID_TV)
            .header(HEADER_DEVICE_FINGERPRINT, deviceIdentity.deviceId)

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
