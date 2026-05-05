# Julia utility - numeric helpers
module Utils

export clamp_val, sigmoid, relu

clamp_val(x, lo, hi) = max(lo, min(hi, x))
sigmoid(x::Real) = 1.0 / (1.0 + exp(-x))
relu(x::Real) = max(0.0, x)

end # module
