import re

uuid_pattern = re.compile('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

def is_uuidv4(text: str):
    return bool(uuid_pattern.match(text))