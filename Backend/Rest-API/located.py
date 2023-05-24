from flask import jsonify
from db import get_connection
from flask import request  


"""Gibt die object_id zurück zu der abgefragten sensor_id zurück.

Wenn diese gültig ist wird eine Verbindung zur Datenbank hergestellt und die sensor_id mit den dazugehörigen Bäumen ausgelesen.

Query-Parameter: 
sensor_ID: ID des Sensors

Rückgabewert (JSON):
sensor_id: ID des Sensors 
object_id: ID des Objektes

"""
def get_located():
    id = request.args.get('sensor_ID')

     # Überprüft ob sensor_id parameter korrekt ist
    if id is None or id == "undefined":
     
        return "Bitte geben Sie eine gültige sensor_ID an"

 
    sensor_id = int(id)
    

    sql_select = """ SELECT object_id, sensor_id FROM located WHERE sensor_ID = %s """


    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(sql_select,(id,))
                row = cur.fetchone()
    finally:
        conn.close()



   
        return{

            'object_id': row[0],
            'sensor_id': row[1] 
        }
    