package com.senal.tv.data.local

/**
 * One parsed M3U entry (#EXTINF + URL).
 */
data class M3uEntry(
    val title: String,
    val url: String,
    val logo: String? = null,
    val group: String? = null,
    val tvgId: String? = null,
    val tvgName: String? = null,
    val channelNumber: Int? = null,
)

object M3uParser {

    private val attrRegex = Regex("""([\w-]+)="([^"]*)"""")

    fun parse(text: String): List<M3uEntry> {
        val lines = text.lineSequence()
            .map { it.trim() }
            .filter { it.isNotEmpty() }
            .toList()

        val out = ArrayList<M3uEntry>(lines.size / 2)
        var pending: ExtInf? = null

        for (line in lines) {
            when {
                line.startsWith("#EXTINF", ignoreCase = true) -> {
                    pending = parseExtInf(line)
                }
                line.startsWith("#") -> {
                    // ignore other tags
                }
                else -> {
                    val info = pending
                    pending = null
                    if (info == null) continue
                    val title = info.title.ifBlank { info.tvgName }.orEmpty().ifBlank { "Canal" }
                    out += M3uEntry(
                        title = title,
                        url = line,
                        logo = info.logo,
                        group = info.group,
                        tvgId = info.tvgId,
                        tvgName = info.tvgName,
                        channelNumber = info.channelNumber,
                    )
                }
            }
        }
        return out
    }

    private data class ExtInf(
        val title: String,
        val logo: String?,
        val group: String?,
        val tvgId: String?,
        val tvgName: String?,
        val channelNumber: Int?,
    )

    private fun parseExtInf(line: String): ExtInf {
        val comma = line.lastIndexOf(',')
        val title = if (comma >= 0) line.substring(comma + 1).trim() else ""
        val attrsPart = if (comma >= 0) line.substring(0, comma) else line
        val attrs = attrRegex.findAll(attrsPart).associate { it.groupValues[1].lowercase() to it.groupValues[2] }

        val logo = attrs["tvg-logo"] ?: attrs["logo"]
        val group = attrs["group-title"] ?: attrs["group"]
        val tvgId = attrs["tvg-id"]
        val tvgName = attrs["tvg-name"]
        val number = attrs["tvg-chno"]?.toIntOrNull()
            ?: attrs["channel-number"]?.toIntOrNull()
            ?: attrs["chno"]?.toIntOrNull()

        return ExtInf(
            title = title,
            logo = logo?.takeIf { it.isNotBlank() },
            group = group?.takeIf { it.isNotBlank() },
            tvgId = tvgId?.takeIf { it.isNotBlank() },
            tvgName = tvgName?.takeIf { it.isNotBlank() },
            channelNumber = number,
        )
    }

    fun isVodGroup(group: String?): Boolean {
        val g = group?.lowercase().orEmpty()
        return g.contains("vod") ||
            g.contains("movie") ||
            g.contains("pelicul") ||
            g.contains("cine") ||
            g.contains("serie") ||
            g.contains("on demand")
    }
}
