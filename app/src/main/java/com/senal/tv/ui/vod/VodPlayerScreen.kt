package com.senal.tv.ui.vod

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.tv.material3.Text
import com.senal.tv.data.repository.CatalogRepository
import com.senal.tv.player.SenalExoPlayer
import com.senal.tv.ui.components.PlayerSurface
import com.senal.tv.ui.theme.SenalBlack
import com.senal.tv.ui.theme.SenalOnDark
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class VodPlayerUiState(
    val title: String = "",
    val ready: Boolean = false,
)

@HiltViewModel
class VodPlayerViewModel @Inject constructor(
    private val catalogRepository: CatalogRepository,
    val senalPlayer: SenalExoPlayer,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {
    private val vodId: String = checkNotNull(savedStateHandle["vodId"])

    private val _uiState = MutableStateFlow(VodPlayerUiState())
    val uiState: StateFlow<VodPlayerUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            catalogRepository.warmCacheOrNetwork()
            catalogRepository.catalogFlow.collect { catalog ->
                val item = catalog.vod.firstOrNull { it.id == vodId } ?: return@collect
                senalPlayer.zapTo(item.streamUrl, item.id)
                _uiState.update { it.copy(title = item.title, ready = true) }
            }
        }
    }
}

@Composable
fun VodPlayerScreen(
    viewModel: VodPlayerViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) {
        // Keep playing when entering VOD
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SenalBlack),
    ) {
        PlayerSurface(
            senalPlayer = viewModel.senalPlayer,
            modifier = Modifier.fillMaxSize(),
            showController = true,
        )
        if (state.title.isNotBlank()) {
            Text(
                text = state.title,
                color = SenalOnDark,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .padding(28.dp),
            )
        }
    }
}
