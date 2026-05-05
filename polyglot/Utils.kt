// Kotlin utility - collection helpers
fun <T> List<T>.second(): T? = if (size >= 2) this[1] else null

fun String.words(): List<String> = trim().split(Regex("\s+"))

fun List<Int>.product(): Long = fold(1L) { acc, n -> acc * n }
