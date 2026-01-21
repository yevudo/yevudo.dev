FROM node:22.19.0-alpine

COPY . /app/temp
WORKDIR /app/temp

RUN npm ci && npm run build
# move build output to /app clean temp
RUN mv .output /app
# move ecosystem.config.cjs to /app
RUN mv ecosystem.config.cjs /app
# install pm2 globally
RUN npm i pm2 pm2-runtime -g
# clean temp
WORKDIR /app
RUN rm -rf /app/temp

EXPOSE 3000

# Запуск з PM2
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]

