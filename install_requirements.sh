#!/bin/bash

# Путь к файлу с зависимостями
REQUIREMENTS_FILE="requirements.txt"
LOCK_FILE=".requirements.lock"

# Проверка последнего времени изменения requirements.txt
if [ "$REQUIREMENTS_FILE" -nt "$LOCK_FILE" ]; then
    echo "Обновление зависимостей..."
    pip install --upgrade -r "$REQUIREMENTS_FILE"
    touch "$LOCK_FILE"
else
    echo "Зависимости актуальны."
fi