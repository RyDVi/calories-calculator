from aiogram.utils.web_app import safe_parse_webapp_init_data

from backend.settings import TELEGRAM_BOT_TOKEN
import hashlib
import hmac
import time


def retrieve_tg_init_data(init_data):
    if not TELEGRAM_BOT_TOKEN:
        return None
    try:
        data = safe_parse_webapp_init_data(
            token=TELEGRAM_BOT_TOKEN, init_data=init_data
        )
    except ValueError:
        return None
    return data.model_dump()


def verify_telegram_auth_for_website(data: dict) -> bool:
    """
    Проверяет подлинность данных, полученных через Telegram OAuth.

    :param data: Данные, предоставленные Telegram (в виде словаря).
    :param bot_token: Секретный токен вашего бота.
    :return: True, если проверка успешна, иначе False.
    """
    # 1. Извлекаем hash из данных и удаляем его из проверки
    received_hash = data.pop("hash", None)
    if not received_hash:
        return False

    # 2. Проверяем срок действия данных (например, 1 час)
    auth_date = int(data.get("auth_date", 0))
    current_time = int(time.time())
    if current_time - auth_date > 3600:  # 1 час в секундах
        return False

    # выделяем только нужные для авторизации данные
    filtered_data = {key: value for [key, value] in data.items() if key in ["auth_date", "first_name", "hash", "id", "last_name", "photo_url", "username"] and value}
    
    # 3. Создаем строку данных в формате "key=value" и сортируем ключи
    data_check_string = "\n".join(
        f"{key}={value}" for key, value in sorted(filtered_data.items())
    )

    # 4. Создаем секретный ключ из токена бота
    bot_token = TELEGRAM_BOT_TOKEN
    secret_key = hashlib.sha256(bot_token.encode()).digest()

    # 5. Генерируем хеш с использованием HMAC-SHA256
    calculated_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    # 6. Сравниваем полученный hash с рассчитанным
    return hmac.compare_digest(calculated_hash, received_hash)
