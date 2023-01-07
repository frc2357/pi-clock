from flask import Flask, json

data = {"test": "testing"}

app = Flask(__name__)

@app.route('/test')
def test_api_endpoint():
    return json.dumps(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
