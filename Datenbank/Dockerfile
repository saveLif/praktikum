FROM postgres:latest

ENV POSTGRES_USER julian1234
ENV POSTGRES_PASSWORD baum
ENV POSTGRES_DB gruenflaeche

COPY complete_script.sql /docker-entrypoint-initdb.d/complete_script.sql

RUN chmod 755 /docker-entrypoint-initdb.d/complete_script.sql