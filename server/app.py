import os
from services.connection_service import ConnectionService
from services.model_service import ModelService
from services.encoder_service import EncoderService
from services.data_service import DataService

from flask import Flask, url_for, json, Response, request, jsonify
from flask_cors import CORS
import pandas as pd 
import numpy as np
import tensorflow as tf
from keras.models import load_model
import keras as keras


app = Flask(__name__)
app.config.from_object("services.config.BaseConfig")
CORS(app, resources=r'/*')
connection_service = ConnectionService()
model_service = ModelService()
encoder_service = EncoderService(app)
data_service = DataService(app)

# FLASK_APP=app.py flask run
# kubernetes.io/docs/tutorials/kubernetes-basics/

@app.route('/')
def api_root():
    return 'Welcome'

@app.route('/articles')
def api_articles():
    return 'List of ' + url_for('api_articles')

@app.route('/articles/<articleid>')
def api_article(articleid):
    return 'You are reading ' + articleid

@app.route("/fires")
def get_past_fires():
    data = {"success": True}
    fires = data_service.get_all_wildfires()
    return jsonify({"fires": [s.to_dict() for s in fires]})

@app.route('/wildfire-size-model', methods = ["GET"])
def wildfire_size_model():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "./", "model.json")
    data = json.load(open(json_url))
    dump = json.dumps(data)

    return connection_service.setup_json_response(dump)

@app.route("/wildfire-size-predict", methods=["POST"])
def wildfire_size_predict(): 
    data = {"success": False}

    # if parameters are found, return a prediction
    params = request.get_json()

    if (params != None):
        # load model
        keras.backend.clear_session()
        X_test, y_test = encoder_service.get_wildfires_test_data()
        model = model_service.load_wildfire_size()
        params = encoder_service.encode_wildfire_size_categories(params)
        score = model.evaluate(X_test, y_test, verbose=0)
        print("%s: %.2f%%" % (model.metrics_names[1], score[1] * 100))
        predictions = model.predict_classes(np.array(params))
        data["prediction"] = encoder_service.decodeOutputVariable(predictions[0, :].item(0))
        data["success"] = True
    return connection_service.setup_json_response(json.dumps(data))

@app.route("/wildfire-by-year", methods=["GET"])
def get_wildfire_by_year():
    data = {"success": True}
    fires = data_service.filter_by_year(2005)
    return jsonify({"fires": [s.to_dict() for s in fires]})

@app.route("/states", methods=["GET"])
def get_states(): 
    data = {"success": True}
    fires = data_service.get_states_with_fire()
    return jsonify({"states": fires})

@app.route("/cause", methods=["GET"])
def get_causes(): 
    data = {"success": True}
    fires = data_service.get_cause_of_fire()
    return jsonify({"causes": fires})

    

if __name__ == '__main__':
    app.run()