FROM node:18.18-alpine

WORKDIR /

COPY ./package.json .

RUN npm install --omit=dev

COPY . .