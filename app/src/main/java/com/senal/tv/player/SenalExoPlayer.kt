package com.senal.tv.player

import android.content.Context
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
 * Long-lived Media3 player tuned for Android TV live zapping.
 *
 * Critical: [zapTo] only swaps [MediaItem] + prepare() — never release/recreate
 * the ExoPlayer instance between channels (eliminates black flash / jank).
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

    private val trackSelector = DefaultTrackSelector(
        appContext,
        AdaptiveTrackSelection.Factory(),
    ).apply {
        parameters = buildUponParameters()
            .setForceHighestSupportedBitrate(false)
            .setTunnelingEnabled(true)
            .build()
    }

    private val renderersFactory = DefaultRenderersFactory(appContext)
        .setExtensionRendererMode(DefaultRenderersFactory.EXTENSION_RENDERER_MODE_PREFER)
        .setEnableDecoderFallback(true)

    private val loadControl = DefaultLoadControl.Builder()
        .setBufferDurationsMs(
            /* minBufferMs = */ 2_500,
            /* maxBufferMs = */ 15_000,
            /* bufferForPlaybackMs = */ 750,
            /* bufferForPlaybackAfterRebufferMs = */ 1_500,
        )
        .setPrioritizeTimeOverSizeThresholds(true)
        .build()

    val player: ExoPlayer = ExoPlayer.Builder(appContext, renderersFactory)
        .setTrackSelector(trackSelector)
        .setLoadControl(loadControl)
        .setHandleAudioBecomingNoisy(true)
        .setWakeMode(C.WAKE_MODE_NETWORK)
        .build()

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
        }

        override fun onEvents(player: Player, events: Player.Events) {
            if (events.contains(Player.EVENT_PLAYBACK_STATE_CHANGED) ||
                events.contains(Player.EVENT_IS_PLAYING_CHANGED)
            ) {
                updateBitrateEstimate()
            }
        }
    }

    init {
        player.playWhenReady = true
        player.repeatMode = Player.REPEAT_MODE_OFF
        player.videoScalingMode = C.VIDEO_SCALING_MODE_SCALE_TO_FIT
        player.trackSelectionParameters = TrackSelectionParameters.Builder(appContext)
            .setForceHighestSupportedBitrate(false)
            .build()
        player.addListener(listener)
    }

    /**
     * Seamless channel change: reuse the same player instance.
     */
    fun zapTo(streamUrl: String, channelId: String? = null) {
        if (streamUrl.isBlank()) return
        if (streamUrl == currentUrl && player.playbackState != Player.STATE_IDLE) {
            if (!player.isPlaying) player.play()
            return
        }
        currentUrl = streamUrl
        _errorMessage.value = null

        val mediaItem = MediaItem.Builder()
            .setUri(streamUrl)
            .setMediaId(channelId ?: streamUrl)
            .build()

        player.setMediaItem(mediaItem, /* resetPosition = */ true)
        player.prepare()
        player.playWhenReady = true
    }

    fun pause() {
        player.pause()
    }

    fun play() {
        player.play()
    }

    fun stop() {
        player.stop()
        currentUrl = null
    }

    fun updateBitrateEstimate() {
        val format = player.videoFormat ?: player.audioFormat
        val bitrate = format?.bitrate?.takeIf { it > 0 }
        _bitrateMbps.value = if (bitrate != null) {
            bitrate / 1_000_000.0
        } else {
            // Soft simulation when stream metadata lacks bitrate (common on some IPTV feeds)
            if (player.isPlaying) 3.5 else 0.0
        }
    }

    fun release() {
        player.removeListener(listener)
        player.release()
    }
}
