// Rust utility - math helpers
pub fn clamp(value: f64, min: f64, max: f64) -> f64 {
    value.max(min).min(max)
}

pub fn lerp(a: f64, b: f64, t: f64) -> f64 {
    a + (b - a) * clamp(t, 0.0, 1.0)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_lerp() {
        assert_eq!(lerp(0.0, 10.0, 0.5), 5.0);
    }
}
