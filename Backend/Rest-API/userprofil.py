from flask import jsonify
from db import *
from flask import request  
import jwt
import datetime
import bcrypt
import base64
import io
from flask import Response
import functools
from datetime import datetime, timedelta
import json
from validator import isValidEmail
from validator import isValidPasswort
#from validator import isValidPseudonym





"""Gibt Ranglisteninformationen des Users zurück.

Filtert die Informationen des Users aus der Rangliste zum gewünschten Zeitraum.

Query-Parameter:
start_time: Startzeitpunkt
end_time: Endzeitpunt


Argumente:
user_id: ID des Users


Rückgabewert (JSON):
id: ID des Users
platzierung: Platzierung des Users
pseudonym: Pseudonym des Users
points: Punkte des Users
level: Level des Users
rangstatus: Rangstatus des Users

"""
def get_user_rank(user_id):
    ranking = get_rank()
    for user in json.loads(ranking.data):
        if user['id'] == user_id:
            return user
    return 'User not found'


"""Gibt Ranglisteninformationen aller User zurück.

Gibt die Informationen der User aus der Rangliste zum gewünschten Zeitraum zurück.

Query-Parameter:
start_time: Startzeitpunkt
end_time: Endzeitpunt





Rückgabewert (JSON-Array):
id: ID des Users
platzierung: Platzierung des Users
pseudonym: Pseudonym des Users
points: Punkte des Users
level: Level des Users
rangstatus: Rangstatus des Users

"""
def get_rank():
    
    week_start = request.args.get('start_time')
    week_end= request.args.get('end_time')
    conn = get_connection()
    cur = conn.cursor()
    if not week_start and not week_end:
        now = datetime.now()
        week_start = now.replace(hour=0,minute=0,second=0, microsecond=0)-timedelta(days = now.weekday())
        week_end = week_start + timedelta(days=7)
    cur.execute("""SELECT userprofil.id, userprofil.pseudonym, SUM(game.points) as points
                FROM userprofil
                JOIN game ON userprofil.id = game.id
                WHERE game.timestamp >= %s AND game.timestamp < %s
                GROUP BY userprofil.id                             
                ORDER BY points DESC""", (week_start, week_end))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    users = []
    index = 0

    for i in rows:
        level = get_level(i[2])
        status = get_status(i[2])
        index = index + 1
        users.append({'id': i[0], 'platzierung': index, 'pseudonym': i[1], 'points': i[2], 'level': level, 'rangstatus': status})

    return jsonify(users)


"""Berechnet das Level des Users.

Für Level n werden 5*n*(n+1) Punkte benötigt.

Argumente:
points: punkte des Users

Rückgabewert:
level: Level des Users

"""  

def get_level(points):
    level = 0
    required_points = 0
    while points >= required_points:
        level += 1
        required_points += level * 10
    return level


"""Berechnet das Level des Users.

Für Level n werden 5*n*(n+1) Punkte benötigt.

Argumente:
points: punkte des Users

Rückgabewert:
level: Level des Users

"""  

"""Berechnet das Status des Users.

Für jedes zehnte Level erhält der User einen neuen Namen bis Level 100 .

Argumente:
points: punkte des Users

Rückgabewert:
status: Status des Users

"""  

def get_status(points):
    level = get_level(points)
    if level <= 10:
        status = "Grasshüpfer"
    elif level <= 20:
        status = "Käfer"
    elif level <= 30:
        status = "Maus"
    elif level <= 40:
        status = "Frosch"
    elif level <= 50:
        status = "Eichhörnchen"
    elif level <= 60:
        status = "Elefant"
    elif level <= 70:
        status = "Mammut"
    elif level <= 80:
        status = "Dinosaurier"
    elif level <= 90:
        status = "Saurier"
    elif level <= 100:
        status = "Säbelzahntiger"
    else:
        status = "Regengott"
    return status


""" Gibt die Profildaten des Users zurück.

Hierzu wird eine Verbindung zur Datenbak hergestellt um die Profildaten des Users auszulesen

Argumente:
user_id: ID des Users  

Rückgabewert (JSON):
id: ID des Users
pseudonym: Pseudonym des Users
points: Punkte des Users
level: Level des Users 
status: Status des Users

"""

def get_user_profile_points(user_id):
    conn = get_connection()
    cur = conn.cursor()

    try:
        
        cur.execute("SELECT userprofil.id, userprofil.pseudonym, SUM(game.points) FROM userprofil JOIN game ON userprofil.id = game.id WHERE userprofil.id = %s GROUP BY userprofil.id", (user_id,))
        user_data = cur.fetchone()
    except psycopg2.Error as e:
        return {"error": f'Fehler beim Abrufen des Benutzerprofils und Punkten: {e}'}
    
    if user_data is None:
        return {"error": "kein Benutzer gefunden"}

    level = get_level(user_data[2])
    status = get_status(user_data[2]) 
    cur.close()
    conn.close()
    return {"id": user_data[0], "pseudonym": user_data[1], "points": user_data[2], "level": level, "status": status}


