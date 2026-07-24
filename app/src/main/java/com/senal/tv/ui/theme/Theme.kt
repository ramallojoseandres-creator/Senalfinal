package com.senal.tv.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

data class SenalColors(
    val black: Color = SenalBlack,
    val surface: Color = SenalSurface,
    val surfaceElevated: Color = SenalSurfaceElevated,
    val primary: Color = SenalPrimary,
    val neon: Color = SenalNeon,
    val neonDim: Color = SenalNeonDim,
    val onDark: Color = SenalOnDark,
    val muted: Color = SenalMuted,
    val danger: Color = SenalDanger,
)

val LocalSenalColors = staticCompositionLocalOf { SenalColors() }

private val DarkScheme = darkColorScheme(
    primary = SenalPrimary,
    onPrimary = SenalOnDark,
    secondary = SenalNeon,
    onSecondary = SenalBlack,
    background = SenalBlack,
    onBackground = SenalOnDark,
    surface = SenalSurface,
    onSurface = SenalOnDark,
    error = SenalDanger,
)

@Composable
fun SenalTheme(content: @Composable () -> Unit) {
    CompositionLocalProvider(LocalSenalColors provides SenalColors()) {
        MaterialTheme(
            colorScheme = DarkScheme,
            typography = SenalTypography,
            content = content,
        )
    }
}
