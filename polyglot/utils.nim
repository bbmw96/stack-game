# Nim utility — string helpers
proc slugify*(s: string): string =
  result = ""
  for c in s.toLowerAscii():
    if c in {'a'..'z', '0'..'9'}:
      result.add(c)
    elif result.len > 0 and result[^1] != '-':
      result.add('-')
  if result.len > 0 and result[^1] == '-':
    result.setLen(result.len - 1)
