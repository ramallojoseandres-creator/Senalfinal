package com.senal.tv.data.repository

import com.senal.tv.network.SenalApi
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class EpgRepository @Inject constructor(
    private val api: SenalApi,
) {
    /**
     * Best-effort EPG lookup. Returns "No información" on any failure.
     */
    suspend fun currentProgram(channelId: String, fallback: String?): String {
        return try {
            val map = api.epg(channelId)
            map["title"]
                ?: map["name"]
                ?: map["now"]
                ?: map["programme"]
                ?: map["epg"]
                ?: fallback?.takeIf { it.isNotBlank() }
                ?: NO_INFO
        } catch (_: Exception) {
            fallback?.takeIf { it.isNotBlank() } ?: NO_INFO
        }
    }

    companion object {
        const val NO_INFO = "No información"
    }
}
