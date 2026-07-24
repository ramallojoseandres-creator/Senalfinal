package com.senal.tv.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.senal.tv.ui.home.HomeScreen
import com.senal.tv.ui.livetv.LiveTvScreen
import com.senal.tv.ui.vod.VodPlayerScreen

object Routes {
    const val HOME = "home"
    const val LIVE = "live"
    const val LIVE_WITH_ID = "live/{channelId}"
    const val VOD = "vod/{vodId}"

    fun live(channelId: String?): String =
        if (channelId.isNullOrBlank()) LIVE else "live/$channelId"

    fun vod(vodId: String): String = "vod/$vodId"
}

@Composable
fun SenalNavHost() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Routes.HOME,
    ) {
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
