import json
from flask import jsonify
from db import get_connection
from flask import request  
from decimal import Decimal

"""Gibt Informationen zu allen Objekt zurück.

Hierzu wird eine Verbindung zu Datenbank aufgebaut, um die Objekte auszulesen.

Rückgabewert (JSON-Array):
ID : ID des Objektes
description: Beschreibung des Objektes
description_ID: ID der description
geolocation:
    latitude: Breitengrad des Objektes
    longitude: Längengrad des Objektes

""" 
def get_list():
    
    sql_select = """SELECT object.id,
    description, description_id,
    latitude,
    longitude 
    FROM object INNER JOIN geolocation ON object.geolocation_id=geolocation.id"""

    num = Decimal('3.20')
    json_str2 = json.dumps({'gehalt': num}, default=str)
    print(json_str2)

    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(sql_select)
                rows = cur.fetchall()
    finally:
        conn.close()


    num = Decimal('3.14')
    json_str = json.dumps({'salary': num}, default=str)
    print(json_str)

    objects = []
    for row in rows:
        objects.append({
            "ID":row[0],
            "description": row[1],
            "description_ID": row[2],
            "geolocation": {
                "latitude": row[3],
                "longitude": row[4]
            }
        })

    return objects


"""Gibt Informationen zu einem Objekt zurück.

Hierzu wird eine Verbindung zu Datenbank aufgebaut, um das Objekt auszulesen.

Rückgabewert (JSON-Array):
ID : ID des Objektes
description: Beschreibung des Objektes
description_ID: ID der description
geolocation:
    latitude: Breitengrad des Objektes
    longitude: Längengrad des Objektes

""" 



def get_object_id():
    id = request.args.get('ID')




   
    sql_select = """SELECT object.id, description, description_id, latitude, longitude FROM object INNER JOIN geolocation ON object.geolocation_id=geolocation.id WHERE object.ID = %s"""

    
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(sql_select,(id,))
                rows = cur.fetchall()
    finally:
        conn.close()

    
    objects = []
    for row in rows:
        objects.append({
            "ID":row[0],
            "description": row[1],
            "description_ID": row[2],
            "geolocation": {
                "latitude": row[3],
                "longitude": row[4]
            }
        })

    return objects


"""Gibt Informationen zu allen Objekt zurück.

Hierzu wird eine Verbindung zu Datenbank aufgebaut, um die Objekte auszulesen.

Rückgabewert (JSON-Array):
ID : ID des Objektes
description: Beschreibung des Objektes
description_ID: ID der description
geolocation:
    latitude: Breitengrad des Objektes
    longitude: Längengrad des Objektes

""" 

def get_object(pageNumber = 0, lim = 10):
    

     

    startline = int(pageNumber) * int(lim);
    sql_select = """SELECT obj.id, obj.description, obj.description_id, geo.latitude, geo.longitude FROM object obj INNER JOIN geolocation geo ON obj.geolocation_id=geo.id WHERE 
    obj.id > """ + str(startline) + """ ORDER BY obj.id ASC limit """ + str(lim);

    
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(sql_select)
                rows = cur.fetchall()
    finally:
        conn.close()

    
    objects = []
    for row in rows:
        objects.append({
            "ID":row[0],
            "description": row[1],
            "description_ID": row[2],
            "geolocation": {
                "latitude": str(row[3]),
                "longitude": str(row[4])
            }
        })

    return jsonify(objects)












    





            




  
 



