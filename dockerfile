FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY nest-cli.json ./

RUN yarn install

COPY . .

EXPOSE 3000