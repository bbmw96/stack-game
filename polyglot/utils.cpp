// C++ utility — vector helpers
#include <vector>
#include <numeric>
#include <algorithm>

template<typename T>
T sum(const std::vector<T>& v) {
    return std::accumulate(v.begin(), v.end(), T{});
}

template<typename T>
T mean(const std::vector<T>& v) {
    return v.empty() ? T{} : sum(v) / static_cast<T>(v.size());
}
