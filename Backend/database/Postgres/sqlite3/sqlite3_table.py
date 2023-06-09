import sqlite3
import psycopg2
from utm import to_latlon
import random
import datetime
import string

# importiert relevante Daten aus der sqlite Tabelle von der Stadt Braunschweig in Postgres. Die restlichen Daten sind Fake Daten

db_file= '/home/codetree/Downloads/trees.db'


# Connect to SQLite database
sqlite_conn = sqlite3.connect(db_file)
sqlite_cursor = sqlite_conn.cursor()

postgres_conn = psycopg2.connect(
    database='gruen',
    user='julian12342',
    password='baum2',
    host='localhost',
    port='5432'
)

postgres_cursor = postgres_conn.cursor()

postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS 
geolocation(id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY, latitude numeric NOT NULL, longitude numeric NOT NULL)""")

# Fetch data from SQLite table
sqlite_cursor.execute("""SELECT EAST, NORTH FROM tree""")
rows = sqlite_cursor.fetchall()
utm_zone = 32
for row in rows:
    east = row[0]
    north = row[1]
    lat, lon = to_latlon(east, north, utm_zone, northern=True)
    
    postgres_cursor.execute("""INSERT INTO geolocation(latitude, longitude) VALUES (%s, %s)""",(lat, lon))

postgres_cursor.execute("CREATE TABLE IF NOT EXISTS name(id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY, german text NOT NULL, botanical text NOT NULL)")


for i in range(92363):
    # Generate fake data
    german_name = "Fake German Name " + str(i)
    botanical_name = "Fake Botanical Name " + str(i)

    # Insert data into table
    postgres_cursor.execute(
        """INSERT INTO name(german, botanical) VALUES (%s, %s)""",
        (german_name, botanical_name)
    )

postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS description(id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
name_id integer NOT NULL REFERENCES name(id), origin text NOT NULL, leaf_shape text NOT NULL,
general_description text NOT NULL)""")
for i in range(92363):
    # Generate fake data
    name_id = i+1
    origin = "Fake orgin " + str(i)
    leaf_shape = "Fake leaf_shape" + str(i)
    general_description = "Fake general_description" +  str(i)



    # Insert data into table
    postgres_cursor.execute(
        """INSERT INTO description(name_id, origin, leaf_shape, general_description) VALUES (%s, %s, %s, %s)""",
        (name_id, origin, leaf_shape, general_description )
    )

postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS flowering_time(month smallint NOT NULL,
 description_id integer NOT NULL REFERENCES description(ID))""")

for i in range(92363):
    month1 = random.randint(1, 12)
    month2 = random.randint(1, 12)
    description_id = i + 1
    postgres_cursor.execute("INSERT INTO flowering_time(month, description_id) VALUES (%s, %s)", (month1, description_id))
    postgres_cursor.execute("INSERT INTO flowering_time(month, description_id) VALUES (%s, %s)", (month2, description_id))

postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS object(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    description text NOT NULL,
    geolocation_id integer NOT NULL REFERENCES geolocation(id),
    description_id integer NOT NULL REFERENCES description(ID)
)""")
sqlite_cursor.execute("""SELECT NAME_NUMBE FROM tree""")
rows = sqlite_cursor.fetchall()
i = 0
for row in rows:
    i= i+1
    description = row[0]
    
    # Generate fake data
    geolocation_id = i
    description_id = i

    postgres_cursor.execute("""INSERT INTO object(description, geolocation_id,
    description_id) VALUES (%s, %s, %s)""", (description, geolocation_id, description_id)) 

postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS location(id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
geolocation_id integer NOT NULL REFERENCES geolocation(id), height integer NOT NULL)""")
for i in range(92363):
    geolocation_id = i+1
   
    height = random.randint(10, 90)
    postgres_cursor.execute("""INSERT INTO location(geolocation_id , height)
    VALUES (%s, %s)""", (geolocation_id, height))

postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS sensor(id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
measured_variable text NOT NULL CHECK (measured_variable IN ('humidity', 'temperature', 'light')), 
installation_date date NOT NULL,
location_id INTEGER NOT NULL REFERENCES location(id))""")

for i in range(92363):
    measured_variable = 'humidity'
    installation_date = '2023-01-14'
    location_id = i+1

    postgres_cursor.execute("""INSERT INTO sensor(measured_variable,installation_date ,location_id)
    VALUES (%s, %s ,%s)""", (measured_variable, installation_date ,location_id))


postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS located(object_id integer NOT NULL REFERENCES object(ID),
sensor_id integer NOT NULL REFERENCES sensor(ID))""")

for i in range(92363):
    object_id = i+1
    sensor_id = i+1
    postgres_cursor.execute("""INSERT INTO located(object_id, sensor_id)
    VALUES (%s, %s)""", (object_id, sensor_id))

postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS measured_values(id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
value integer NOT NULL, timestamp timestamp NOT NULL, sensor_id integer NOT NULL REFERENCES sensor(id))""")
for i in range(92363):
    value = random.randint(20, 95)
    timestamp = '2023-01-13'
    sensor_id = i+1

    postgres_cursor.execute("""INSERT INTO measured_values(value, timestamp, sensor_id)
    VALUES (%s, %s, %s)""", (value, timestamp, sensor_id))






postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS tree(
    object_id int NOT NULL REFERENCES object(ID),
    points int NOT NULL,
    timestamp timestamp NOT NULL
    )""")

for i in range(150):
    object_id = i+1 
    points = 20  
    timestamp = '2023-01-14'
    postgres_cursor.execute("""INSERT INTO tree(object_id, points, timestamp)
    VALUES (%s, %s, %s)""", (object_id, points, timestamp))

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
for i in range(150):
    email = ''.join(random.choices(string.ascii_letters, k=10)) + '@example.com'
    password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    pseudonym = ''.join(random.choices(string.ascii_letters, k=10))
    postgres_cursor.execute("""INSERT INTO userprofil(email, password, pseudonym)
    VALUES (%s, %s, %s)""", (email, password, pseudonym))

postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS game(
        id int NOT NULL REFERENCES userprofil(ID),
        points int NOT NULL,
        timestamp timestamp NOT NULL
    )""")

postgres_cursor.execute("""CREATE TABLE IF NOT EXISTS reservation(
    user_id int NOT NULL REFERENCES userprofil(ID),    
    object_id int NOT NULL REFERENCES object(ID),
    timestamp timestamp with time zone NOT NULL
    )""")

postgres_conn.commit()
postgres_cursor.close()
postgres_conn.close()

