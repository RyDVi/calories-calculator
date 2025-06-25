bind = '127.0.0.1:8000'  # Прокси сервер будет работать на этом адресе и порту
workers = 3  # Количество воркеров (зависит от доступных ресурсов сервера)
user = 'root'  # Пользователь, под которым будет запущен Gunicorn
timeout = 120  # Таймаут на выполнение запроса
loglevel = 'info'  # Уровень логирования
accesslog = '/var/log/gunicorn/foodstat_access.log'  # Путь к логу доступа
errorlog = '/var/log/gunicorn/foodstat_error.log'  # Путь к логу ошибок