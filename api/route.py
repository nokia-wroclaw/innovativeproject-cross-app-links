from api import app
from api.models import User, Group, App, Log, Invite, Reset, Component, ComponentUser
from api.database import db
from api.functions import Mailing
from api.mail import send_email_register
from flask import Flask, make_response, jsonify, render_template, redirect, session, request, g, send_from_directory, send_file
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, login_fresh
from flask_cors import CORS, cross_origin
from datetime import datetime
from time import time
from passlib.hash import sha256_crypt
import os
from flask_session import Session

app.config['SESSION_TYPE'] = 'filesystem'

Session(app)

#-----------
#STATIC VAL
#-----------

#Registered list of available templates
index_content_list = [
    'dashboard',
    'stats',
    'action-log',
    'links',
    'add-link',
    'users',
    'groups',
    'add-user',
    'settings',
    'ver',
    'profile',
    'usercp',
    'components'
]

#Login manager
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
# put @login_required to deny access for unknown visitors

@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['user']

#-----------
#ROUTING
#-----------

"""

    User authentication. Checks if user exists (by given email).
    If it does, password hashes are compared.
    Session is opened when both credentials are correct.
    If password or email is incorrect user is redirected to the same page.

"""

@app.route('/api/auth', methods=['POST'])
def auth():
    session.pop('user', None)
    user = User.query.filter_by(email=request.form['email']).first()
    if user:
        if sha256_crypt.verify(request.form['password'], user.password_hash):
            login_user(user)
            user.been_active = str(datetime.now().isoformat() )
            db.session.add(user)
            db.session.commit()
            session['user'] = user.username
            session['email'] = user.email
            return redirect('/')

        else:
            return redirect('/#login-failure')
    else:
        return redirect('/#login-failure')


"""

    Logs out user and removes him from the session.

"""

@app.route('/api/auth/logout')
@login_required
def logout():
    logout_user()
    session.pop('user', None)
    return redirect('/')


"""

    Send an invitation to posted email with token

"""

@app.route('/api/sendinvite', methods=['POST'])
@login_required
def sendinvite():
    data = request.get_json()
    email = data['email']
    maker = data['sender']
    receiver = [email]
    send_email_register(maker,receiver)
    return str(True)


"""

    Finish user registration process. Displays page which allows to set user password.
    If given, token and user password is forwarded to the function that creates user entry.

"""

@app.route('/api/auth/setpassword', methods=['GET','POST'])
def setpassword():
    if request.method == 'POST':
        temp = request.args.get('token')
        givenpassword = request.form['password']
        Mailing().commituser(temp,givenpassword)
        return redirect('/')
    else:
        return make_response(open('api/templates/create-user.html').read())


"""

    Displays page that allows user to send email with link to set his new password.

"""

@app.route('/api/auth/resetpassword', methods=['GET','POST'])
def resetpassword():

    if request.method == 'POST':
        givenemail = request.form['email']
        Mailing().askforreset(givenemail)
        return redirect('/')
    else:
        return make_response(open('api/templates/reset-password.html').read())


"""

    Displays page which asks for new user password.
    If given, function is called.
    New password is set and user is redirected to the root page.

"""

@app.route('/api/auth/setnewpassword', methods=['GET','POST'])
def setnewpassword():
    if request.method == 'POST':
        temp = request.args.get('token')
        givenpassword = request.form['password']
        Mailing().updatepassword(temp,givenpassword)
        return redirect('/')
    else:
        return make_response(open('api/templates/create-password.html').read())


"""

    Password authentication. It checks if entered password is correct with password in database

"""

@app.route('/api/auth/checkpass', methods=['POST'])
def checkpass():

    data = request.get_json()
    dataobj = jsonify(data)
    if sha256_crypt.verify(data['pass'], current_user.password_hash):
        return str(True)
    else:
        return str(False)


"""

    Encrypt posted password and change it inside database.

"""

@app.route('/api/auth/changepass', methods=['POST'])
@login_required
def changepass():
    data = request.get_json()
    user = User.query.filter_by(id = current_user.get_id()).first()
    user.password_hash = sha256_crypt.encrypt(data['newpass'])
    db.session.commit()
    logout_user()
    session.pop('user', None)
    return str(True)


"""

    Main page route

"""

@app.route('/')
def index():
    return make_response(open('api/templates/login-page.html').read())


"""

    Routes for registered content given in index_content_list []

"""

@app.route('/<content>')
@app.route('/<content>/<content_id>')
def main(content='dashboard', content_id=None):
        if content in index_content_list:
            if not g.user:
                return make_response(open('api/templates/login-page.html').read())
            else:
                return make_response(open('api/templates/index.html').read())
        else:
            return make_response(open('api/templates/404.html').read())


"""

    Delete an icon of removed link

"""

@app.route('/api/remove-file-on-drop', methods=['POST'])
@login_required
def remove_file_on_drop():
    data = request.get_json()
    if current_user.group.app_drop:
        if os.path.exists('api/static/img/app-img/' + data['filename'] + '.png'):
            os.remove('api/static/img/app-img/' + data['filename'] + '.png')
            return 'Image was removed successfully'
        return 'Image not exists'
    return 'Not authenticated 401'


"""

    Registering a CORS header authentication for component's resources

"""

@app.route('/static/bower_components/<path:path>')
@cross_origin()
def static_file(path):
    return send_from_directory('static/bower_components', path)

@app.route('/static/web-components/<path:path>')
@cross_origin()
def static_file_web(path):
    return send_from_directory('static/web-components', path)

@app.route('/static/img/app-img/<path:path>')
@cross_origin()
def static_file_img(path):
    return send_from_directory('static/img/app-img/',path)

@app.route('/component/<component_type>')
@cross_origin()
def component(component_type):
    if component_type =='polymer':
        return make_response(open('api/static/web-components/polymer/component-template.html').read())


"""

    Creating a web-component token for additional access

"""

"""

    Get your personal data (for component) based on posted token.
    If token is correct return data.

"""


@app.route('/api/component-user-data', methods=['POST'])
@cross_origin()
def component_user_data():
        data = request.get_json()
        active = True
        user = ComponentUser.query.filter_by(email=data['email']).first()
        if active and user:
            component_user_obj = {}
            component_user_obj['email'] = user.email
            component_user_obj['pin_string'] = user.pin_string
            component_user_obj['order_string'] = user.order_string
            component_user_obj['hidden_string'] = user.hidden_string
            return jsonify(component_user_obj)
        return str(False)

"""

    Update your component data based on posted token.

"""

@app.route('/api/component-user-data-update', methods=['POST'])
@cross_origin()
def component_user_data_update():
    data = request.get_json()
    active = True
    user = ComponentUser.query.filter_by(email=data['email']).first()
    if active and user:
        user.pin_string = data['pin_string']
        user.order_string = data['order_string']
        user.hidden_string = data['hidden_string']
        db.session.add(user)
        db.session.commit()
        return str(True)
    return str(False)
