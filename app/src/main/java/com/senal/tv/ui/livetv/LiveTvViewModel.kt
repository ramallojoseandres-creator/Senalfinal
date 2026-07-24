package com.senal.tv.ui.livetv

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.senal.tv.data.model.Channel
import com.senal.tv.data.repository.CatalogRepository
import com.senal.tv.data.repository.EpgRepository
import com.senal.tv.player.SenalExoPlayer
import com.senal.tv.util.FavoritesStore
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LiveTvUiState(
    val channels: List<Channel> = emptyList(),
    val currentIndex: Int = 0,
    val currentChannel: Channel? = null,
    val epgText: String = EpgRepository.NO_INFO,
    val osdVisible: Boolean = true,
    val favoriteToast: String? = null,
    val isFavorite: Boolean = false,
)

@HiltViewModel
class LiveTvViewModel @Inject constructor(
    private val catalogRepository: CatalogRepository,
    private val epgRepository: EpgRepository,
    private val favoritesStore: FavoritesStore,
    val senalPlayer: SenalExoPlayer,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val initialChannelId: String? = savedStateHandle["channelId"]

    private val _uiState = MutableStateFlow(LiveTvUiState())
    val uiState: StateFlow<LiveTvUiState> = _uiState.asStateFlow()

    private var hideOsdJob: Job? = null
    private var okHoldJob: Job? = null

    init {
        viewModelScope.launch {
            catalogRepository.catalogFlow.collect { catalog ->
                val channels = catalog.live
                if (channels.isEmpty()) {
                    _uiState.update { it.copy(channels = emptyList(), currentChannel = null) }
                    return@collect
                }
                val preferredIndex = channels.indexOfFirst { it.id == initialChannelId }
                    .takeIf { it >= 0 }
                    ?: _uiState.value.currentIndex.coerceIn(0, channels.lastIndex)
                setChannel(channels, preferredIndex, showOsd = _uiState.value.currentChannel == null)
            }
        }
        viewModelScope.launch {
            // Keep cache warm if Live is opened cold
            catalogRepository.warmCacheOrNetwork()
        }
    }

    fun zapUp() {
        val channels = _uiState.value.channels
        if (channels.isEmpty()) return
        val next = (_uiState.value.currentIndex + 1) % channels.size
        setChannel(channels, next, showOsd = true)
    }

    fun zapDown() {
        val channels = _uiState.value.channels
        if (channels.isEmpty()) return
        val next = if (_uiState.value.currentIndex - 1 < 0) {
            channels.lastIndex
        } else {
            _uiState.value.currentIndex - 1
        }
        setChannel(channels, next, showOsd = true)
    }

    fun showOsd() {
        _uiState.update { it.copy(osdVisible = true) }
        scheduleHideOsd()
    }

    fun onOkPressStart() {
        showOsd()
        okHoldJob?.cancel()
        okHoldJob = viewModelScope.launch {
            delay(OK_HOLD_MS)
            toggleFavorite()
        }
    }

    fun onOkPressEnd() {
        okHoldJob?.cancel()
        okHoldJob = null
    }

    fun toggleFavorite() {
        val channel = _uiState.value.currentChannel ?: return
        viewModelScope.launch {
            val nowFavorite = favoritesStore.toggle(channel.id)
            _uiState.update {
                it.copy(
                    isFavorite = nowFavorite,
                    favoriteToast = if (nowFavorite) "Añadido a favoritos" else "Eliminado de favoritos",
                    osdVisible = true,
                )
            }
            scheduleHideOsd()
            delay(1_800L)
            _uiState.update { state ->
                if (state.favoriteToast != null) state.copy(favoriteToast = null) else state
            }
        }
    }

    private fun setChannel(channels: List<Channel>, index: Int, showOsd: Boolean) {
        val channel = channels[index]
        // Seamless zap — never recreate ExoPlayer
        senalPlayer.zapTo(channel.streamUrl, channel.id)
        _uiState.update {
            it.copy(
                channels = channels,
                currentIndex = index,
                currentChannel = channel,
                isFavorite = channel.isFavorite,
                osdVisible = showOsd || it.osdVisible,
                epgText = channel.epgNow?.takeIf { text -> text.isNotBlank() }
                    ?: EpgRepository.NO_INFO,
            )
        }
        if (showOsd) scheduleHideOsd()
        refreshEpg(channel)
    }

    private fun refreshEpg(channel: Channel) {
        viewModelScope.launch {
            val text = epgRepository.currentProgram(channel.id, channel.epgNow)
            if (_uiState.value.currentChannel?.id == channel.id) {
                _uiState.update { it.copy(epgText = text) }
            }
        }
    }

    private fun scheduleHideOsd() {
        hideOsdJob?.cancel()
        hideOsdJob = viewModelScope.launch {
            delay(OSD_HIDE_MS)
            _uiState.update { it.copy(osdVisible = false) }
        }
    }

    companion object {
        private const val OSD_HIDE_MS = 4_000L
        private const val OK_HOLD_MS = 2_000L
    }
}
