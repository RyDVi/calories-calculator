# Информация по сборке
python 3.10-3.12
node 18

# Docker
## Запуск консоли в контейнере
docker exec -it <имя_контейнера> bash

Пример:
docker exec -it djangobackend bash
djangobackend без подчёркивания потому что хост не должен содержать нижнее подчёркивание

## Команды
docker-compose down --volumes --remove-orphans - удаление контейнеров
docker-compose up --build -d - поднятие контейнеров с предварительной сборкой (-d для запуска в фоне)
docker-compose up frontend - запуск только одного контейнера
docker network inspect app_network - проверка подключения контейнеров к сети
docker-compose -f docker-compose.prod.yml up --build - сборка прода
docker compose -f docker-compose.prod.yml build --no-cache nginx - пересбор nginx без использования кэша из предыдущих сборок 

docker system prune -a  - избавиться от старой сети. Удалит все существующие изображения и контейнеры.


# Opensearch
docker compose exec -it backend python manage.py opensearch index create - создание индексов 
docker compose exec -it backend python manage.py opensearch document index - индексация

https://stackoverflow.com/questions/51445846/elasticsearch-max-virtual-memory-areas-vm-max-map-count-65530-is-too-low-inc
В ubuntu может потребоваться увеличение виртуальной памяти. Для этого:
1) В /etc/sysctl.conf добавить
vm.max_map_count = 262144
2) Выполнить в консоли
sysctl -w vm.max_map_count=262144
3) Перезапустить докер
systemctl restart docker


# Загрузка venv
## loadenv скрипт
1. Запускаем в нужной оболочке python -m venv venv (если воспользуетесь другой оболочкой, то может не заработать - нужно повторить эту же команду с каждой используемой оболочкой, а предыдущий venv удалить)
2. Запускаем подгрузку .env и venv:
- В PowerShell: ./loadenv
- В Git Bash: source loadenv.sh
3. Проверям, что python и pip используются из виртуального окружения:
- В PowerShell: Get-Command python / Get-Command pip
- В Git Bash: which python / which pip

