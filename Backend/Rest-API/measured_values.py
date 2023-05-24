from flask import jsonify
from db import get_connection
from flask import request
from flask_cors import CORS
import datetime

"""Gibt den letzten Feuchtigkeitsmesswert mit der dazugehörigen Zeit zurück.

Hierzu wird eine Verbindung zur Datenbank hergestellt, um den letzten Messwert des Feuchtigkeitssensors auszulesen.
Die Methode gibt den letzten Messwert des Feuchtigkeitssesnors mit dem Zeitpunkt der Messung zurück

Argumente:
sensor_id: ID des Sensors

Rückgabewert (JSON):
value: letzten Feuchtigkeitsmesswert
timestamp: Zeitpunkt der Messung in ISO 8601 Format

Sollte dieser nicht vorliegen wird eine leere JSON zurückgegeben

"""


def get_latest_measured_value(sensor_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""SELECT value, timestamp FROM measured_values JOIN sensor on sensor_ID = sensor.ID WHERE sensor_ID = %s AND measured_variable = 'humidity' ORDER BY timestamp DESC LIMIT 1""", (sensor_id,))
    row = cur.fetchone()
    if row is None:
        return {}
    return {'value': row[0], 'timestamp': row[1].isoformat()}



