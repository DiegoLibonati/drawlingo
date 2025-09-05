FROM node:20.5.0-alpine3.18

WORKDIR /home/app

COPY ./package*.json .

RUN yarn install

COPY . .

EXPOSE 5000

CMD ["yarn", "run", "dev"]