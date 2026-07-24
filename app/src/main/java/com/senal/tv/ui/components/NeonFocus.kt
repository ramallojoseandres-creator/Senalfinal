package com.senal.tv.ui.components

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.focus.FocusState
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.senal.tv.ui.theme.SenalNeon

/**
 * D-pad / touch focus treatment.
 * Scale elástico + glow neon. No usa RenderEffect (evita crashes en API < 31 / SoCs TV).
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
                    topLeft = Offset(-glowPadPx, -glowPadPx),
                    cornerRadius = CornerRadius(cornerPx + glowPadPx / 2f),
                )
                drawRoundRect(
                    color = glowColor.copy(alpha = glowAlpha),
                    size = size.copy(
                        width = size.width + glowPadPx,
                        height = size.height + glowPadPx,
                    ),
                    topLeft = Offset(-glowPadPx / 2f, -glowPadPx / 2f),
                    cornerRadius = CornerRadius(cornerPx + glowPadPx / 4f),
                )
            }
        }
        .then(
            if (focused) {
                Modifier.border(borderWidth, glowColor, RoundedCornerShape(cornerRadius))
            } else {
                Modifier
            },
        )
}

@Composable
fun FocusSurface(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    cornerRadius: Dp = 12.dp,
    content: @Composable () -> Unit,
) {
    val interaction = remember { MutableInteractionSource() }
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(cornerRadius))
            .neonFocus(cornerRadius = cornerRadius)
            .clickable(
                enabled = enabled,
                interactionSource = interaction,
                indication = null,
                role = Role.Button,
                onClick = onClick,
            )
            .focusable(enabled = enabled, interactionSource = interaction),
    ) {
        content()
    }
}