"""Erstellt für den User einen JWT-Token. 

Hierzu wird ein payload angelegt mit email als Abhängigkeit und exp mit Laufzeit von einem Tag des Tokens.
Der verwendete Algorithmus ist HMAC mit SHA-256 und es wird ein statischer Geheimschlüssel benutzt.

Argumente:
email: Email des Users

Rückgabewert:
token: Token des Users

"""
def create_token(email):
    payload = {
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    secret_key = 'my-secret-key'
    
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token

"""Registriert User in einer Tabelle.

Hierzu wird eine Verbindung zur Datenbank hergestellt, um den User zu registrieren
sofern dieser noch nicht registriert ist.


Body (JSON):
email: Email des Users
pseudonym: Pseudonym des Users
password: Passwort des Users

Rückgabewert (JSON):
pseudonym: Pseudonym des Users
 
"""

def post_register():
    data = request.get_json()
    email = data['email']
    pseudonym = data['pseudonym']
    password = data['password']

    if(not isValidEmail(email)):
      return jsonify({'error': 'Invalid address email'}), 409
    
    if(not isValidPasswort(password)):
      return jsonify({'error': 'Invalid password'}), 409
    
   # if(not isValidPseudonym(pseudonym)):
   #   return jsonify({'error': 'Invalid pseudonym'}), 409
    
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""SELECT * FROM userprofil WHERE email = %s OR pseudonym = %s""", (email, pseudonym))
    user = cur.fetchone()

    if user is not None:
        return jsonify({'error': 'Email or pseudonym already in use'}), 409
    else:
        cur.execute("""INSERT INTO userprofil (email, pseudonym, password) VALUES (%s, %s, %s)""", (email, pseudonym, password))
        conn.commit()
        conn.close()

        return jsonify({'pseudnym': pseudonym})


"""Überprüft die Anmeldedaten des Users und meldet diesen erfolgreich an

Hierzu wird eine Verbidnung zur  Datenbank erstellt, um den User in den Login zu ermöglichen.
Sofern das angegebene Passwort des Users mit dem was in der Datenbank steht übereinstimmt, wird für den user ein Token erzeugt.
Dieser wird in der Datenbank durch den Default-Token des User ersetzt
Somit wir symbolisiert das der User eingeloggt ist.

Body (JSON):
login_identifier: User wählt zwischen Pseudonym und email zur Anmeldung
password: Passwort des Users

Rückgabewert (JSON):
token: Token des Users
user_id: ID des Users

"""


def post_login():
    data = request.get_json()
    login_identifier = data['login_identifier'] 
    password = data['password']

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""SELECT * FROM userprofil WHERE email = %s OR pseudonym = %s""", (login_identifier, login_identifier))
    user = cur.fetchone()
    print(user[0])
    if user is not None:
        if password == user[2]:
            token = create_token(user[1])

            cur.execute("""UPDATE userprofil SET token = %s WHERE email = %s OR pseudonym = %s""", (token, login_identifier, login_identifier))
            conn.commit()
            
            
            return jsonify({'token': token, 'user_id': user[0]})
        else:
            return jsonify({'error': 'Invalid login credentials'}),


"""Meldet den User von seiner Gamification Session ab.

Hierzu wird eine Verbindung zur Datenbank erstellt, um ein Token des Users auf den Default-Wert zurückzusetzen.

Body (JSON):
token: Token des Users

Rückgabewert (JSON):
success: Gibt eine Mitteilung zurück, dass der Vorgang erfolgreich war

"""



def post_logout():
    # Benutzerdaten aus dem Request-Body lesen
    data = request.get_json()
    token = data['token']

    # Verbindung zur Datenbank herstellen
    conn = get_connection()
    cur = conn.cursor()

    # Setze den Token des Benutzers auf einen leeren String
    cur.execute("""UPDATE userprofil SET token = 'Logout' WHERE token = %s""", (token,))
    conn.commit()

    # Bestätigung zurückgeben
    return jsonify({'success': True})


"""Aktualisert das Profilbild des Users.

Hierzu wird eine Verbindung zur Datenbank aufgebaut, um das Profilbild hochzuladen.

Argumente:
user_id: ID des Users
user_picture: Profilbild es Users

"""
   


def update_profile_picture(user_id: int, user_picture: bytes):
    """Update the profile picture for the user with the given ID."""
    try:

        conn = get_connection()
        cur = conn.cursor()

    
        cur.execute(
            "UPDATE userprofil SET user_picture = %s WHERE id = %s",
            (user_picture , user_id)
        )
        conn.commit()

    except Exception as e:
        print(e)
    finally:
        if conn:
            conn.close()



""" Lädt das Profilbild hoch.

Das hochgeladene Profibild des Users wird in eine Tabelle gespeichert.

Body (Form, Files):
user_id: ID des Users
user_picture: Profilbild des Users 

Rückgabewert (JSON):
success: Gibt eine Mitteilung zurück, dass der Vorgang erfolgreich war


"""


def upload_profile_picture():
    
    user_id = request.form['user_id']
    user_picture  = request.files['user_picture']

    
    user_picture_bytes = io.BytesIO(user_picture .read()).getvalue()

    
    update_profile_picture(user_id, user_picture_bytes)

    return "Success"


"""Zeigt das aktuelle Profilbild an.

Hierzu wird eine Verbidnung zur Datenbank hergestellt, um das Profilbild des Users auszulesen.

Argumente:
user_id: ID des Users

Rückgabewert:
user_picture_bytes: Profilbild des Users

"""

def get_uploaded_profile_picture(user_id: int):
   # """Get the uploaded profile picture for the user with the given ID."""
    try:
    
        conn = get_connection()
        cur = conn.cursor()

    
        cur.execute(
            "SELECT user_picture FROM userprofil WHERE id = %s",
            (user_id,)
        )
        user_picture = cur.fetchone()

        if user_picture is None:
            return "User not found", 404

     
        user_picture_bytes = user_picture[0]

      
        return Response(user_picture_bytes, mimetype='image/jpg')
    except Exception as e:
        print(e)
        return "Error", 500
    finally:
        if conn:
            conn.close()





