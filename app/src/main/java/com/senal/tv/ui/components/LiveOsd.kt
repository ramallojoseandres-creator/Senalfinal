package com.senal.tv.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.tv.material3.Text
import coil.compose.AsyncImage
import com.senal.tv.data.model.Channel
import com.senal.tv.ui.theme.SenalBlack
import com.senal.tv.ui.theme.SenalNeon
import com.senal.tv.ui.theme.SenalOnDark
import com.senal.tv.ui.theme.SenalPrimary
import com.senal.tv.ui.theme.SenalSurface

@Composable
fun LiveOsd(
    visible: Boolean,
    channel: Channel?,
    epgText: String,
    isFavorite: Boolean,
    modifier: Modifier = Modifier,
) {
    AnimatedVisibility(
        visible = visible && channel != null,
        enter = fadeIn() + slideInVertically { it / 2 },
        exit = fadeOut() + slideOutVertically { it / 2 },
        modifier = modifier.fillMaxWidth(),
    ) {
        if (channel == null) return@AnimatedVisibility

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            SenalBlack.copy(alpha = 0f),
                            SenalBlack.copy(alpha = 0.85f),
                            SenalBlack,
                        ),
                    ),
                )
                .padding(horizontal = 40.dp, vertical = 28.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(20.dp),
        ) {
            AsyncImage(
                model = channel.logoUrl,
                contentDescription = channel.name,
                contentScale = ContentScale.Fit,
                modifier = Modifier
                    .size(72.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(SenalSurface)
                    .padding(6.dp),
            )

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        text = channel.number.toString().padStart(3, '0'),
                        color = SenalNeon,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                    )
                    Text(
                        text = channel.name,
                        color = SenalOnDark,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    if (isFavorite) {
                        Text(
                            text = "★",
                            color = SenalNeon,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                        )
                    }
                }
                Text(
                    text = epgText,
                    color = SenalOnDark.copy(alpha = 0.75f),
                    fontSize = 16.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.padding(top = 4.dp),
                )
            }

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "SEÑAL",
                    color = SenalPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                )
                androidx.compose.foundation.layout.Spacer(Modifier.height(6.dp))
                Text(
                    text = "OK · info  ·  Hold OK · favorito",
                    color = SenalOnDark.copy(alpha = 0.45f),
                    fontSize = 12.sp,
                )
            }
        }
    }
}
