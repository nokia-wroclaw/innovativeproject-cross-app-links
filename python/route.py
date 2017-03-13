from flask import Flask, redirect

APP = Flask(__name__)

@APP.route('/')
def index():
    return "Hello World!"
if __name__ =="__main__":
    APP.run(debug=True)