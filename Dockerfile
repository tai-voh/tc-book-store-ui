
FROM node:18.16.1 AS build
WORKDIR /app
RUN npm cache clean --force
COPY . .
RUN npm install
RUN npm run build


FROM nginx:latest AS ngi
COPY --from=build /app/dist/tc-book-store-ui /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 4200