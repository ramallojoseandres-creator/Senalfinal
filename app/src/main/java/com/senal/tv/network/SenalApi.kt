package com.senal.tv.network

import com.senal.tv.data.model.AuthRequestDto
import com.senal.tv.data.model.AuthResponseDto
import com.senal.tv.data.model.HealthResponseDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

/**
 * Backend contract aligned with SEÑAL TV 1.8.4 / senal-server.
 * Catalog content is served as authenticated M3U at /playlist.m3u (see PlaylistSync).
 */
interface SenalApi {

    @GET("api/health")
    suspend fun health(): HealthResponseDto

    @POST("api/auth/login")
    suspend fun login(@Body body: AuthRequestDto): AuthResponseDto
}
