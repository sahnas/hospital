FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 7200

ENV HOSTNAME "0.0.0.0"

CMD ["yarn", "start"]