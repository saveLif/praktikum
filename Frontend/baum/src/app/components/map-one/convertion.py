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