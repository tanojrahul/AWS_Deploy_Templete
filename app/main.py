from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/demo", methods=['GET', 'POST'])
def demo():
    if request.method == 'POST':
        data = request.get_json()
        query = data.get("query", "") if data else ""
    else:  # GET request
        query = request.args.get("query", "")
    
    greeting = f"Hello! You sent: {query}"
    return jsonify(greeting=greeting, query=query)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
