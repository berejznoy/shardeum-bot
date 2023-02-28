# shardium-push

1. Установить git sudo apt install git
2. Проверить что git установлен git --version
3. Установить nodejs (https://github.com/nodesource/distributions/blob/master/README.md)
4. Проверить что нода установилась node node --version
5. Создать и перейти в папку где будет лежать бот
6. Склонировать проект git clone https://github.com/berejznoy/status-pushover.git (Зарегистрироваться на https://github.com/, если нет аккаунта) 
7. Перейти в папку с проектом и установить пакеты cd /status-pushover npm i
8. Создать в папке с проектом файл .env touch .env
9. Записать следущие переменные 
10. echo "PORT=3000" >> .env -- порт на котором будет работать бот (можно указать любой свободный) 
11. echo "BASE_URL=https://DASBOARD_IP:8080" >> .env -- вместо DASBOARD_IP - указать ваш IP сервера
12. echo "DASHBOARD_PASSWORD=ПАРОЛЬ" >> .env -- вместо ПАРОЛЬ - указать ваш пароль от Дашборда 
13. echo "MODE=RESTART_ONLY" >> .env -- RESTART_ONLY - только для рестарта остановленной ноды (PUSH_AND_RESTART - если есть Pushover)
14. echo "INTERVAL=300000" >> .env -- Интервал проверки ноды 300000 миллисекунд = 5 минут, можно поставить 60000, будет 1 минута
15. Установить pm2 npm install pm2 -g
16. Запустить бота  pm2 start npm --name "pushover" -- start 
 
Для проверки можно остановить ноду и проверить что она снова запустилась через указанный интервал в пункте 14