package com.senal.tv

import android.app.Application
import coil.ImageLoader
import coil.ImageLoaderFactory
import coil.disk.DiskCache
import coil.memory.MemoryCache
import dagger.hilt.android.HiltAndroidApp

/**
 * Application entry point.
 * Coil is tuned for TV: generous memory cache for channel logos during zapping.
 */
@HiltAndroidApp
class SenalApp : Application(), ImageLoaderFactory {

    override fun newImageLoader(): ImageLoader {
        return ImageLoader.Builder(this)
            .crossfade(false) // Avoid fade jank on D-pad focus moves
            .memoryCache {
                MemoryCache.Builder(this)
                    .maxSizePercent(0.30)
                    .build()
            }
            .diskCache {
                DiskCache.Builder()
                    .directory(cacheDir.resolve("coil_logos"))
                    .maxSizeBytes(64L * 1024L * 1024L)
                    .build()
            }
            .build()
    }
}
