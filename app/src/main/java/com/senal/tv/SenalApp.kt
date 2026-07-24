package com.senal.tv

import android.app.Application
import coil.ImageLoader
import coil.ImageLoaderFactory
import coil.disk.DiskCache
import coil.memory.MemoryCache
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class SenalApp : Application(), ImageLoaderFactory {

    override fun onCreate() {
        super.onCreate()
        SenalCrashHandler.install(this)
    }

    override fun newImageLoader(): ImageLoader {
        return ImageLoader.Builder(this)
            .crossfade(false)
            .memoryCache {
                MemoryCache.Builder(this)
                    .maxSizePercent(0.25)
                    .build()
            }
            .diskCache {
                DiskCache.Builder()
                    .directory(cacheDir.resolve("coil_logos"))
                    .maxSizeBytes(48L * 1024L * 1024L)
                    .build()
            }
            .build()
    }
}
