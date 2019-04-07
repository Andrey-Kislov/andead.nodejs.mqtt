FROM node:lts-alpine

COPY dist/ /app
WORKDIR /app

CMD node server.js