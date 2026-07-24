package com.senal.tv

import android.content.Context
import android.util.Log
import java.io.File
import java.io.PrintWriter
import java.io.StringWriter

/**
 * Persists the last uncaught crash so sideload debugging is possible without logcat.
 * File: filesDir/last_crash.txt
 */
object SenalCrashHandler : Thread.UncaughtExceptionHandler {

    private const val TAG = "SenalCrash"
    private var previous: Thread.UncaughtExceptionHandler? = null
    private var appContext: Context? = null

    fun install(context: Context) {
        appContext = context.applicationContext
        previous = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler(this)
    }

    fun persist(context: Context, throwable: Throwable) {
        runCatching {
            val sw = StringWriter()
            throwable.printStackTrace(PrintWriter(sw))
            File(context.filesDir, "last_crash.txt").writeText(
                buildString {
                    appendLine(System.currentTimeMillis().toString())
                    appendLine(throwable::class.java.name)
                    appendLine(throwable.message ?: "")
                    appendLine(sw.toString())
                },
            )
        }
    }

    override fun uncaughtException(thread: Thread, throwable: Throwable) {
        Log.e(TAG, "Uncaught on ${thread.name}", throwable)
        appContext?.let { persist(it, throwable) }
        previous?.uncaughtException(thread, throwable)
    }
}