## Проблема с psycopg2 и psycopg2-binary для windows
Возможно, что понадобится установить Microsoft C++ Build Tools (будет написано https://visualstudio.microsoft.com/visual-cpp-build-tools/). Установите его со следующими пакетами:
Desktop Development with C++.
MSVC v142 - VS 2019 C++ x64/x86 Build Tools (или более позднюю версию).
Windows 10 SDK / Windows 11 SDK (необходим для разработки).

## Проблема с запуском действий с БД и запуском сервера
Если появилась ошибка следующая, то проверьте базу данных, возможно не создали подходящую.
File "...\foodstat\venv\Lib\site-packages\psycopg2\__init__.py", line 122, in connect
    conn = _connect(dsn, connection_factory=connection_factory, **kwasync)
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xc2 in position 55: invalid continuation byte

## .env для разработки (создайте .env если он отсутствует)
DJANGO_SECRET_KEY=mysecretkey
DEBUG=True
DJANGO_ALLOWED_HOSTS=*
POSTGRES_DB_NAME=foodstat
POSTGRES_USER_NAME=postgres
POSTGRES_USER_PASSWORD=1234
BASE_API_URL=/api/v1/

## direnv

1. Установка direnv
sudo apt update
sudo apt install direnv

или

curl -sfL https://direnv.net/install.sh | bash

!!! Проверить, что direnv установлен глобально в /usr/bin/direnv !!!

2. echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
3. source ~/.bashrc


# Backend
## Запуск локального https сервера
1. openssl genrsa -out devserver.key 2048
2. openssl req -new -x509 -key devserver.key -out devserver.crt -days 365 -subj "/CN=localhost"
3. В settings добавляем в DEBUG для разрешения безопасного соединения в режиме DEBUG
    SECURE_SSL_REDIRECT = False
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
4. django-admin runsslserver --certificate devserver.crt --key devserver.key

## Запуск локального https сервера. Вариант 2
Для запуска foodstat.ru локально (например, для проверки oauth у кнопок ТГ и ВК):
1. Изменить в settings.py свойства dev_server_protocol на https
2. Если работаете в windows установить с помощью chocolate утилиту mkcert и сгенерировать сертификаты (команда mkcert -install)
3. В vite.config.ts добавить:
import basicSsl from '@vitejs/plugin-basic-ssl';
const devServerOrigin = `https://${getServerIP()}:5173`;
basicSsl() - в plugins
4. Запускаем на django-admin runsslserver 0.0.0.0:443
5. В C:\Windows\System32\drivers\etc\hosts добавляем строку 
127.0.0.1 foodstat.ru
6. Теперь можно зайти через https://foostat.ru/ и работать с локальной версией при этом, например, ТГ будет думать, что запускается настоящий https://foodstat.ru/ (все запросы перенаправляются на 127.0.0.1) 


## Импорт/экспорт БД Postgres
- Экспорт:
datetime=$(date '+%Y%m%d_%H%M%S') && pg_dump -U food_app -h localhost -F c -b -v  -f  "foodstat_${datetime}.sql" food
datetime=$(date '+%Y%m%d_%H%M%S') && pg_dump -U food_app -h localhost -F c -f  "foodstat_${datetime}.dump" food

- Импорт:
Если не задали ранее пароль для postgres:
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'new_password';
\q 

Предварительно удаляем всю БД и создаём заново:
psql -U postgres -h localhost

DROP DATABASE food;
CREATE DATABASE food;

Восстанавливаем БД:
pg_restore -U postgres -h localhost -d food foodstat_20241221_225326.dump

datetime=$(date '+%Y%m%d_%H%M%S') && pg_dump -U food_app -h localhost food > "foodstat_${datetime}.sql"

- Импорт в Docker контейнер (вариант 2):
docker exec -i postgres_db pg_restore --verbose --clean --no-acl --no-owner -U food_app -d food < /var/www/foodstat_20250113_052629.dump
/var/www/foodstat_20250113_052629.dump - путь в ubuntu (машине - хосте), не в контейнере

## Команда add_off_products
Если необходимо импортировать данные из csv файла от Open Food Facts (например, импорт дельты продуктов за определенное время), то есть следующая команда:
python backend/manage.py add_off_products /var/www/parsed.11.01.2025.fr.openfoodfacts.org.products.csv
start_row - с какой строки импортировать данные

Если объём данных слишком большой в csv, то можно его уменьшить, выбрав только нужные для приложения данные функцией parse_off_products_csv(..., process_row=retrieve_our_fields_from_row). Обращаю внимание, что команда для этого не реализована, только функция.



# Frontend
1. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
2. source ~/.nvm/nvm.sh
3. nvm install 18
4. nvm use 18
5. nvm alias default 18


# Развертывание на сервере

## 1. Установка необходимых пакетов для ubuntu (устарело)
sudo apt-get update
sudo apt-get install nginx
sudo apt-get install gunicorn
sudo apt install postgresql
sudo apt install python3.10-dev
sudo apt install python-is-python3
sudo apt install python3.10-venv

apt-get update && apt-get install -y && \
    apt-get install -y libpq-dev build-essential gcc

## 1. Установка docker с docker-compose для ubuntu
sudo apt-get update


## 2. Генерация ssh ключа для github actions
На сервере:
cd ~/.ssh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
Задаём имя id_rsa_github без пароля

Вставляем из id_rsa_github.pub ключ (ssh-rsa ... your_email@example.com) в authorized_keys
Из id_rsa_github вставляем в SERVER_SSH_KEY в github secrets
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

Возможные проблемы:
1) Неправильно создан ключ или не добавлен в authorized_keys
2) указали не тот домен / ip-адрес
Чтобы это проверить:
1) Скопируйте на локальный ПК ключ id_rsa_github (желательно в ~/.ssh/id_rsa_github)
2) Запустите ssh -i ~/.ssh/id_rsa_foodstat <username_of_server_user>@<ip-address_of_server>
Если получилось войти без ввода пароля - всё ок, проблемы в github, если с паролем - проблемы в настройке ssh

## 3. Установка github secrets and variables

Variables:
- ALLOWED_HOSTS: <ip-address_of_server>,foodstat.ru,www.foodstat.ru
- BASE_API_URL: /api/v1/
- BASE_URL: /
- POSTGRES_DB_NAME: food
- POSTGRES_USER_NAME: food_app
- SERVER_HOST: foodstat.ru (либо ip-адрес сервера для соединения по ssh, если по какой-то причине нет домена)
- PGADMIN_DEFAULT_EMAIL: admin@admin.admin - Заменить на свой email

Secrets:
- POSTGRES_USER_PASSWORD - пароль к пользователю БД postgres
- SENTRY_AUTH_TOKEN - токен SENTRY
- SERVER_SSH_KEY - ключ для соединения по ssh
- SERVER_USER - имя пользователя на сервере (обычно root) для соединения по ssh
- TELEGRAM_BOT_TOKEN - токен для авторизации через ТГ приложение
- PGADMIN_DEFAULT_PASSWORD - пароль для входа в pgadmin

