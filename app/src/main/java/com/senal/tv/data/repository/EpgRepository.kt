package com.senal.tv.data.repository

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class EpgRepository @Inject constructor() {
    suspend fun currentProgram(channelId: String, fallback: String?): String {
        return fallback?.takeIf { it.isNotBlank() } ?: NO_INFO
    }

    companion object {
        const val NO_INFO = "No información"
    }
}
