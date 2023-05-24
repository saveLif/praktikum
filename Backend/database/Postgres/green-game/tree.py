import psycopg2

# Tabelle für gamification


# Verbindung zur PostgreSQL-Datenbank herstellen
try:
    conn = psycopg2.connect(
        database="Wiese",
        user="Bruno",
        password="Rum",
        host="localhost",
        port="5432"
    )
except psycopg2.Error as e:
    print(e)

cur = conn.cursor()

# Tabelle erstellen
try:
    cur.execute("""CREATE TABLE IF NOT EXISTS tree(
    object_id int NOT NULL REFERENCES object(ID),
    points int NOT NULL,
    timestamp timestamp NOT NULL
    )""")
    # Tabelle erfolgreich erstellt
    print("Tabelle erfolgreich erstellt")
except psycopg2.Error as e:
    # Fehler beim Erstellen der Tabelle
    print(f"Fehler beim Erstellen der Tabelle: {e}")
finally:
    # Verbindung schließen
    conn.commit()

    cur.close()
    conn.close()