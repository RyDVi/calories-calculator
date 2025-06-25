from datetime import time, datetime
import typing

from recipes.constants import NameMealType



def get_mealtime_by_time(time_input: typing.Union[datetime, time, str]):
    """
    Определяет тип приема пищи по времени.
    
    Поддерживаемые форматы:
    - datetime.datetime
    - datetime.time
    - строка 'HH:MM' или 'HH:MM:SS'
    
    :param time_input: время в любом поддерживаемом формате
    :return: значение из NameMealType
    """
    # Извлекаем время из datetime, если передан datetime
    if isinstance(time_input, datetime):
        current_time = time_input.time()
    elif isinstance(time_input, time):
        current_time = time_input
    elif isinstance(time_input, str):
        try:
            # Пробуем разобрать строку (поддерживаем HH:MM и HH:MM:SS)
            time_parts = list(map(int, time_input.split(':')))
            if len(time_parts) >= 2:
                current_time = time(time_parts[0], time_parts[1])
            else:
                return NameMealType.SNACK
        except (ValueError, AttributeError, IndexError):
            return NameMealType.SNACK
    else:
        return NameMealType.SNACK

    hour = current_time.hour
    
    if 6 <= hour < 11:
        return NameMealType.BREAKFAST
    elif 11 <= hour < 13:
        return NameMealType.SNACK
    elif 13 <= hour < 15:
        return NameMealType.LUNCH
    elif 15 <= hour < 17:
        return NameMealType.SNACK
    elif 17 <= hour < 21:
        return NameMealType.DINNER
    else:
        return NameMealType.SNACK