import json
import psycopg2

# importiert JSON-Datenbank von Vivien Gräf in Postgres und dann von Nana Batta bearbeitet

# Stellt Verbindung zur Postgres Datenbank her
try:
    conn = psycopg2.connect(
    database='gruenflaeche',
    user='julian1234',
    password='baum',
    host='localhost',
    port='5432'
    )
except psycopg2.Error as e:

    print(e)

cur = conn.cursor()

file_paths = [
    "C:\\telegraf\\db.JSON",
    "C:\\telegraf\\description.JSON",
    "C:\\telegraf\\measured_values.JSON",
    "C:\\telegraf\\object.JSON",
    "C:\\telegraf\\sensor.JSON",
    "C:\\telegraf\\sensor_node.JSON",
]

object_data = {}

try:
    for file_path in file_paths:
        with open(file_path, "r") as f:
            data = json.load(f)
            object_data[file_path] = data
except FileNotFoundError:
     print("Die angegebene JSON-Datei wurde nicht gefunden.")



sql_create_table_geolocation = "CREATE TABLE geolocation(ID serial PRIMARY KEY, latitude numeric NOT NULL, longitude numeric NOT NULL)"
sql_create_table_object = """CREATE TABLE object(
    ID serial PRIMARY KEY,
    description text NOT NULL,
    geolocation_id integer NOT NULL REFERENCES geolocation(id),
    description_ID integer NOT NULL REFERENCES description(ID)
)"""
sql_create_table_located =  "CREATE TABLE located(object_id integer NOT NULL REFERENCES object(ID), sensor_id integer NOT NULL REFERENCES sensor(ID))"
try:
    cur.execute(sql_create_table_geolocation)
    cur.execute("CREATE TABLE name(ID serial PRIMARY KEY, german text NOT NULL, botanical text NOT NULL)")
    cur.execute("CREATE TABLE description(ID serial PRIMARY KEY, name_id integer NOT NULL REFERENCES name(id), origin text NOT NULL, leaf_shape text NOT NULL, general_description text NOT NULL)")
    cur.execute("CREATE TABLE flowering(month smallint NOT NULL, description_id integer NOT NULL REFERENCES description(ID))")
    cur.execute("CREATE TABLE location(ID serial PRIMARY KEY, geolocation_id integer NOT NULL REFERENCES geolocation(id), height integer NOT NULL)")
    cur.execute("CREATE TABLE sensor(ID serial PRIMARY KEY, measured_variable text NOT NULL, installation_date date NOT NULL, location_id integer NOT NULL REFERENCES location(id))")
    
    cur.execute(sql_create_table_object)
    cur.execute(sql_create_table_located)
    cur.execute("CREATE TABLE measured_values(ID serial PRIMARY KEY, value integer NOT NULL, timestamp timestamp NOT NULL, sensor_ID integer NOT NULL REFERENCES sensor(id))")    
except psycopg2.Error as e:
    print(e)
description_ids = {}    
for data in object_data['description']:
    try:
        cur.execute("INSERT INTO name(german, botanical) VALUES(%s, %s) RETURNING ID", (data['name']['german'], data['name']['botanical']))
        name_id = cur.fetchone()[0]
        cur.execute("INSERT INTO description(name_id, origin, leaf_shape, general_description) VALUES(%s, %s, %s, %s) RETURNING ID" , (name_id, data['origin'], data['leaf_shape'], data['general_description']))
        description_id = cur.fetchone()[0]
        for i in data['flowering_time']:
            cur.execute("""INSERT INTO flowering(month,description_id) VALUES(%s,%s)""",(i,description_id))
        description_ids[data['ID']] = description_id
        
    except psycopg2.Error as e:
        print(e)

sensor_ids = {}    

# Insert data into tables
for data in object_data['sensor']:
    try:
        cur.execute("INSERT INTO geolocation(latitude, longitude) VALUES(%s, %s) RETURNING ID", (data['location']['geolocation']['latitude'], data['location']['geolocation']['longitude']))
        geolocation_id = cur.fetchone()[0]
        cur.execute("INSERT INTO location(geolocation_id, height) VALUES(%s, %s) RETURNING ID", (geolocation_id, data['location']['height']))
        location_id = cur.fetchone()[0]
        cur.execute("INSERT INTO sensor(measured_variable, installation_date, location_id) VALUES(%s, %s, %s) RETURNING ID", (data['messured_variable'], data['installation_date'], location_id))
        sensor_id = cur.fetchone()[0]
        sensor_ids[data['ID']] = sensor_id 
    except psycopg2.Error as e:
        print(e)


for data in object_data['object']:

    sql_insert_into_geolocation = "INSERT INTO geolocation(latitude, longitude) VALUES(%s, %s) RETURNING ID"
    sql_insert_into_object = "INSERT INTO object(description, geolocation_id, description_ID) VALUES(%s, %s, %s) RETURNING ID"

    cur.execute(sql_insert_into_geolocation, (data['geolocation']['latitude'], data['geolocation']['longitude']))

    geolocation_id = cur.fetchone()[0]

    cur.execute(sql_insert_into_object, (data['description'], geolocation_id, description_ids[data['description_ID']]))
    object_id = cur.fetchone()[0]
    cur.execute("""INSERT INTO located(object_id, sensor_id) VALUES(%s, %s)""", (object_id, sensor_ids[data['sensor_node_ID']]) )
# Insert data into table
for data in object_data['measured_values']:
    try:
        cur.execute("INSERT INTO measured_values(value, timestamp, sensor_ID) VALUES(%s, %s, %s)", (data['value'], data['timestamp'], sensor_ids[data['sensor_ID']]))
    except psycopg2.Error as e:
        print(e)

conn.commit()

cur.close()
print("Carsten was los")
conn.close()
