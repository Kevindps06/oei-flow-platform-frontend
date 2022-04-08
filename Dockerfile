# Build Development
FROM node:16.13.0-alpine as development-builder

WORKDIR /oei-flow-platform-development

COPY package*.json ./

RUN npm install

COPY . .

RUN npx ng build --configuration=development

# Build Preproduction
FROM node:16.13.0-alpine as preproduction-builder

WORKDIR /oei-flow-platform-preproduction

COPY package*.json ./

RUN npm install

COPY . .

RUN npx ng build --configuration=preproduction

# Build Production
FROM node:16.13.0-alpine as production-builder

WORKDIR /oei-flow-platform-production

COPY package*.json ./

RUN npm install

COPY . .

RUN npx ng build --configuration=production

# Deploy
FROM nginx:1.21.6-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/configuration /etc/nginx

COPY nginx/content/html /var/www/html

COPY --from=development-builder /oei-flow-platform-development/dist /var/www/localhost

COPY --from=preproduction-builder /oei-flow-platform-preproduction/dist /var/www/lab.oeiprojectflow.org

COPY --from=production-builder /oei-flow-platform-production/dist /var/www/oeiprojectflow.org