import shortuuid
from uuid import uuid4

def generate_id():
    return shortuuid.uuid()

def generate_uuid4():
    return str(uuid4())