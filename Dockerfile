FROM node:carbon

WORKDIR /app

COPY package*.json ./
COPY . /app

RUN npm install
# RUN npm run build:dll
# RUN npm run build

CMD [ "npm", "run", "start:production" ]

EXPOSE 3001