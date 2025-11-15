from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

SLOTS_FILE = "slots.json"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/load_slots")
def load_slots():
    if not os.path.exists(SLOTS_FILE):
        return jsonify([])
    with open(SLOTS_FILE, "r") as f:
        return jsonify(json.load(f))

@app.route("/save_slots", methods=["POST"])
def save_slots():
    data = request.json
    with open(SLOTS_FILE, "w") as f:
        json.dump(data, f)
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
