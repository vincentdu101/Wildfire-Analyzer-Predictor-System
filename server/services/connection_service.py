class ConnectionService:

    client_url = "http://localhost:3000"

    def __init__():
        print("Connection service setup")

    def setup_json_response(dump):
        resp = Response(dump, status=200, mimetype='application/json')
        resp.headers['Link'] = client_url
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp