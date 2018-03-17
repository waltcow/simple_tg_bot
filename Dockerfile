FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN mkdir -p netease

COPY netease/*  ./netease/

COPY ./index.js ./
RUN npm install
CMD [ "npm", "start" ]