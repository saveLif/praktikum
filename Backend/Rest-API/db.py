# db.py
# stellt Verbindung zur Postgres Datenbank her
import psycopg2

"""Die Methode get_connection stellt die Verbindung mit der Postgres-Datenbank her.

Hierzu wird die Methode connect von der psycopg2 Bibliothek verwendet.
Hier werden die Argumente database, user, password, host, und port mit den entsprechenden Angaben die zu verbindung zur Datenbank benötigt werden angegeben
Wenn der Docker container postgres angesprochen werden soll, muss für den host die Angabe postgres getätigt werden
Die Methode gibt eine connection zurück.
""" 

def get_connection():
    return psycopg2.connect(
	database="gruenflaeche",
	user="julian1234",
	password="baum",
	#mit docker container host postgres ansonsten localhost
	host="postgres",
	#host="localhost",
	port="5432"
    )
