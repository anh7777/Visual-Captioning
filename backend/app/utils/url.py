import datetime
import json
import base64
import rsa
from urllib.parse import urlencode
import os
from app.core.config import config
from app.utils.identifier import generate_id

project_root = os.path.abspath(os.path.join(__file__, "../../../"))
private_key_path = os.path.join(project_root, "private_key.pem")
private_key = rsa.PrivateKey.load_pkcs1(open(private_key_path, "rb").read())
expire_time = int((datetime.datetime.now() + datetime.timedelta(hours=1)).timestamp())

def _generate_policy(resource_url: str, expire_time: int):
    return json.dumps({
        "Statement": [{
            "Resource": resource_url,
            "Condition": {"DateLessThan": {"AWS:EpochTime": expire_time}}
        }]
    }, separators=(",", ":"))

def _generate_signature(policy: str, private_key):
    return rsa.sign(policy.encode(), private_key, "SHA-1")

def generate_cloudfront_url(path: str) -> str:
    resource_url = config.BASE_CLOUD_URL + path
    policy = _generate_policy(resource_url, expire_time)
    policy_b64 = base64.b64encode(policy.encode()).decode()
    signature = _generate_signature(policy, private_key)
    signature_b64 = base64.b64encode(signature).decode()
    return f"{resource_url}?{urlencode({'Policy': policy_b64, 'Signature': signature_b64, 'Key-Pair-Id': config.KEY_PAIR_ID})}"

def generate_display_url(base_url: str) -> str:
    return os.path.join('http://localhost:8080', base_url)

def generate_user_media_url(user_id: str, extension: str) -> str:
    return os.path.join(config.BASE_FOLDER, user_id, generate_id() + extension)

def generate_analysis_url(extension: str) -> str:
    return os.path.join('analytics/images', generate_id() + extension)