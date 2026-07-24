package com.senal.tv.network

import com.senal.tv.data.model.AuthRequestDto
import com.senal.tv.data.model.AuthResponseDto
import com.senal.tv.data.model.CatalogResponseDto
import com.senal.tv.data.model.HealthResponseDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * Backend contract for http://185.192.20.245:3000/
 * Paths mirror the /API/ surface used by Señal.
 */
interface SenalApi {

    @GET("API/health")
    suspend fun health(): HealthResponseDto

    @GET("API/catalog")
    suspend fun catalog(): CatalogResponseDto

    @POST("API/auth/login")
    suspend fun login(@Body body: AuthRequestDto): AuthResponseDto

    @GET("API/epg/{channelId}")
    suspend fun epg(
        @Path("channelId") channelId: String,
        @Query("now") now: Boolean = true,
    ): Map<String, String?>
}