## 4. Настройка postgres
Добавить в /etc/postgresql/*/main/postgresql.conf (в файле найти строку listen_addresses)
listen_addresses = '*'

sudo -u postgres psql
CREATE DATABASE food;
CREATE USER food_app WITH PASSWORD '<user_password_from_POSTGRES_USER_PASSWORD>';
GRANT ALL PRIVILEGES ON DATABASE food TO food_app;

\du - проверить, что пользователь создан
\l - проверить, что БД создана
\dt - список таблиц в выбранной БД
use food - использовать базу данных food

## 5.1. Gunicorn
Скопировать следующий код для запуска службы, которая запускает Django, в каталог /etc/systemd/system/foodstat.service, где foodstat - название gunicorn сервиса:

---------------------

[Unit]
Description=gunicorn daemon for Foodstat Django project
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=/var/www/foodstat/backend
ExecStart=/var/www/foodstat/venv2/bin/gunicorn --config /var/www/foodstat/backend/gunicorn_config.py backend.wsgi:application

Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

---------------------

Настройки для gunicorn лежат в /backend/gunicorn_config.py. К этому конфигу сделали настройку выше, поэтому делать с ним ничего не требуется, если проект расположен по пути /var/www/foodstat/.

Применение изменений (если понадобится):
sudo systemctl daemon-reload
sudo systemctl enable foodstat.service
sudo systemctl start foodstat.service
sudo systemctl status foodstat.service


### 5.2. Настройка прав gunicorn (чтобы логи записывались)
sudo mkdir -p /var/log/gunicorn
sudo chown -R root:root /var/log/gunicorn

## 6. Пример nginx сервера
Пример лежит в [файле](./nginx)
Переместите nginx файл в /etc/nginx/sites-available/foodstat, где foodstat - наименование nginx файла

Затем создайте ссылку на него в sites-enabled:
ln -s /etc/nginx/sites-available/foodstat /etc/nginx/sites-enabled/foodstat

## 7. Запушить проект в github и запустить action main.yml (должен запуститься автоматически)

## 8. Запуск gunicorn и nginx
Проверям конфиг nginx, если не запущен - запускаем, запускаем gunicorn
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable gunicorn
sudo systemctl start gunicorn


## 9. SSL сертификация от Let's Encrypt (old)
Необходимо преобрести домен на текущий ip-адрес (foodstat.ru)
Необходимо добавить в nginx следующий конфиг:
location /.well-known/acme-challenge/ {
    root /var/www/certbot;
}
Необходимо настроить nginx на 80 порт, затем он сам создаст 443 с ssl.

sudo apt update 
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d foodstat.ru -d www.foodstat.ru
Введите ваш email для уведомлений о сроках действия сертификата.
Примите лицензионное соглашение.
Выберите автоматическую настройку редиректа с HTTP на HTTPS.


## 9. SSL сертификация от Let's Encrypt with docker (new)
https://www.programonaut.com/setup-ssl-with-docker-nginx-and-lets-encrypt/

Процедура сертификации с помощью certbot.
Если сертификат не создан, то:
1) Переходим в nginx.conf и комментируем весь код серера для 443 + комментируем редирект 301
2) Запускам certbot для создания сертификата
docker compose -f docker-compose.prod.yml  up -d certbot (обязательно без build)
3) Проверяем, что сертификат создан (с помощью логов certbot или с помощью перехода в nginx /etc/letsencrypt)
4) Расскомментируем всё из п.1
5) Создаём задачу на обновление сертификата. 

Перезапуск раз в 60 дней для создания нового сертификата (сертификат выдаётся на 90 дней):
```
crontab -e
0 5 1 */2 *  /usr/bin/docker compose -f /var/www/foodstat/docker-compose.prod.yml up certbot
```

Если сертификат создан, то делать дополнительно ничего не требуется.

### Генерация сертификатов-заглушек из openssl.cnf
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout privkey.pem -out fullchain.pem -config openssl.cnf


# APK build
1. Install, if you don't have them already, Node (v10 or higher), Java 8 and Android SDK.
2. Install Bubblewrap on your command line using this command:
npm i -g @bubblewrap/cli
3. Initialize Bubblewrap using a publicly-accessible URL to your manifest.json:
bubblewrap init --manifest https://www.example.com/manifest.json
4. Fill in the prompted form. In most cases, the default value is the right one.
5. If you need to specify a minimum or target Android SDK (API level), you can do it on the newly generated file /app/build.gradle under minSdkVersion and targetSdkVersion
6. Remove package="ru.foodstat.twa" from AndroidManifest.xml
7. Add <uses-permission android:name="android.permission.INTERNET" /> in AndroidManifest.xml
6. Build the TWA app using this command:
bubblewrap build
7. Test the app on your Android device using the newly created file app-release-signed.apk
8. Submit the app on Google Play by uploading the newly created file app-release-bundle.aab 

## Hide url bar in Android app
1. Generate SHA256
bubblewrap fingerprints

(Optional) Generate with keytool if bubblewrap fingerprints not worked. Need java install.
keytool -list -v -keystore android.keystore -alias android -storepass <your-password-for-keystore>

2. Copy row SHA-256 Fingerprint: <fingerprints_sha256>
3. In assetslinks.json write for all urls:

[{
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "ru.foodstat.twa",
      "sha256_cert_fingerprints": [
        <fingerprints_sha256>
      ]
    }
  }]