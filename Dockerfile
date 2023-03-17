FROM node:latest
RUN mkdir -p /app
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN adduser --system --group app
RUN npm install
RUN npm install --save pm2
RUN chown -R app /app
USER app
EXPOSE 3000
CMD [ "npm", "run", "pm2" ]