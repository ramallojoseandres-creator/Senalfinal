# Señal — keep Retrofit / Kotlinx Serialization / Media3 essentials
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses

-keep class com.senal.tv.data.model.** { *; }
-keep class com.senal.tv.data.remote.** { *; }

-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn retrofit2.**

-keep class androidx.media3.** { *; }
