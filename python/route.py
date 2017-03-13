from flask import Flask, redirect

APP = Flask(__name__)

@APP.route('/')
def index():
    return "Hello World!"

@APP.route('/profile/<zmienna>')
def profile(zmienna):
    if zmienna is not '0':
        return "nazywam sie {0}".format(zmienna)
    else: return redirect('/')

if __name__ =="__main__":
    APP.run(debug=True)