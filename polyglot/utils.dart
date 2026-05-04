// Dart utility — list helpers
List<List<T>> chunk<T>(List<T> list, int size) {
  final chunks = <List<T>>[];
  for (var i = 0; i < list.length; i += size) {
    chunks.add(list.sublist(i, i + size > list.length ? list.length : i + size));
  }
  return chunks;
}

T? safeGet<T>(List<T> list, int index) =>
    index >= 0 && index < list.length ? list[index] : null;
