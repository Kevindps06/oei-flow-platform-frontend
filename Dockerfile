FROM node:16.13.0

WORKDIR /web-app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend ./

RUN npm run build

EXPOSE 80

CMD [ "node", "dist/server.js" ]