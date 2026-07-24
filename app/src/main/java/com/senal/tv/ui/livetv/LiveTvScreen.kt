package com.senal.tv.ui.livetv

import android.view.KeyEvent
import androidx.compose.foundation.background
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.onKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.compose.material3.Text
import com.senal.tv.ui.components.LiveOsd
import com.senal.tv.ui.components.PlayerSurface
import com.senal.tv.ui.theme.SenalBlack
import com.senal.tv.ui.theme.SenalNeon

/**
 * Live TV with seamless D-pad zapping.
 * KEYCODE_DPAD_UP / DOWN swap MediaItem on the shared ExoPlayer — no black flash.
 */
@Composable
fun LiveTvScreen(
    viewModel: LiveTvViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val focusRequester = remember { FocusRequester() }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SenalBlack)
            .focusRequester(focusRequester)
            .focusable()
            .onKeyEvent { event ->
                val native = event.nativeKeyEvent
                when {
                    event.type == KeyEventType.KeyDown &&
                        native.keyCode == KeyEvent.KEYCODE_DPAD_UP -> {
                        viewModel.zapUp()
                        true
                    }

                    event.type == KeyEventType.KeyDown &&
                        native.keyCode == KeyEvent.KEYCODE_DPAD_DOWN -> {
                        viewModel.zapDown()
                        true
                    }

                    event.type == KeyEventType.KeyDown &&
                        native.keyCode == KeyEvent.KEYCODE_CHANNEL_UP -> {
                        viewModel.zapUp()
                        true
                    }

                    event.type == KeyEventType.KeyDown &&
                        native.keyCode == KeyEvent.KEYCODE_CHANNEL_DOWN -> {
                        viewModel.zapDown()
                        true
                    }

                    event.type == KeyEventType.KeyDown &&
                        (native.keyCode == KeyEvent.KEYCODE_DPAD_CENTER ||
                            native.keyCode == KeyEvent.KEYCODE_ENTER) -> {
                        if (native.repeatCount == 0) {
                            viewModel.onOkPressStart()
                        }
                        true
                    }

                    event.type == KeyEventType.KeyUp &&
                        (native.keyCode == KeyEvent.KEYCODE_DPAD_CENTER ||
                            native.keyCode == KeyEvent.KEYCODE_ENTER) -> {
                        viewModel.onOkPressEnd()
                        true
                    }

                    event.type == KeyEventType.KeyDown &&
                        native.keyCode == KeyEvent.KEYCODE_INFO -> {
                        viewModel.showOsd()
                        true
                    }

                    else -> false
                }
            },
    ) {
        PlayerSurface(
            senalPlayer = viewModel.senalPlayer,
            modifier = Modifier.fillMaxSize(),
        )

        LiveOsd(
            visible = state.osdVisible,
            channel = state.currentChannel,
            epgText = state.epgText,
            isFavorite = state.isFavorite,
            modifier = Modifier.align(Alignment.BottomCenter),
        )

        state.favoriteToast?.let { toast ->
            Text(
                text = toast,
                color = SenalBlack,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 36.dp)
                    .background(SenalNeon, androidx.compose.foundation.shape.RoundedCornerShape(999.dp))
                    .padding(horizontal = 18.dp, vertical = 8.dp),
            )
        }

        if (state.channels.isEmpty()) {
            Text(
                text = "Sin canales en catálogo",
                color = SenalNeon,
                fontSize = 18.sp,
                modifier = Modifier.align(Alignment.Center),
            )
        }
    }
}
