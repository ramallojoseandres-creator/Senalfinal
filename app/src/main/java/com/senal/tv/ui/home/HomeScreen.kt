package com.senal.tv.ui.home

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.senal.tv.data.model.Channel
import com.senal.tv.data.model.VodItem
import com.senal.tv.ui.components.FocusSurface
import com.senal.tv.ui.components.PlayerSurface
import com.senal.tv.ui.components.neonFocus
import com.senal.tv.ui.theme.SenalBlack
import com.senal.tv.ui.theme.SenalMuted
import com.senal.tv.ui.theme.SenalNeon
import com.senal.tv.ui.theme.SenalOnDark
import com.senal.tv.ui.theme.SenalPrimary
import com.senal.tv.ui.theme.SenalSurface
import com.senal.tv.ui.theme.SenalSurfaceElevated

@Composable
fun HomeScreen(
    onOpenLive: (channelId: String?) -> Unit,
    onOpenVod: (vodId: String) -> Unit,
    viewModel: HomeViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val pulse by animateFloatAsState(
        targetValue = if (state.bitrateMbps > 0) 1f else 0.55f,
        animationSpec = tween(700),
        label = "bitratePulse",
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(SenalBlack, SenalSurface.copy(alpha = 0.9f), SenalBlack),
                ),
            ),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 40.dp, vertical = 28.dp),
        ) {
            HomeTopBar(clock = state.clock, fromCache = state.statusMessage)

            Spacer(Modifier.height(22.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                horizontalArrangement = Arrangement.spacedBy(28.dp),
            ) {
                MiniPlayerPanel(
                    senalPlayer = viewModel.senalPlayer,
                    bitrateMbps = state.bitrateMbps,
                    channel = state.previewChannel,
                    pulse = pulse,
                    onOpen = { onOpenLive(state.previewChannel?.id) },
                    modifier = Modifier
                        .weight(0.42f)
                        .fillMaxHeight(),
                )

                Column(
                    modifier = Modifier
                        .weight(0.58f)
                        .fillMaxHeight(),
                    verticalArrangement = Arrangement.spacedBy(22.dp),
                ) {
                    CategoryHeader("VIVO")
                    LazyRow(
                        contentPadding = PaddingValues(end = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        items(
                            items = state.catalog.live,
                            key = { it.id },
                        ) { channel ->
                            ChannelCard(
                                channel = channel,
                                onClick = { onOpenLive(channel.id) },
                                onFocused = { viewModel.selectPreview(channel) },
                            )
                        }
                    }

                    CategoryHeader("VOD")
                    LazyRow(
                        contentPadding = PaddingValues(end = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        items(
                            items = state.catalog.vod,
                            key = { it.id },
                        ) { item ->
                            VodCard(
                                item = item,
                                onClick = { onOpenVod(item.id) },
                            )
                        }
                    }

                    if (state.catalog.live.isEmpty() && state.catalog.vod.isEmpty()) {
                        Text(
                            text = if (state.isRefreshing) {
                                "Sincronizando catálogo…"
                            } else {
                                "Sin canales disponibles — inicia sesión o revisa el panel"
                            },
                            color = SenalMuted,
                            fontSize = 14.sp,
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun HomeTopBar(clock: String, fromCache: String?) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column {
            Text(
                text = "SEÑAL",
                color = SenalOnDark,
                fontSize = 34.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 2.sp,
            )
            Text(
                text = "Televisión sin fricción",
                color = SenalNeon,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
            )
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(
                text = clock,
                color = SenalOnDark,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
            )
            if (fromCache != null) {
                Text(
                    text = fromCache,
                    color = SenalPrimary,
                    fontSize = 12.sp,
                )
            }
        }
    }
}

@Composable
private fun MiniPlayerPanel(
    senalPlayer: com.senal.tv.player.SenalExoPlayer,
    bitrateMbps: Double,
    channel: Channel?,
    pulse: Float,
    onOpen: () -> Unit,
    modifier: Modifier = Modifier,
) {
    FocusSurface(
        onClick = onOpen,
        modifier = modifier.background(SenalSurfaceElevated, RoundedCornerShape(16.dp)),
        cornerRadius = 16.dp,
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)),
            ) {
                PlayerSurface(
                    senalPlayer = senalPlayer,
                    modifier = Modifier.fillMaxSize(),
                )
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .fillMaxWidth()
                        .background(
                            Brush.verticalGradient(
                                listOf(SenalBlack.copy(alpha = 0f), SenalBlack.copy(alpha = 0.8f)),
                            ),
                        )
                        .padding(14.dp),
                ) {
                    Column {
                        Text(
                            text = channel?.name ?: "Mini-player",
                            color = SenalOnDark,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 16.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        Text(
                            text = String.format("%.1f Mbps", bitrateMbps.coerceAtLeast(0.0)),
                            color = SenalNeon.copy(alpha = pulse),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                        )
                    }
                }
            }
            Text(
                text = "OK / toque para pantalla completa",
                color = SenalMuted,
                fontSize = 12.sp,
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            )
        }
    }
}

@Composable
private fun CategoryHeader(title: String) {
    Text(
        text = title,
        color = SenalNeon,
        fontSize = 18.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 1.5.sp,
    )
}

@Composable
private fun ChannelCard(
    channel: Channel,
    onClick: () -> Unit,
    onFocused: () -> Unit,
) {
    FocusSurface(
        onClick = onClick,
        modifier = Modifier
            .width(168.dp)
            .background(SenalSurface, RoundedCornerShape(12.dp))
            .onFocusChanged { if (it.isFocused) onFocused() },
        cornerRadius = 12.dp,
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            AsyncImage(
                model = channel.logoUrl,
                contentDescription = channel.name,
                contentScale = ContentScale.Fit,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(78.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(SenalBlack)
                    .padding(8.dp),
            )
            Spacer(Modifier.height(10.dp))
            Text(
                text = channel.number.toString().padStart(3, '0'),
                color = SenalPrimary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
            )
            Text(
                text = channel.name,
                color = SenalOnDark,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

@Composable
private fun VodCard(
    item: VodItem,
    onClick: () -> Unit,
) {
    FocusSurface(
        onClick = onClick,
        modifier = Modifier
            .width(140.dp)
            .background(SenalSurface, RoundedCornerShape(12.dp)),
        cornerRadius = 12.dp,
    ) {
        Column {
            AsyncImage(
                model = item.posterUrl,
                contentDescription = item.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(2f / 3f)
                    .background(SenalBlack),
            )
            Text(
                text = item.title,
                color = SenalOnDark,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(10.dp),
            )
        }
    }
}
