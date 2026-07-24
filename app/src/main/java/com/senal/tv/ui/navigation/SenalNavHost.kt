package com.senal.tv.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.senal.tv.data.repository.AuthEvent
import com.senal.tv.data.repository.AuthRepository
import com.senal.tv.ui.home.HomeScreen
import com.senal.tv.ui.livetv.LiveTvScreen
import com.senal.tv.ui.login.LoginScreen
import com.senal.tv.ui.vod.VodPlayerScreen
import com.senal.tv.util.TokenStore
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

object Routes {
    const val LOGIN = "login"
    const val HOME = "home"
    const val LIVE = "live"
    const val LIVE_WITH_ID = "live/{channelId}"
    const val VOD = "vod/{vodId}"

    fun live(channelId: String?): String =
        if (channelId.isNullOrBlank()) LIVE else "live/$channelId"

    fun vod(vodId: String): String = "vod/$vodId"
}

@HiltViewModel
class SessionViewModel @Inject constructor(
    tokenStore: TokenStore,
    private val authRepository: AuthRepository,
) : ViewModel() {
    val isLoggedIn: StateFlow<Boolean> = tokenStore.tokenFlow
        .map { !it.isNullOrBlank() }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), false)

    val authEvents = authRepository.events

    fun logout() {
        viewModelScope.launch { authRepository.logout() }
    }
}

@Composable
fun SenalNavHost(
    sessionViewModel: SessionViewModel = hiltViewModel(),
) {
    val navController = rememberNavController()
    val isLoggedIn by sessionViewModel.isLoggedIn.collectAsStateWithLifecycle()

    LaunchedEffect(sessionViewModel) {
        sessionViewModel.authEvents.collect { event ->
            when (event) {
                AuthEvent.LoggedOut -> {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                        launchSingleTop = true
                    }
                }
                AuthEvent.LoggedIn -> {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            }
        }
    }

    // Cold start: if token already present, skip login.
    LaunchedEffect(isLoggedIn) {
        val current = navController.currentBackStackEntry?.destination?.route
        if (isLoggedIn && current == Routes.LOGIN) {
            navController.navigate(Routes.HOME) {
                popUpTo(Routes.LOGIN) { inclusive = true }
            }
        } else if (!isLoggedIn && current != null && current != Routes.LOGIN) {
            navController.navigate(Routes.LOGIN) {
                popUpTo(0) { inclusive = true }
            }
        }
    }

    NavHost(
        navController = navController,
        startDestination = if (isLoggedIn) Routes.HOME else Routes.LOGIN,
    ) {
        composable(Routes.LOGIN) {
            LoginScreen(
                onLoggedIn = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                },
            )
        }
        composable(Routes.HOME) {
            HomeScreen(
                onOpenLive = { channelId ->
                    navController.navigate(Routes.live(channelId))
                },
                onOpenVod = { vodId ->
                    navController.navigate(Routes.vod(vodId))
                },
            )
        }
        composable(Routes.LIVE) {
            LiveTvScreen()
        }
        composable(
            route = Routes.LIVE_WITH_ID,
            arguments = listOf(navArgument("channelId") { type = NavType.StringType }),
        ) {
            LiveTvScreen()
        }
        composable(
            route = Routes.VOD,
            arguments = listOf(navArgument("vodId") { type = NavType.StringType }),
        ) {
            VodPlayerScreen()
        }
    }
}
