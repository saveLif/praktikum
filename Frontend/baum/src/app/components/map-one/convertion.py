import sqlite3
from pyproj import Proj, transform

def utm_to_latlon(easting, northing, zone_number=32, zone_letter='S'):
    utm_proj = Proj(proj='utm', zone=zone_number, south=True if zone_letter == 'U' else False, ellps='WGS84')
    lon, lat = utm_proj(easting, northing, inverse=True)
    return lon, lat

db_path = "C:\\telegraf\\tree.db"

# SQLite database connection
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Add columns for converted coordinates
cursor.execute("ALTER TABLE tree ADD COLUMN longitude REAL")
cursor.execute("ALTER TABLE tree ADD COLUMN latitude REAL")

# Execute query to retrieve data from "east" and "north" columns
cursor.execute('SELECT east, north, OBJECTID FROM tree')

# Recover all lines
rows = cursor.fetchall()


# Converting UTM coordinates to latitude/longitude coordinates
for row in rows:
    easting, northing, OBJECTID = row
    lon, lat = utm_to_latlon(easting, northing)
    cursor.execute("UPDATE tree SET longitude=?, latitude=? WHERE OBJECTID=?", (lon, lat, OBJECTID))
    print("Longitude: {}, Latitude: {}".format(lon, lat))

# Commit the changes
conn.commit()

# Closing the database connection
conn.close()



# import csv
# from pyproj import Proj, transform

# def convert_coordinates(east, north, source_epsg, target_epsg):
#     # Quell- und Zielkoordinatensystem definieren
#     source_proj = Proj(init=f"epsg:{source_epsg}")
#     target_proj = Proj(init=f"epsg:{target_epsg}")

#     # Daten konvertieren
#     lon, lat = transform(source_proj, target_proj, east, north)

#     return lon, lat

# def convert_csv(input_file, output_file, source_epsg, target_epsg):
#     with open(input_file, 'r') as csv_file:
#         reader = csv.DictReader(csv_file)
#         fieldnames = reader.fieldnames + ['longitude', 'latitude']

#         with open(output_file, 'w', newline='') as output_csv:
#             writer = csv.DictWriter(output_csv, fieldnames=fieldnames)
#             writer.writeheader()

#             for row in reader:
#                 east = float(row['east'])
#                 north = float(row['north'])

#                 # Daten für jede Zeile konvertieren
#                 lon, lat = convert_coordinates(east, north, source_epsg, target_epsg)

#                 # Hinfügen
#                 row['longitude'] = lon
#                 row['latitude'] = lat

#                 # In Output_Datei schreiben
#                 writer.writerow(row)


# input_file = 'C:\\telegraf\\tree.csv'
# output_file = 'C:\\telegraf\\treelatlon.csv'

# source_epsg = 32633  # anzupassen
# target_epsg = 4326  # anzupassen

# convert_csv(input_file, output_file, source_epsg, target_epsg)