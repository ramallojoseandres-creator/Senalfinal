package com.senal.tv

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.senal.tv.data.repository.HealthRepository
import com.senal.tv.ui.components.ReconnectBannerHost
import com.senal.tv.ui.navigation.SenalNavHost
import com.senal.tv.ui.theme.SenalBlack
import com.senal.tv.ui.theme.SenalTheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var healthRepository: HealthRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        try {
            setContent {
                SenalTheme {
                    val isOnline by healthRepository.isOnline.collectAsStateWithLifecycle()
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(SenalBlack),
                    ) {
                        ReconnectBannerHost(visible = !isOnline) {
                            SenalNavHost()
                        }
                    }
                }
            }
        } catch (t: Throwable) {
            Log.e("Senal", "Fatal UI bootstrap", t)
            SenalCrashHandler.persist(this, t)
            throw t
        }
    }
}
