FROM node:lts-alpine

COPY dist/ /app
WORKDIR /app

CMD npm start