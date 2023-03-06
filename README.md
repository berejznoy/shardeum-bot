### 1. Install bot 

1. Install git - `sudo apt install git`
2. Check git version - `git --version`
3. Install Nodejs (https://github.com/nodesource/distributions/blob/master/README.md)
4. Check NodeJs cersion - `node --version`
5. Create folder for bot `mkdir shardeum-bot` and go to `cd shardeum-bot`
6. Clone project `git clone https://github.com/berejznoy/status-pushover.git`
7. Go to `cd status-pushover` and run `npm i`
8. Change variables\
   `YOUR_IP` - Shardeum Dashboard IP\
   `YOUR_PASSWORD` - Paasword of Dashboard\
   `YOUR_TG_BOT_TOKEN` - Telegram bot token (Go to https://t.me/BotFather for get it) \
   and run below command
```
sudo tee .env > /dev/null <<EOF
PORT=3000
BASE_URL=https://YOUR_IP:8080
DASHBOARD_PASSWORD=YOUR_PASSWORD
INTERVAL=60000
TELEGRAM_BOT_TOKEN=YOUR_TG_BOT_TOKEN
EOF
```
9. Install pm2 - `npm install pm2 -g`
10. Run bot - `pm2 start npm --name "shardeum-bot" -- start`

### 2. Stop bot
   `pm2 stop shardeum-bot`

### 3. Restart bot 
   `pm2 start shardeum-bot`
   
### 4. Check bot
   `pm2 list` \

   
## Update bot
1. Go to bot folder
2. Run `pm2 delete shardeum-bot` to delete bot
3. Run `git pull` to download update
4. Run `npm i` to install dependencies
5. Run `pm2 start npm --name "shardeum-bot" -- start` - to start bot
6. Run `pm2 list` to check bot

## To check the logs, run  `pm2 log` 

Error: Failed to get token: AxiosError: Request failed with status code 403
Solution: Rewrite your password in .env file
