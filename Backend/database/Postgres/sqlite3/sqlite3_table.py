import sqlite3
import psycopg2
import random
import datetime
import string

# importiert relevante Daten aus der sqlite Tabelle von der Stadt Braunschweig in Postgres. Die restlichen Daten sind Fake Daten

db_file= "C:\\telegraf\\tree.db"


# Connect to SQLite database
sqlite_conn = sqlite3.connect(db_file)
sqlite_cursor = sqlite_conn.cursor()

postgres_conn = psycopg2.connect(
    database='gruenflaeche',
    user='julian1234',
    password='baum',
    host='localhost',
    port='5432'
)
column_ind = dict()


columns = ["id","PITID","KST","ANLAG_OBJN","AKTENZEICH","STANDORT_N","KENNZEICHE","NAME_NUMBE","NAME_BEZIR","NAME","GEFAELLT","LAUFENDE_N","ART_BOTANI","ART_DEUTSC","STAMMUMFAN","KRONNENDUR","BAUMHOEHE","ZUSATZ","ERSTERFASS","REGEL_KONT","EAST","NORTH","FAELLDATUM","NAME_D","MESS_ART","MESS_DATUM","VITALITAET","longitude","latitude"]
for index, column_name in enumerate(columns)  : 
    column_ind[column_name] = index

postgres_cursor = postgres_conn.cursor()

# Abrufen von Daten aus der Tabelle "tree" in SQLite
sqlite_cursor.execute("""SELECT * FROM tree""")
rows = sqlite_cursor.fetchall()


#################################################################################geolocation
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS geolocation(
    id INT PRIMARY KEY,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL
)""")

for row in rows:
    id = row[column_ind['id']]
    lat = row[column_ind['latitude']]
    lon = row[column_ind['longitude']]

    postgres_cursor.execute("""INSERT INTO geolocation(id, latitude, longitude)
        VALUES (%s, %s, %s)""", (id, lat, lon))
postgres_conn.commit()


#########################################################################################name
postgres_cursor.execute("CREATE TABLE IF NOT EXISTS name(id integer PRIMARY KEY, german text NOT NULL, botanical text NOT NULL)")

for row in rows:
    german = row[column_ind['ART_DEUTSC']]
    botanical = row[column_ind['ART_BOTANI']]
    id = row[column_ind['id']]

    # Insert data into table
    postgres_cursor.execute(
        """INSERT INTO name(id, german, botanical) VALUES (%s, %s, %s)""",
        (id, german, botanical)
    )
postgres_conn.commit()


################################################################################description
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS description(
id integer PRIMARY KEY, 
name_id integer NOT NULL REFERENCES name(id), 
origin text NOT NULL, 
leaf_shape text NOT NULL,
general_description text NOT NULL)""")

for row in rows:
    id = row[column_ind['id']]
    origin = row[column_ind['PITID']] or "default origin"
    leaf_shape = row[column_ind['NAME']] or "default leaf_shape"
    general_description = row[column_ind['NAME_NUMBE']]

    # Insert data into table
    postgres_cursor.execute(
        """INSERT INTO description(id, name_id, origin, leaf_shape, general_description) VALUES (%s,%s, %s, %s, %s)""",
        (id, id, origin, leaf_shape, general_description )
    )
postgres_conn.commit()


############################################################################flowering_time
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS flowering_time(
month smallint NOT NULL,
description_id integer NOT NULL REFERENCES description(id))""")

for row in rows:
    id = row[column_ind['id']]
    month1 = random.randint(1, 12)
    month2 = random.randint(1, 12)
    postgres_cursor.execute(
        """INSERT INTO flowering_time(month, description_id) VALUES (%s,%s)""",
        (month1, id)
    )

    postgres_cursor.execute(
        """INSERT INTO flowering_time(month, description_id) VALUES (%s,%s)""",
        (month2, id)
    )
postgres_conn.commit()    


###################################################################################object
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS object(
    id integer PRIMARY KEY,
    description text NOT NULL,
    geolocation_id integer NOT NULL REFERENCES geolocation(id),
    description_id integer NOT NULL REFERENCES description(id)
)""")

