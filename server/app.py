import os
from services.connection_service import ConnectionService
from flask import Flask, url_for, json, Response


app = Flask(__name__)
connection_service = ConnectionService()

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

@app.route('/wildfire-size-model', methods = ['GET'])
def wildfire_size_model():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "models", "model.json")
    data = json.load(open(json_url))
    dump = json.dumps(data)

    resp = Response(dump, status=200, mimetype='application/json')
    resp.headers['Link'] = 'http://localhost:3000'
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp

@app.route("/states", methods=["GET"])
def get_states(): 
    print("GET STATES")

    

if __name__ == '__main__':
    app.run()