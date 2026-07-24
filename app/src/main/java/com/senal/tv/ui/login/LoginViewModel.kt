package com.senal.tv.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.senal.tv.data.repository.AuthRepository
import com.senal.tv.data.repository.CatalogRepository
import com.senal.tv.data.repository.HealthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LoginUiState(
    val username: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val serverOnline: Boolean = true,
    val serverVersion: String? = null,
    val loginSuccess: Boolean = false,
)

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val catalogRepository: CatalogRepository,
    private val healthRepository: HealthRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            healthRepository.isOnline.collect { online ->
                _uiState.update { it.copy(serverOnline = online) }
            }
        }
        viewModelScope.launch {
            healthRepository.serverVersion.collect { version ->
                _uiState.update { it.copy(serverVersion = version) }
            }
        }
        viewModelScope.launch { healthRepository.checkOnce() }
    }

    fun onUsernameChange(value: String) {
        _uiState.update { it.copy(username = value, errorMessage = null) }
    }

    fun onPasswordChange(value: String) {
        _uiState.update { it.copy(password = value, errorMessage = null) }
    }

    fun login() {
        val state = _uiState.value
        if (state.username.isBlank() || state.password.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Usuario y contraseña requeridos.") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val result = authRepository.login(state.username, state.password)
            result.onSuccess {
                catalogRepository.refresh()
                _uiState.update { it.copy(isLoading = false, loginSuccess = true) }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = error.message ?: "No se pudo iniciar sesión",
                    )
                }
            }
        }
    }
}
