from flask import Flask, render_template

app = Flask(__name__)

# Home route serves the webpage
@app.route("/")
def home():
    return render_template("index.html")

# No more load/save routes because Firebase handles them

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
