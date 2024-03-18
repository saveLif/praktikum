import json
from db import get_connection
from flask import request  
from decimal import Decimal

from folium.plugins import MarkerCluster
from flask_cors import CORS
from flask import  Flask, send_file, jsonify
import folium
import time

app = Flask(__name__)
CORS(app)

def get_Map():
    sql_select = """SELECT obj.id, obj.description, obj.description_id, geo.latitude, geo.longitude FROM object obj INNER JOIN geolocation geo ON obj.geolocation_id=geo.id limit 5000"""
    print("before connection")
    conn = get_connection()
    print("after connection")
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(sql_select)
                rows = cur.fetchall()
    finally:
       conn.close()
    print("after select")
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

    mapObj = folium.Map(location=[52.2646577, 10.5236066], zoom_start=12)

    icon_image = folium.features.CustomIcon('assets/tree-icon.png', icon_size=(20, 20))
    markerCluster =  MarkerCluster(name="Ostfalia").add_to(mapObj)
    for t in objects:
       latitude = t["geolocation"]["latitude"]
       longitude = t["geolocation"]["longitude"]
       folium.Marker(location=[latitude, longitude],
           popup="ID: {0}, Description: {1}".format(t["ID"], t["description"]),
           icon=folium.Icon(color='blue', icon='icon_image')).add_to(markerCluster)  
        

    folium.LayerControl().add_to(mapObj)

    start_time_save = time.time()
    print("Start save recording ", start_time_save)
   
    mapObj.save("/app/map/result.html")
    end_time = time.time()
    print("End Saving: ", end_time)
    print("Elapsed save time was ", end_time - start_time_save)

    # return "success"
    return send_file("/app/map/result.html")

if __name__ == '__main__':
    get_Map()
