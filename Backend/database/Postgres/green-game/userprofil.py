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
    cur.execute("""CREATE TABLE IF NOT EXISTS userprofil (
        ID SERIAL PRIMARY KEY,
        email text NOT NULL,
        password text NOT NULL,
        pseudonym text NOT NULL,
        token text NOT NULL DEFAULT 'Logout',
        user_picture BYTEA, 
        status text NOT NULL DEFAULT 'User',
        points INTEGER NOT NULL DEFAULT 0,
        CHECK (status IN ('User', 'Dienstleister', 'Admin'))
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



