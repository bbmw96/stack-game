// Java utility — array helpers
import java.util.Arrays;

public class Utils {
    public static int[] range(int start, int end) {
        return java.util.stream.IntStream.range(start, end).toArray();
    }

    public static <T> String join(T[] arr, String sep) {
        return Arrays.stream(arr).map(Object::toString)
                     .collect(java.util.stream.Collectors.joining(sep));
    }
}
