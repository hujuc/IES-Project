# Build vite project and put it in a nginx container
FROM node:18 AS build-stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build-stage /app/dist /usr/share/nginx/html