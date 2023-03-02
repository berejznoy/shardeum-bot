# 1. Скрипт для перезапуска остановленной ноды без установки бота 

1. `cd shardeum`
2. `./shell.sh`
3. ввести в консоль 
```
sudo tee restart.sh > /dev/null <<EOF
#!/bin/sh

check_status() {
 while :
 do 
     if operator-cli status | grep "stopped"; then
         echo "---Trying to restart---"
         operator-cli start
     elif operator-cli status | grep "standby"; then
         echo "Waiting for active status"
     fi
 sleep 30
 done
}

main() {
  echo "start main"
  check_status
}
main
EOF
```
4. `sudo chmod +x restart.sh`
5. `./restart.sh &`
6. Закрыть консоль, остановить ноду и проверить что через 30 сек она снова запустилась

### Если по какой-то причине остановится сам контейнер, то чтобы запустить скрипт заново, нужно сделать 
`docker start shardeum-dashboard`, 
### а затем пункты 1, 2, 5
