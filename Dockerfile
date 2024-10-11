FROM node:20-alpine as base
WORKDIR /app
COPY package.json yarn.lock ./
COPY hospital-lib/package.json ./hospital-lib/
COPY hospital-be/package.json ./hospital-be/
COPY hospital-fe/package.json ./hospital-fe/
RUN yarn install
COPY . .

FROM base as lib-builder
WORKDIR /app/hospital-lib
RUN yarn install
RUN yarn build:prod

FROM base as backend
COPY --from=lib-builder /app/hospital-lib/dist /app/hospital-lib/dist
WORKDIR /app/hospital-be
RUN yarn install
EXPOSE 7200
CMD ["yarn", "start"]

FROM base as frontend
COPY --from=lib-builder /app/hospital-lib/dist /app/hospital-lib/dist
WORKDIR /app/hospital-fe
RUN yarn install
EXPOSE 4200
CMD ["yarn", "start", "--host", "0.0.0.0"]