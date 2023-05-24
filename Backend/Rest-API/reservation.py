from flask import jsonify
from db import *;
from flask import request  
import datetime
import jwt
from flask import Response

from flask import Flask
from datetime import datetime
import math





"""Speichert die Reservierung des Users.

Hierzu wird eine Verbindung zur Datenbank aufgebaut, um die Reservierung abzuspeichern

Body (JSON):
timestamp: Zeitpunk der Reservierung in ISO-Format 8061

Argumente:
user_id: ID des Users
object_id: ID des Objektes

Rückgabewert (JSON):

user_id: ID des Users
object_id: ID des Objektes
timesamp: Reservierungszeitpunkt
"""
def reservation_post(user_id,object_id):

    
    data = request.get_json()
    
    
    timestamp = data['timestamp']

    
  

   
    sql_post = 'INSERT INTO reservation(user_id, object_id, timestamp) VALUES(%s, %s, %s);'
    
    conn = get_connection()
   
    cur = conn.cursor()
   
    cur.execute(sql_post, (user_id, object_id, timestamp))
    
    conn.commit()
   
    cur.close()
    conn.close()

    
    return jsonify({'user_id' : user_id, 'object_id' : object_id, 'timestamp' : timestamp})



"""Gibt alle zukünftige Reservierungen des Users zurück.

# Hierzu wird eine Verbindung zur Datenbank aufgebaut, um die Reservierungen des Users auszulesen.

Argumente:
user_id: Id des Users

Rückgabewert (JSON-Array):
description_id: ID der description
object_id: ID des Objektes
timesamp: Reservierungszeitpunkt

""" 


def reservation_get(user_id):
    
    conn = get_connection()
    cur = conn.cursor()
    
    ts = datetime.now()
    
    sql_select = '''
        SELECT reservation.timestamp, object.description, object.id
        FROM reservation
        INNER JOIN object ON reservation.object_id = object.id
        WHERE reservation.user_id = %s AND timestamp > %s ORDER BY timestamp ASC
    '''
    cur.execute(sql_select, (user_id, ts))
    rows = cur.fetchall()
    cur.close()

    reservation = []
    for row in rows:
        
       

        reservation.append({
            'timestamp' : row[0].isoformat(),
            'description':row[1],
            'object_id':row[2] 
            
        })
    return jsonify(reservation)


