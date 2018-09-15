import os
from services.connection_service import ConnectionService
from services.model_service import ModelService

from flask import Flask, url_for, json, Response
from flask_cors import CORS
import pandas as pd 


app = Flask(__name__)
CORS(app, resources=r'/*')
connection_service = ConnectionService()
model_service = ModelService()

# FLASK_APP=hello.py flask run
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

@app.route('/wildfire-size-model', methods = ["GET"])
def wildfire_size_model():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "./", "model.json")
    data = json.load(open(json_url))
    dump = json.dumps(data)

    return connection_service.setup_json_response(dump)

@app.route("/wildfire-size-predict", methods=["GET", "POST"])
def wildfire_size_predict(): 
    # load model
    model_service.load_wildfire_size()


@app.route("/states", methods=["GET"])
def get_states(): 
    print("GET STATES")

    

if __name__ == '__main__':
    app.run()