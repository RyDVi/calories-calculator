#!/bin/bash

# Проверяем, существует ли файл .env
ENV_FILE="./.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "Файл .env не найден. Пожалуйста, убедитесь, что он существует в текущей директории."
    exit 1
fi

# Загружаем переменные из файла .env
echo "Загрузка переменных из файла .env..."
while IFS='=' read -r key value; do
    # Пропускаем пустые строки и комментарии
    if [[ -z "$key" || "$key" =~ ^# ]]; then
        continue
    fi

    # Удаляем лишние пробелы и кавычки
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs | sed 's/^["'"'"']//;s/["'"'"']$//')

    # Экспортируем переменные в текущую оболочку
    export "$key"="$value"
    echo "Загружена переменная: $key=$value"
done < "$ENV_FILE"

# Проверяем наличие виртуального окружения
VENV_PATH="./venv/Scripts/activate"
if [ ! -f "$VENV_PATH" ]; then
    echo "Виртуальное окружение не найдено. Создайте его с помощью команды 'python -m venv venv'."
    exit 1
fi

# Активируем виртуальное окружение
source "$VENV_PATH"
export DJANGO_SETTINGS_MODULE=backend.settings
export PYTHONPATH="./backend"
echo "Виртуальное окружение загружено"
