package com.senal.tv.data.repository

import com.senal.tv.data.model.AuthRequestDto
import com.senal.tv.network.SenalApi
import com.senal.tv.util.DeviceIdentity
import com.senal.tv.util.TokenStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.map
import retrofit2.HttpException
import javax.inject.Inject
import javax.inject.Singleton

sealed interface AuthEvent {
    data object LoggedOut : AuthEvent
    data object LoggedIn : AuthEvent
}

@Singleton
class AuthRepository @Inject constructor(
    private val api: SenalApi,
    private val tokenStore: TokenStore,
    private val deviceIdentity: DeviceIdentity,
) {
    val isLoggedIn: Flow<Boolean> = tokenStore.tokenFlow.map { !it.isNullOrBlank() }

    private val _events = MutableSharedFlow<AuthEvent>(extraBufferCapacity = 1)
    val events: SharedFlow<AuthEvent> = _events.asSharedFlow()

    suspend fun login(username: String, password: String): Result<Unit> {
        return runCatching {
            val response = api.login(
                AuthRequestDto(
                    username = username.trim(),
                    password = password,
                    deviceId = deviceIdentity.deviceId,
                    deviceName = deviceIdentity.deviceName,
                    platform = "android-tv",
                ),
            )
            val token = response.resolvedToken()
                ?: error(response.message ?: "Login sin token")
            tokenStore.setToken(token)
            _events.emit(AuthEvent.LoggedIn)
        }.recoverCatching { error ->
            throw mapAuthError(error)
        }
    }

    suspend fun logout() {
        tokenStore.setToken(null)
        _events.emit(AuthEvent.LoggedOut)
    }

    suspend fun invalidateSession() {
        tokenStore.setToken(null)
        _events.emit(AuthEvent.LoggedOut)
    }

    private fun mapAuthError(error: Throwable): Exception {
        if (error is HttpException) {
            val body = error.response()?.errorBody()?.string().orEmpty()
            val message = when {
                body.contains("INVALID_CREDENTIALS") -> "Usuario o contraseña incorrectos."
                body.contains("DEVICE_ID_REQUIRED") -> "Identificador de dispositivo requerido."
                body.contains("VALIDATION") -> "Usuario y contraseña requeridos."
                body.contains("UNAUTHORIZED") -> "Sesión no autorizada."
                else -> error.message() ?: "Error de autenticación (${error.code()})"
            }
            return IllegalStateException(message)
        }
        return (error as? Exception) ?: IllegalStateException(error.message ?: "Error de red")
    }
}
