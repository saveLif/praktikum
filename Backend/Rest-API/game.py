from flask import jsonify
from db import get_connection
from flask import request  
import jwt
import datetime
import jwt
import bcrypt
import uuid
import base64
import io
from flask import Response


import psycopg2
from flask import Flask
from datetime import datetime
import math
from geopy.distance import geodesic

"""Die Methode gibt den nächsten Baum zurück, innerhalb des Toleranzradius, in dem sich der User befindet.

Hierzu wird eine Verbindung zur Datenbank aufgebaut. Sobald diese aufgebaut ist, werden
alle Objekte ausgelesen. Zu jedem Objekt wird die Entfernung zum User berechnet.
Das Object, was sich innerhalb des Toleranzradius befindet und am nächsten beim User ist, wird zurückgegeben.

Argumente:
user_latitude: Breitengrad des Users 
user_longitude: Längengrad des Users
tolerance_radius: Toleranzradius in Kilometern

Rückgabewert: 
object_id des nächsten Objekt

"""

def find_nearest_object_id(user_latitude, user_longitude, tolerance_radius):
 
    conn = get_connection()
    cur = conn.cursor()

    nearest_object_id = None
    nearest_distance = float('inf')
    try:
        cur.execute("SELECT ID, geolocation_id FROM object")
        objects = cur.fetchall()
        for object_id, geolocation_id in objects:
        
            cur.execute("SELECT latitude, longitude FROM geolocation WHERE id = %s", (geolocation_id,))
            object_latitude, object_longitude = cur.fetchone()
            # Entfernung zwischen Benutzer- und Objektkoordinaten berechnen
            distance = geodesic((user_latitude, user_longitude), (object_latitude, object_longitude)).kilometers
            # Wenn Entfernung innerhalb des Toleranzradius liegt und kleiner als bisher nächste Entfernung, speichere ID des Objekts
            if distance <= tolerance_radius and distance < nearest_distance:
                nearest_object_id = object_id
                nearest_distance = distance
    except psycopg2.Error as e:
        
        print(f'Fehler beim Bestimmen der ID des nächsten Objekts: {e}')

    return  nearest_object_id
    #return jsonify({'nearest_object_id': nearest_object_id}) zeile zum Postman testen

"""Speichert einen Gießvorgang des Users in die Datenbank.

Hierzu wird der aktuelle Zeitpunkt und der übergebene Toleranzradius verwendet um das nächste Objekt zu finden.
Sofern ein Baum in der Nähe ist, wird eine Verbindung zur Datenbank erstellt, um die die Punkte des nächsten Baums auszulesen.
Die Punkte des Baums, den User und der Zeitpunkt werden in einer Tabelle gespeichert.

Argumente:
user_id: ID des Users
user_latitude: Breitengrad des Users 
user_longitude: Längengrad des Users

Rückgabewert:
Gibt eine Mitteilung zurück ob der Vorgang erfolgreich war

"""  

def add_player(user_id, user_latitude: float, user_longitude: float):
    # Aktuellen Zeitstempel erstellen
    timestamp = datetime.now()
    tolerance_radius: float = 20

    # ID des nächsten Objekts bestimmen
    nearest_object_id = find_nearest_object_id(user_latitude, user_longitude, tolerance_radius)

    if nearest_object_id is not None:
        
        conn = get_connection()
        cur = conn.cursor()

        try:
            # Punktzahl des nächsten Objekts abrufen
            cur.execute("SELECT points FROM tree WHERE object_id = %s", (nearest_object_id,))
            points = cur.fetchone()[0]
        except psycopg2.Error as e:
          
            return f'Fehler beim Abrufen der Punktzahl: {e}'

        # ID des Benutzers, Punktzahl und Zeitstempel in Tabelle einfügen
        try:
            cur.execute("INSERT INTO game (id, points, timestamp) VALUES (%s, %s, %s)", (user_id, points, timestamp))
            conn.commit()
            return 'Spieler erfolgreich hinzugefügt'
        except psycopg2.Error as e:
            # Fehler beim Hinzufügen des Benutzers
            return f'Fehler beim Hinzufügen des Benutzers: {e}'
    else:
        return 'Kein nächstes Objekt gefunden'

