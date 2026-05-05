// Groovy utility - map helpers
class Utils {
    static Map deepMerge(Map base, Map override) {
        override.each { k, v ->
            base[k] = (base[k] instanceof Map && v instanceof Map)
                ? deepMerge(base[k] as Map, v as Map) : v
        }
        base
    }
}
