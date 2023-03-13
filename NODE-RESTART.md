
Скрипты, бот и тех поддержка Shardeum в группе https://t.me/shardeumrus 

## 1. Скрипт для перезапуска остановленной ноды без установки бота 

1. Установить screen: `sudo apt install screen`
2. Выполнить в консоли `screen -S monitor`
3. Выолнить в открывшейся консоли `wget -q -O node_control.sh https://raw.githubusercontent.com/mesahin001/shardeum/main/node_control.sh && chmod +x node_control.sh && sudo /bin/bash node_control.sh`
4. Закрываем консоль

## 2. Остановка скрипта
1. Вводим в консоли ps -aux | grep node_control
2. Видим запись типа `root  385065  0.0  0.0  12328  4836 pts/3    S+   17:31   0:00 sudo /bin/bash node_control.sh`
3. **385065** - из примера - это PID процесса, у вас каждый раз будет разные цифры, запоминаем их или копируем и вставляем в код ниже вместо **385065**
4. `sudo kill -9 **385065**` - убьет процесс и остановит скрипт
