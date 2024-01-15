FROM postgres:latest

ENV POSTGRES_USER julian1234
ENV POSTGRES_PASSWORD baum
ENV POSTGRES_DB gruenflaeche

COPY output.sql /docker-entrypoint-initdb.d/output.sql

RUN chmod 755 /docker-entrypoint-initdb.d/output.sql



