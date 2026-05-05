// D utility - array helpers
module utils;

T[] unique(T)(T[] arr) {
    import std.algorithm : sort, uniq;
    import std.array : array;
    return arr.dup.sort.uniq.array;
}

size_t countWhere(T)(T[] arr, bool delegate(T) pred) {
    size_t n = 0;
    foreach (item; arr) if (pred(item)) n++;
    return n;
}
