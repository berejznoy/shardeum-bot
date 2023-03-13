
Скрипты, бот и тех поддержка Shardeum в группе https://t.me/shardeumrus 

# 1. Скрипт для перезапуска остановленной ноды без установки бота 

1. Установить screen: `sudo apt install screen`
2. Выполнить в консоли `screen -S monitor`
3. Выолнить в открывшейся консоли `wget -q -O node_control.sh https://raw.githubusercontent.com/mesahin001/shardeum/main/node_control.sh && chmod +x node_control.sh && sudo /bin/bash node_control.sh`
