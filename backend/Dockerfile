FROM node:16.13.0

WORKDIR /web-app

COPY ./package*.json ./

RUN npm install

COPY ./.env ./

COPY ./dist ./

EXPOSE 80

CMD [ "node", "server.js" ]