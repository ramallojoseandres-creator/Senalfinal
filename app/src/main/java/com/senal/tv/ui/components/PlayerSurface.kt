package com.senal.tv.ui.components

import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.util.UnstableApi
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView
import com.senal.tv.player.SenalExoPlayer
import com.senal.tv.ui.theme.SenalBlack

@OptIn(UnstableApi::class)
@Composable
fun PlayerSurface(
    senalPlayer: SenalExoPlayer,
    modifier: Modifier = Modifier,
    showController: Boolean = false,
) {
    val context = LocalContext.current
    val playerView = remember(showController) {
        PlayerView(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            )
            useController = showController
            resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FIT
            setShowBuffering(PlayerView.SHOW_BUFFERING_WHEN_PLAYING)
            setKeepContentOnPlayerReset(true)
            setShutterBackgroundColor(android.graphics.Color.TRANSPARENT)
        }
    }

    DisposableEffect(senalPlayer, playerView) {
        runCatching { playerView.player = senalPlayer.player }
        onDispose {
            playerView.player = null
        }
    }

    Box(modifier = modifier.background(SenalBlack)) {
        AndroidView(
            factory = { playerView },
            modifier = Modifier.fillMaxSize(),
            update = { view ->
                runCatching {
                    if (view.player != senalPlayer.player) {
                        view.player = senalPlayer.player
                    }
                }
            },
        )
    }
}
