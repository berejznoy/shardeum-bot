FROM node:latest
WORKDIR /app
COPY package.json .env ./
RUN adduser --system --group shardeum-bot
RUN npm install
RUN npm install --save pm2
RUN chown -R shardeum-bot /app
USER shardeum-bot
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "pm2" ]