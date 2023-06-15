from flask import jsonify
from db import get_connection
from flask import request  


"""Gibt Informationen zu dem Sensor wieder.




Hierzu wir deine Verbindung zur Datenbank hergetsellt um die Sensoren mit den entsprechenden messwerten die mit einem Objekt verknüpft sind mittels eines JOIN auszulesen 

Query-Parameter: 
ID: ID des Sensors

Rückgabewerte (JSON):
id: ID des Sensors
messured_variable: Messtyp
installation_date: Installationszeitpunkt des Sensors
location:
  geolocation:
    latitude: Breitengrad des Objektes
    longitude: Längengrad des Objektes
  height: Höhe des Sensors

"""

def get_sensor():

    id = request.args.get('ID')

     
    if id is None or id == "undefined":
        
        return "Bitte geben Sie eine gültige sensor_ID an"

    
    sensor_id = int(id)
    
    
    sql_select = """ SELECT sensor.id, sensor.measured_variable, sensor.installation_date, geolocation.latitude, geolocation.longitude, location.height FROM sensor INNER JOIN location ON sensor.location_id = location.id INNER JOIN geolocation ON location.geolocation_id = geolocation.id WHERE sensor.id = %s """

    
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(sql_select,(id,))
                row = cur.fetchone()
    finally:
        conn.close()

   
   
   
    
        return {

            'id': row[0],
            'messured_variable': row[1],
            'installation_date': row[2],
            'location': {
            "geolocation": {
              "latitude": row[3],
              "longitude": row[4] 
            },
            "height": row[5]
          }
            
        }
   



