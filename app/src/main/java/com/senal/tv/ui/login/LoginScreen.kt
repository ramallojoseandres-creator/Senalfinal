package com.senal.tv.ui.login

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.senal.tv.ui.components.FocusSurface
import com.senal.tv.ui.components.neonFocus
import com.senal.tv.ui.theme.SenalBlack
import com.senal.tv.ui.theme.SenalDanger
import com.senal.tv.ui.theme.SenalMuted
import com.senal.tv.ui.theme.SenalNeon
import com.senal.tv.ui.theme.SenalOnDark
import com.senal.tv.ui.theme.SenalPrimary
import com.senal.tv.ui.theme.SenalSurface
import com.senal.tv.ui.theme.SenalSurfaceElevated

@Composable
fun LoginScreen(
    onLoggedIn: () -> Unit,
    viewModel: LoginViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(state.loginSuccess) {
        if (state.loginSuccess) onLoggedIn()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(SenalSurfaceElevated, SenalBlack, SenalBlack),
                ),
            ),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            modifier = Modifier
                .widthIn(max = 520.dp)
                .fillMaxWidth()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Text(
                text = "SEÑAL",
                color = SenalOnDark,
                fontSize = 48.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 4.sp,
            )
            Text(
                text = "Acceso Android TV / Tablet",
                color = SenalNeon,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
            )
            Spacer(Modifier.height(8.dp))

            TvTextField(
                value = state.username,
                onValueChange = viewModel::onUsernameChange,
                label = "Usuario",
                imeAction = ImeAction.Next,
            )
            TvTextField(
                value = state.password,
                onValueChange = viewModel::onPasswordChange,
                label = "Contraseña",
                isPassword = true,
                imeAction = ImeAction.Done,
                onDone = viewModel::login,
            )

            state.errorMessage?.let { error ->
                Text(
                    text = error,
                    color = SenalDanger,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(top = 4.dp),
                )
            }

            FocusSurface(
                onClick = viewModel::login,
                enabled = !state.isLoading,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp)
                    .background(if (state.isLoading) SenalSurface else SenalPrimary, RoundedCornerShape(14.dp)),
                cornerRadius = 14.dp,
            ) {
                Text(
                    text = if (state.isLoading) "Conectando…" else "Entrar",
                    color = SenalBlack,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 16.dp),
                )
            }

            val status = buildString {
                append(if (state.serverOnline) "Servidor en línea" else "Servidor no alcanzable")
                state.serverVersion?.let { append(" · v$it") }
            }
            Text(
                text = status,
                color = if (state.serverOnline) SenalMuted else SenalDanger,
                fontSize = 12.sp,
            )
        }
    }
}

@Composable
private fun TvTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    isPassword: Boolean = false,
    imeAction: ImeAction = ImeAction.Next,
    onDone: (() -> Unit)? = null,
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = label,
            color = SenalMuted,
            fontSize = 12.sp,
            modifier = Modifier.padding(bottom = 6.dp, start = 4.dp),
        )
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            singleLine = true,
            visualTransformation = if (isPassword) {
                PasswordVisualTransformation()
            } else {
                VisualTransformation.None
            },
            textStyle = TextStyle(
                color = SenalOnDark,
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
            ),
            cursorBrush = SolidColor(SenalNeon),
            keyboardOptions = KeyboardOptions(imeAction = imeAction),
            keyboardActions = KeyboardActions(onDone = { onDone?.invoke() }),
            modifier = Modifier
                .fillMaxWidth()
                .neonFocus(focusedScale = 1.02f)
                .background(SenalSurface, RoundedCornerShape(12.dp))
                .padding(horizontal = 18.dp, vertical = 16.dp),
        )
    }
}
