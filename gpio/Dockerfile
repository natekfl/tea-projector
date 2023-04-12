FROM node:19-buster

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

COPY . ./

ENV UDEV=1

CMD ["npm", "start"]