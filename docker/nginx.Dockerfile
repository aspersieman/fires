FROM nginx:1.19-alpine

WORKDIR /app/dist

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./dist/* /app/dist/
COPY ./docker/resolve-localdomain.sh /docker-entrypoint.d/30-resolve-localdomain.sh

RUN chmod +x /docker-entrypoint.d/30-resolve-localdomain.sh