for row in rows:
    id = row[column_ind['id']]
    description = row[column_ind['NAME_NUMBE']]
    postgres_cursor.execute(
        """INSERT INTO object(id, description, geolocation_id, description_id) VALUES (%s,%s,%s,%s)""",
        (id, description, id, id)
    )
postgres_conn.commit() 


###################################################################################lo0cation
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS location(
    id integer PRIMARY KEY,
    geolocation_id integer NOT NULL REFERENCES geolocation(id), 
    height integer NOT NULL
)""")

for row in rows:
    id = row[column_ind['id']]
    height = row[column_ind['BAUMHOEHE']]
    postgres_cursor.execute(
        """INSERT INTO location(id, geolocation_id, height) VALUES (%s,%s,%s)""",
        (id, id, height)
    )
postgres_conn.commit()  


###################################################################################sensor
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS sensor(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    measured_variable text NOT NULL CHECK (measured_variable IN ('humidity', 'temperature', 'light')), 
    installation_date date NOT NULL,
    location_id INTEGER NOT NULL REFERENCES location(id)
)""")

for row in rows:
    id = row[column_ind['id']]
    measured_variable = 'humidity'
    installation_date = '2023-01-14'

    postgres_cursor.execute("""INSERT INTO sensor(measured_variable,installation_date ,location_id)
    VALUES (%s, %s ,%s)""", (measured_variable, installation_date ,id))
postgres_conn.commit() 


# ####################################################################################located
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS located(
    object_id integer NOT NULL REFERENCES object(id),
    sensor_id integer NOT NULL REFERENCES sensor(id)
)""")

for row in rows:
    id = row[column_ind['id']]
    postgres_cursor.execute("""INSERT INTO located(object_id, sensor_id)
    VALUES (%s, %s)""", (id, id))
postgres_conn.commit() 


###############################################################################measured_values   
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS measured_values(
    id integer PRIMARY KEY,
    value integer NOT NULL, 
    timestamp timestamp NOT NULL, 
    sensor_id integer NOT NULL REFERENCES sensor(id)
    )""")

for row in rows:
    id = row[column_ind['id']]
    value = random.randint(20, 95)
    timestamp = '2023-01-13'
    postgres_cursor.execute("""INSERT INTO measured_values(id, value, timestamp, sensor_id)
    VALUES (%s, %s, %s, %s)""", (id, value, timestamp, id))
postgres_conn.commit()


###########################################################################################tree
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS tree(
    object_id int NOT NULL REFERENCES object(id),
    points int NOT NULL,
    timestamp timestamp NOT NULL
    )""")

for row in rows:
    id = row[column_ind['id']] 
    points = 20  
    timestamp = '2023-01-14'
    postgres_cursor.execute("""INSERT INTO tree(object_id, points, timestamp)
    VALUES (%s, %s, %s)""", (id, points, timestamp))
postgres_conn.commit()
    

######################################################################################userprofil
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS userprofil (
        id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        email text NOT NULL,
        password text NOT NULL,
        pseudonym text NOT NULL,
        token text NOT NULL DEFAULT 'Logout',
        user_picture BYTEA, 
        status text NOT NULL DEFAULT 'User',
        points INTEGER NOT NULL DEFAULT 0,
        CHECK (status IN ('User', 'Dienstleister', 'Admin'))
    )""")
for i in range(20):
    email = ''.join(random.choices(string.ascii_letters, k=10)) + '@example.com'
    password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    pseudonym = ''.join(random.choices(string.ascii_letters, k=10))
    postgres_cursor.execute("""INSERT INTO userprofil(email, password, pseudonym)
    VALUES (%s, %s, %s)""", (email, password, pseudonym))


#########################################################################################game
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS game(
        id int NOT NULL REFERENCES userprofil(id),
        points int NOT NULL,
        timestamp timestamp NOT NULL
    )""")
postgres_conn.commit()


##################################################################################reservation
postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS reservation(
    user_id int NOT NULL REFERENCES userprofil(id),    
    object_id int NOT NULL REFERENCES object(id),
    timestamp timestamp with time zone NOT NULL
    )""")
postgres_conn.commit()

postgres_cursor.close()
postgres_conn.close()