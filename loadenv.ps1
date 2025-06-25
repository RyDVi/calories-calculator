# Проверяем, существует ли файл .env
$envFilePath = ".\.env"
if (-Not (Test-Path $envFilePath)) {
    Write-Host "Файл .env не найден. Пожалуйста, убедитесь, что он существует в текущей директории." -ForegroundColor Red
    exit
}

# Загружаем переменные из файла .env
Get-Content $envFilePath | ForEach-Object {
    if ($_ -match "^\s*#") {
        # Пропускаем комментарии
        return
    }

    if ($_ -match "^\s*(.+?)=(.+?)\s*$") {
        # Устанавливаем переменные окружения
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
        Write-Host "Загружена переменная: $key=$value" -ForegroundColor Green
    }
}

# Проверяем наличие виртуального окружения и активируем его
$venvPath = ".\venv\Scripts\Activate.ps1"
if (-Not (Test-Path $venvPath)) {
    Write-Host "Виртуальное окружение не найдено. Создайте его с помощью команды 'python -m venv venv'." -ForegroundColor Red
    exit
}

# Активируем виртуальное окружение
. $venvPath
$env:DJANGO_SETTINGS_MODULE = "backend.settings"
$env:PYTHONPATH = $env:PYTHONPATH = "$($env:PYTHONPATH);./backend"
Write-Host "Виртуальное окружение загружено" -ForegroundColor Green