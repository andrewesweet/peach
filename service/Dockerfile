FROM node:14-slim

WORKDIR /user/src/app

COPY package*.json ./
COPY dist ./

RUN npm ci --production

CMD [ "node", "index.js" ]