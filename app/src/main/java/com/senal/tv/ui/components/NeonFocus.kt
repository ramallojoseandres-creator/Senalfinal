package com.senal.tv.ui.components

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.border
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.focus.FocusState
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.senal.tv.ui.theme.SenalNeon
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue

/**
 * Perfect D-pad focus treatment for Android TV.
 * - Elastic scale to 1.05f via Spring
 * - Neon turquoise outer glow drawn behind (no RenderEffect blur — TV-optimized)
 * - renderEffect explicitly kept null for GPU friendliness on low-end sticks
 */
fun Modifier.neonFocus(
    focusedScale: Float = 1.05f,
    glowColor: Color = SenalNeon,
    borderWidth: Dp = 2.dp,
    cornerRadius: Dp = 10.dp,
    onFocusChanged: ((FocusState) -> Unit)? = null,
): Modifier = composed {
    var focused by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        targetValue = if (focused) focusedScale else 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMediumLow,
        ),
        label = "neonFocusScale",
    )
    val glowAlpha by animateFloatAsState(
        targetValue = if (focused) 0.55f else 0f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioNoBouncy,
            stiffness = Spring.StiffnessMedium,
        ),
        label = "neonFocusGlow",
    )
    val density = LocalDensity.current
    val glowPadPx = with(density) { 10.dp.toPx() }
    val cornerPx = with(density) { cornerRadius.toPx() }

    this
        .onFocusChanged { state ->
            focused = state.isFocused || state.hasFocus
            onFocusChanged?.invoke(state)
        }
        .graphicsLayer {
            scaleX = scale
            scaleY = scale
            // Explicitly no blur RenderEffect — cheaper on Amlogic/Rockchip SoCs
            renderEffect = null
            clip = false
        }
        .drawBehind {
            if (glowAlpha > 0.01f) {
                drawRoundRect(
                    color = glowColor.copy(alpha = glowAlpha * 0.35f),
                    size = size.copy(
                        width = size.width + glowPadPx * 2,
                        height = size.height + glowPadPx * 2,
                    ),
                    topLeft = androidx.compose.ui.geometry.Offset(-glowPadPx, -glowPadPx),
                    cornerRadius = CornerRadius(cornerPx + glowPadPx / 2f),
                )
                drawRoundRect(
                    color = glowColor.copy(alpha = glowAlpha),
                    size = size.copy(
                        width = size.width + glowPadPx,
                        height = size.height + glowPadPx,
                    ),
                    topLeft = androidx.compose.ui.geometry.Offset(-glowPadPx / 2f, -glowPadPx / 2f),
                    cornerRadius = CornerRadius(cornerPx + glowPadPx / 4f),
                )
            }
        }
        .then(
            if (focused) {
                Modifier.border(borderWidth, glowColor, androidx.compose.foundation.shape.RoundedCornerShape(cornerRadius))
            } else {
                Modifier
            },
        )
}
