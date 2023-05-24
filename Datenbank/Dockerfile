FROM postgres:latest

ENV POSTGRES_USER julian1234
ENV POSTGRES_PASSWORD baum
ENV POSTGRES_DB gruenflaeche

COPY init.sql /docker-entrypoint-initdb.d/init.sql

RUN chmod 755 /docker-entrypoint-initdb.d/init.sql



