/* C utility — numeric helpers */
#include <stdio.h>

int gcd(int a, int b) {
    while (b) { int t = b; b = a % b; a = t; }
    return a;
}

int lcm(int a, int b) {
    return (a / gcd(a, b)) * b;
}

int main(void) {
    printf("GCD(12,8)=%d LCM(4,6)=%d\n", gcd(12,8), lcm(4,6));
    return 0;
}
