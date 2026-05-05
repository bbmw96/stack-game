// Swift utility - color helpers
import Foundation

struct Hex {
    static func toRGB(_ hex: String) -> (r: Int, g: Int, b: Int)? {
        var h = hex.trimmingCharacters(in: .init(charactersIn: "#"))
        guard h.count == 6, let val = UInt32(h, radix: 16) else { return nil }
        return (Int((val >> 16) & 0xFF), Int((val >> 8) & 0xFF), Int(val & 0xFF))
    }
}
