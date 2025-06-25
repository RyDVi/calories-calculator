from openai import OpenAI

from backend.settings import PROXY_API_KEY

client = OpenAI(api_key=PROXY_API_KEY, base_url="https://api.proxyapi.ru/openai/v1")