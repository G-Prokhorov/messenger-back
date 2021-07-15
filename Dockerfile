FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf

FROM postgres
ENV POSTGRES_DB messenger
COPY script.sql /docker-entrypoint-initdb.d/