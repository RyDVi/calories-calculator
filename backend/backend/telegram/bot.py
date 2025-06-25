from aiogram import Bot
from aiogram.enums import ParseMode

from backend.settings import TELEGRAM_BOT_TOKEN


bot = Bot(TELEGRAM_BOT_TOKEN, parse_mode=ParseMode.HTML)