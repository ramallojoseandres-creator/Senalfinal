package com.senal.tv.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.senal.tv.data.model.Catalog
import com.senal.tv.data.model.Channel
import com.senal.tv.data.repository.CatalogRepository
import com.senal.tv.player.SenalExoPlayer
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject

data class HomeUiState(
    val catalog: Catalog = Catalog(emptyList(), emptyList(), listOf("VIVO", "VOD")),
    val clock: String = "--:--",
    val bitrateMbps: Double = 0.0,
    val previewChannel: Channel? = null,
    val isRefreshing: Boolean = false,
    val statusMessage: String? = null,
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val catalogRepository: CatalogRepository,
    val senalPlayer: SenalExoPlayer,
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    val bitrateMbps: StateFlow<Double> = senalPlayer.bitrateMbps
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), 0.0)

    private val clockFormatter = SimpleDateFormat("HH:mm", Locale.getDefault())

    init {
        observeCatalog()
        tickClock()
        warmUp()
    }

    private fun observeCatalog() {
        viewModelScope.launch {
            catalogRepository.catalogFlow.collect { catalog ->
                _uiState.update { state ->
                    val preview = state.previewChannel
                        ?: catalog.live.firstOrNull()
                    state.copy(
                        catalog = catalog,
                        previewChannel = preview,
                        statusMessage = if (catalog.fromCache && catalog.live.isNotEmpty()) {
                            "Catálogo en caché"
                        } else {
                            null
                        },
                    )
                }
                ensurePreviewPlaying()
            }
        }
        viewModelScope.launch {
            bitrateMbps.collect { mbps ->
                _uiState.update { it.copy(bitrateMbps = mbps) }
            }
        }
    }

    private fun warmUp() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRefreshing = true) }
            catalogRepository.warmCacheOrNetwork()
            _uiState.update { it.copy(isRefreshing = false) }
            ensurePreviewPlaying()
        }
    }

    fun refresh() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRefreshing = true) }
            catalogRepository.refresh()
            _uiState.update { it.copy(isRefreshing = false) }
        }
    }

    fun selectPreview(channel: Channel) {
        _uiState.update { it.copy(previewChannel = channel) }
        senalPlayer.zapTo(channel.streamUrl, channel.id)
        senalPlayer.updateBitrateEstimate()
    }

    private fun ensurePreviewPlaying() {
        val channel = _uiState.value.previewChannel ?: return
        if (channel.streamUrl.isNotBlank()) {
            senalPlayer.zapTo(channel.streamUrl, channel.id)
        }
    }

    private fun tickClock() {
        viewModelScope.launch {
            while (true) {
                _uiState.update {
                    it.copy(clock = clockFormatter.format(Date()))
                }
                kotlinx.coroutines.delay(1_000L)
            }
        }
    }
}
