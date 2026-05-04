# Python utility — string helpers
def slugify(text: str) -> str:
    import re
    text = text.lower().strip()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

def truncate(text: str, max_len: int = 80) -> str:
    return text if len(text) <= max_len else text[:max_len - 3] + '...'

if __name__ == '__main__':
    print(slugify('Hello World!'))
    print(truncate('This is a very long string indeed', 20))
