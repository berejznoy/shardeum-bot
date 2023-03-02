# 1. Установка бота ТГ

1. Установить git - `sudo apt install git`
2. Проверить что git установлен - `git --version`
3. Установить nodejs (https://github.com/nodesource/distributions/blob/master/README.md)
4. Проверить что нода установилась node - `node --version`
5. Создать и перейти в папку где будет лежать бот `mkdir shardeum-bot` затем `cd /shardeum-bot`
6. Склонировать проект `git clone https://github.com/berejznoy/status-pushover.git` (Зарегистрироваться на https://github.com/, если нет аккаунта) 
7. Перейти в папку с проектом `cd /status-pushover` и установить пакеты `npm i`
8. Заменить переменные\
   `YOUR_IP` - адрес сервера с нодой\
   `YOUR_PASSWORD` - пароль от Дашборда\
   `YOUR_TG_BOT_TOKEN` - токен вышего бота (полученный от https://t.me/BotFather)\
   в коде ниже и выполнить команду
```
sudo tee .env > /dev/null <<EOF
PORT=3000
BASE_URL=https://YOUR_IP:8080
DASHBOARD_PASSWORD=YOUR_PASSWORD
INTERVAL=60000
TELEGRAM_BOT_TOKEN=YOUR_TG_BOT_TOKEN
EOF
```
9. Установить pm2 - `npm install pm2 -g`
10. Запустить бота - `pm2 start npm --name "pushover" -- start`

