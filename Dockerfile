FROM node:16 as build

RUN mkdir -p /usr/local/src/twaddle/web
WORKDIR /usr/local/src/twaddle/web

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

COPY .env* .
COPY tailwind.config.js ./tailwind.config.js
COPY src ./src
COPY public ./public
RUN npm run build

FROM nginx:1.21 as production

COPY --from=build /usr/local/src/twaddle/web/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
