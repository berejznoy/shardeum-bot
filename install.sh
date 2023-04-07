#!/bin/bash

exists()
{
  command -v "$1" >/dev/null 2>&1
}

get_info_from_user()
{
  echo "Write IP address (example: 123.123.123.123) of NODE server:"
  read input
  export NODE_IP=$input
  echo "Write PORT of NODE server (just press enter for 8080):"
  read input
  if [ -z "$input" ]; then
    export NODE_PORT="8080"
  else
    export NODE_PORT=$input
  fi
  echo "Write YOUR DASHBOARD PASSWORD:"
  read input
  export DASHBOARD_PASSWORD=$input
  echo "Write Telegram BOT TOKEN:"
  read input
  export TELEGRAM_BOT_TOKEN=$input
  echo "Write YOUR MetaMask Wallet address:"
  read input
  export WALLET_ADDRESS=$input
}

ubuntu_install_requirements()
{
  sudo apt-get install -y git curl

  curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - &&\
  sudo apt-get install -y nodejs &&\
  sudo npm install pm2 -g
}

install_bot()
{
  if [ -d "$HOME/.bot" ]; then
    if pm2 list | grep -q "shardeum-bot"; then
      pm2 delete shardeum-bot >/dev/null
    fi
    rm -rf "$HOME/.bot"
  fi
    mkdir $HOME/.bot
    cd $HOME/.bot
    git clone https://github.com/berejznoy/shardeum-bot.git
    cd shardeum-bot

    npm i

    sudo echo "PORT=3000
BASE_URL=https://$NODE_IP:8080
DASHBOARD_PASSWORD=$DASHBOARD_PASSWORD
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
INTERVAL=60000
WALLET_ADDRESS=$WALLET_ADDRESS" > .env
npm run build &&\
pm2 start dist/index.js -n shardeum-bot
}

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  DISTRIB=$(awk -F= '/^NAME/{print $2}' /etc/os-release)
  if [[ ${DISTRIB} = '"Ubuntu"'* ]]; then
    if uname -a | grep -q '^Linux.*Microsoft'; then
      echo "ubuntu via WSL Windows Subsystem for Linux"
    else
      #echo "native ubuntu"
      ubuntu_install_requirements
      get_info_from_user
      install_bot
    fi
  elif [[ ${DISTRIB} = '"Debian"'* ]]; then
    echo "debian"
  fi
elif [[ "$OSTYPE" == '"darwin"'* ]]; then
  echo "macOS OSX"
fi
