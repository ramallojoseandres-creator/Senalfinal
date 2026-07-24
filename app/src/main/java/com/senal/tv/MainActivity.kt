package com.senal.tv

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.tv.material3.Surface
import com.senal.tv.data.repository.HealthRepository
import com.senal.tv.ui.components.ReconnectBannerHost
import com.senal.tv.ui.navigation.SenalNavHost
import com.senal.tv.ui.theme.SenalTheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var healthRepository: HealthRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SenalTheme {
                val isOnline by healthRepository.isOnline.collectAsStateWithLifecycle()
                Surface(modifier = Modifier.fillMaxSize()) {
                    ReconnectBannerHost(visible = !isOnline) {
                        SenalNavHost()
                    }
                }
            }
        }
    }
}
