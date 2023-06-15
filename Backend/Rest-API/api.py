# api.py
# stelt Rest-Api zur Verfügung
from flask import jsonify
from flask import Flask
from flask_cors import CORS
from db import *

from flask import request  
import io
from flask import Response
app = Flask(__name__)
CORS(app)

@app.route('/get_ranking/<int:user_id>', methods=['GET'])
def get_user_rank(user_id):
    from userprofil import get_user_rank
    return get_user_rank(user_id)


@app.route('/get_ranking', methods=['GET'])
def get_rank():
    from userprofil import get_rank
    return get_rank()


    

@app.route('/find_object/<float:user_latitude>/<float:user_longitude>/<float:tolerance_radius>', methods=['GET'])
def find_nearest_object_id(user_latitude, user_longitude, tolerance_radius):
    from game import find_nearest_object_id
    return find_nearest_object_id(user_latitude, user_longitude, tolerance_radius)


@app.route('/addPlayer/<int:user_id>/<float:user_latitude>/<float:user_longitude>', methods = ['POST'])
def add_player(user_id, user_latitude, user_longitude):
    from game import add_player
    return add_player(user_id, user_latitude, user_longitude)

@app.route('/reminder/<int:user_id>', methods = ['GET'])
def reservation_get(user_id):
    from reservation import reservation_get
    return reservation_get(user_id)

@app.route('/reservation/<user_id>/<object_id>', methods = ['POST'])
def reservation_post(user_id, object_id):
    from reservation import reservation_post
    return reservation_post(user_id, object_id)

@app.route('/latest_measured_value/<int:sensor_id>', methods = ['GET'])
def get_latest_measured_value(sensor_id):
    from measured_values import get_latest_measured_value
    return get_latest_measured_value(sensor_id)

@app.route('/profil/<user_id>', methods = ['GET'])
def get_user_profile_points(user_id):
    from userprofil import get_user_profile_points
    return get_user_profile_points(user_id)

@app.route('/getpicture/<user_id>', methods = ['GET'])
def get_uploaded_profile_picture(user_id):
    from userprofil import get_uploaded_profile_picture
    return get_uploaded_profile_picture(user_id)




@app.route('/userpictureupload', methods = ['POST'])
def upload_image():
    from userprofil import upload_profile_picture
    return upload_profile_picture()

@app.route('/logout', methods = ['POST'])
def logout():
    from userprofil import post_logout
    return post_logout()

@app.route('/login', methods = ['POST'])
def login():
    from userprofil import post_login
    return post_login()


@app.route('/register', methods = ['POST'])
def add_user():
    from userprofil import post_register
    return post_register()


    
@app.route('/list', methods = ['GET'])
def get_list():
    from object import get_list
    return get_list()
   


@app.route('/sensor', methods = ['GET'])
def get_sensor():
   from sensor import get_sensor
   return get_sensor()
  

@app.route('/object', methods = ['GET'])
def get_object():
    from object import get_object
    return get_object()

@app.route('/objects', methods = ['GET'])
def get_object_id():
    from object import get_object_id
    return get_object_id()

 
@app.route('/located', methods = ['GET'])
def get_located():
   from located import get_located
   return get_located()

if __name__ == '__main__':
    app.run()
 