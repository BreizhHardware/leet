function mySqrt(x: number): number {
    if (x < 2) return x;
    let left = 1,
        right = x,
        ans = 0;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (mid <= Math.floor(x / mid)) {
            ans = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return ans;
}

// Exemples de test
console.log(mySqrt(4)); // 2
console.log(mySqrt(8)); // 2
console.log(mySqrt(0)); // 0
console.log(mySqrt(1)); // 1
console.log(mySqrt(2147395599)); // 46339
