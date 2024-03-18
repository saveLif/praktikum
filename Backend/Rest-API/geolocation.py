import sqlite3
import psycopg2
import random
import datetime
import string

# Pfad zur SQLite-Datenbank
db_file = "C:\\telegraf\\tree.db"

# Verbindung zur SQLite-Datenbank
sqlite_conn = sqlite3.connect(db_file)
sqlite_cursor = sqlite_conn.cursor()

# Verbindung zur PostgreSQL-Datenbank
postgres_conn = psycopg2.connect(
    database='gruenflaeche',
    user='julian1234',
    password='baum',
    host='localhost',
    port='5432'
)
postgres_cursor = postgres_conn.cursor()

# Erstellen der Tabelle geolocation in PostgreSQL
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS geolocation(
    id SERIAL PRIMARY KEY,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL
)""")

# Abrufen von Daten aus der Tabelle "tree" in SQLite
sqlite_cursor.execute("""SELECT id, latitude, longitude FROM tree""")
rows = sqlite_cursor.fetchall()

for row in rows:
    tree_id, lat, lon = row
    postgres_cursor.execute("""INSERT INTO geolocation(latitude, longitude)
        OVERRIDING SYSTEM VALUE
        VALUES (%s, %s)""", (lat, lon))
