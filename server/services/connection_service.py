from flask import Response

class ConnectionService:

    client_url = "http://localhost:3000"

    def __init__(self):
        print("Connection service setup")

    def setup_json_response(self, dump):
        resp = Response(dump, status=200, mimetype='application/json')
        resp.headers['Link'] = self.client_url
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp