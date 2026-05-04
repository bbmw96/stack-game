// Zig utility — math helpers
const std = @import("std");

pub fn clamp(comptime T: type, val: T, lo: T, hi: T) T {
    return if (val < lo) lo else if (val > hi) hi else val;
}

pub fn isPrime(n: u64) bool {
    if (n < 2) return false;
    var i: u64 = 2;
    while (i * i <= n) : (i += 1) {
        if (n % i == 0) return false;
    }
    return true;
}
