package com.senal.tv.data.repository

import com.senal.tv.network.SenalApi
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Reactive health probe against /API/health.
 * Never crashes the UI — only toggles a discrete reconnect banner.
 */
@Singleton
class HealthRepository @Inject constructor(
    private val api: SenalApi,
) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val _isOnline = MutableStateFlow(true)
    val isOnline: StateFlow<Boolean> = _isOnline.asStateFlow()

    private val _lastLatencyMs = MutableStateFlow<Long?>(null)
    val lastLatencyMs: StateFlow<Long?> = _lastLatencyMs.asStateFlow()

    init {
        startPolling()
    }

    private fun startPolling() {
        scope.launch {
            while (isActive) {
                checkOnce()
                delay(if (_isOnline.value) HEALTHY_INTERVAL_MS else RECONNECT_INTERVAL_MS)
            }
        }
    }

    suspend fun checkOnce(): Boolean {
        val started = System.currentTimeMillis()
        return try {
            val response = api.health()
            val ok = response.ok == true ||
                response.status.equals("ok", ignoreCase = true) ||
                response.status.equals("healthy", ignoreCase = true) ||
                response.status.equals("up", ignoreCase = true) ||
                // Some backends return 200 with empty/minimal body
                (response.status == null && response.ok == null)
            _isOnline.value = ok
            _lastLatencyMs.value = System.currentTimeMillis() - started
            ok
        } catch (_: Exception) {
            _isOnline.value = false
            _lastLatencyMs.value = null
            false
        }
    }

    companion object {
        private const val HEALTHY_INTERVAL_MS = 15_000L
        private const val RECONNECT_INTERVAL_MS = 4_000L
    }
}
