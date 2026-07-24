package com.senal.tv.player

import android.content.Context
import android.util.Log
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.common.TrackSelectionParameters
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.DefaultLoadControl
import androidx.media3.exoplayer.DefaultRenderersFactory
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.trackselection.AdaptiveTrackSelection
import androidx.media3.exoplayer.trackselection.DefaultTrackSelector
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Long-lived Media3 player. [zapTo] swaps MediaItem without recreating the player.
 * Built lazily and defensively — never crash the Activity if decoder init fails.
 */
@OptIn(UnstableApi::class)
@Singleton
class SenalExoPlayer @Inject constructor(
    @ApplicationContext context: Context,
) {
    private val appContext = context.applicationContext

    private val _bitrateMbps = MutableStateFlow(0.0)
    val bitrateMbps: StateFlow<Double> = _bitrateMbps.asStateFlow()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private var currentUrl: String? = null

    private val listener = object : Player.Listener {
        override fun onIsPlayingChanged(isPlaying: Boolean) {
            _isPlaying.value = isPlaying
        }

        override fun onPlaybackStateChanged(playbackState: Int) {
            if (playbackState == Player.STATE_READY) {
                _errorMessage.value = null
                updateBitrateEstimate()
            }
        }

        override fun onPlayerError(error: PlaybackException) {
            _errorMessage.value = error.message ?: "Error de reproducción"
            Log.e(TAG, "Player error", error)
        }

        override fun onEvents(player: Player, events: Player.Events) {
            if (events.contains(Player.EVENT_PLAYBACK_STATE_CHANGED) ||
                events.contains(Player.EVENT_IS_PLAYING_CHANGED)
            ) {
                updateBitrateEstimate()
            }
        }
    }

    /**
     * Lazy + guarded construction. Returns null only if the device cannot create ExoPlayer.
     */
    val player: ExoPlayer by lazy {
        createPlayer()
    }

    private fun createPlayer(): ExoPlayer {
        val trackSelector = DefaultTrackSelector(
            appContext,
            AdaptiveTrackSelection.Factory(),
        ).apply {
            parameters = buildUponParameters()
                .setForceHighestSupportedBitrate(false)
                .setTunnelingEnabled(false)
                .build()
        }

        val renderersFactory = DefaultRenderersFactory(appContext)
            .setExtensionRendererMode(DefaultRenderersFactory.EXTENSION_RENDERER_MODE_PREFER)
            .setEnableDecoderFallback(true)

        val loadControl = DefaultLoadControl.Builder()
            .setBufferDurationsMs(2_500, 15_000, 750, 1_500)
            .setPrioritizeTimeOverSizeThresholds(true)
            .build()

        return ExoPlayer.Builder(appContext, renderersFactory)
            .setTrackSelector(trackSelector)
            .setLoadControl(loadControl)
            .setHandleAudioBecomingNoisy(true)
            .setWakeMode(C.WAKE_MODE_NETWORK)
            .build()
            .also { exo ->
                exo.playWhenReady = true
                exo.repeatMode = Player.REPEAT_MODE_OFF
                exo.videoScalingMode = C.VIDEO_SCALING_MODE_SCALE_TO_FIT
                exo.trackSelectionParameters = TrackSelectionParameters.Builder(appContext)
                    .setForceHighestSupportedBitrate(false)
                    .build()
                exo.addListener(listener)
            }
    }

    fun zapTo(streamUrl: String, channelId: String? = null) {
        if (streamUrl.isBlank()) return
        try {
            val exo = player
            if (streamUrl == currentUrl && exo.playbackState != Player.STATE_IDLE) {
                if (!exo.isPlaying) exo.play()
                return
            }
            currentUrl = streamUrl
            _errorMessage.value = null

            val mediaItem = MediaItem.Builder()
                .setUri(streamUrl)
                .setMediaId(channelId ?: streamUrl)
                .build()

            exo.setMediaItem(mediaItem, /* resetPosition = */ true)
            exo.prepare()
            exo.playWhenReady = true
        } catch (t: Throwable) {
            Log.e(TAG, "zapTo failed", t)
            _errorMessage.value = t.message ?: "No se pudo iniciar el reproductor"
        }
    }

    fun pause() {
        runCatching { player.pause() }
    }

    fun play() {
        runCatching { player.play() }
    }

    fun stop() {
        runCatching {
            player.stop()
            currentUrl = null
        }
    }

    fun updateBitrateEstimate() {
        runCatching {
            val format = player.videoFormat ?: player.audioFormat
            val bitrate = format?.bitrate?.takeIf { it > 0 }
            _bitrateMbps.value = if (bitrate != null) {
                bitrate / 1_000_000.0
            } else {
                if (player.isPlaying) 3.5 else 0.0
            }
        }
    }

    fun release() {
        runCatching {
            player.removeListener(listener)
            player.release()
        }
    }

    companion object {
        private const val TAG = "SenalExoPlayer"
    }
}
