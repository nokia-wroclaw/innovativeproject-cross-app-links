from flask import Flask, make_response, jsonify, render_template, redirect, session, request, g
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from passlib.hash import sha256_crypt
from api import app
from api.models import User, Group, App, Log, Invites, Reset
from api.database import db
from api.mail import send_email, send_email_register, send_email_reset
from flask_cors import CORS, cross_origin 


#-----------
#FUNCTIONS
#-----------
def commituser(token,userpassword):
    """
    Creates user with given password. Email and group are taken from Invites table.
    Removes invite entry.
    """
    new = Invites.query.filter_by(token = token).first()
    if new:
        useremail = new.email
        group = new.group
        new = User(useremail,sha256_crypt.encrypt(userpassword),group)
        db.session.add(new)
        db.session.commit()
        removeinvite(useremail)
        if not User.query.filter_by(email = useremail).first():
            return "Error while creating user."
    else:
        return "Error invite not found."


def commitinvite(email,maker,group):
    """
    Creates invite entry with given email, group and id of user who send invite
    (maker is user object).
    """
    new = Invites(email,maker.id,group)
    db.session.add(new)
    db.session.commit()
    receiver = [email]
    send_email_register(maker.email,receiver)


def askforreset(email):
    """
    Creates reset entry and sends email with password reset link.
    """
    new = Reset(email)
    db.session.add(new)
    db.session.commit()
    receiver = [email]
    send_email_reset(receiver)

def updatepassword(token,userpassword):
    """
    Retrieves user email from reset entry and set new passowrd for the user
    """
    new = Reset.query.filter_by(token = token).first()
    useremail = new.email
    user = User.query.filter_by(email=useremail).first()
    user.password_hash = sha256_crypt.encrypt(userpassword)
    db.session.commit()
    removereset(useremail)


def removeuser(email, current):
    """
    Removes user from database. If user removes himself, session is terminated.
    """
    sadman = User.query.filter_by(email = email).first()
    if current.email == email:
        logout_user()
        session.pop('user', None)
    db.session.delete(sadman)
    db.session.commit()

def removeinvite(email):
    """
    Removes invite entry.
    """
    sadman = Invites.query.filter_by(email = email).first()
    db.session.delete(sadman)
    db.session.commit()

def removereset(email):
    """
    Removes reset entry.
    """
    sadman = Reset.query.filter_by(email = email).first()
    db.session.delete(sadman)
    db.session.commit()

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
    'profile'
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

#Auth route

@app.route('/api/auth', methods=['POST'])
def auth():
    """
    User authentication. Checks if user exists (by given email).
    If it does, password hashes are compared.
    Session is opened when both credentials are correct.
    If password or email is incorrect user is redirected to the same page.
    """
    session.pop('user', None)
    user = User.query.filter_by(email=request.form['email']).first()
    if user:
        if sha256_crypt.verify(request.form['password'], user.password_hash):
            login_user(user)
            session['user'] = user.username
            return redirect('/')
        else:
            return make_response(open('api/templates/login-page.html').read())
    else:
        return make_response(open('api/templates/login-page.html').read())


@app.route('/api/auth/logout')
@login_required
def logout():
    """
    Logs out user and removes him from the session.
    """
    logout_user()
    session.pop('user', None)
    return redirect('/')


@app.route('/api/auth/register', methods=['POST'])
@login_required
def register():
    """
    Checks if given email is already in use. 
    If false, we call function that creates invite entry and sends email.
    """
    if not User.query.filter_by(email=request.form['email']).first():
        commitinvite(request.form['email'],current_user,request.form['group'])
        return redirect('/add-user')
    else:
        return str(False)


# Confirm account
@app.route('/api/auth/setpassword', methods=['GET','POST'])
def setpassword():
    """
    Finish user registration process. Displays page which allows to set user password.
    If given, token and user password is forwarded to the function that creates user entry.
    """
    if request.method == 'POST':
        temp = request.args.get('token')
        givenpassword = request.form['password']
        commituser(temp,givenpassword)
        return redirect('/')
    else:
        return make_response(open('api/templates/create-user.html').read())


@app.route('/api/auth/resetpassword', methods=['GET','POST'])
def resetpassword():
    """
    Displays page that allows user to send email with link to set his new password.
    """
    if request.method == 'POST':
        givenemail = request.form['email']
        askforreset(givenemail)
        return redirect('/')
    else:
        return make_response(open('api/templates/reset-password.html').read())


@app.route('/api/auth/setnewpassword', methods=['GET','POST'])
def setnewpassword():
    """
    Displays page which asks for new user password.
    If given, function is called.
    New password is set and user is redirected to the root page.
    """
    if request.method == 'POST':
        temp = request.args.get('token')
        givenpassword = request.form['password']
        updatepassword(temp,givenpassword)
        return redirect('/')
    else:
        return make_response(open('api/templates/create-password.html').read())

# Delete user
@app.route('/api/auth/remove', methods=['POST'])
@login_required
def remove():
    """
    If user entry exists, removes it from the database.
    If invite entry exists, removes it from the database.
    """
    if User.query.filter_by(email=request.form['email']).first():
        removeuser(request.form['email'], current_user)
    if Invites.query.filter_by(email=request.form['email']).first():
        removeinvite(request.form['email'])
    return redirect('/add-user')


#Default templates for Flask route

@app.route('/')
def index():
    return make_response(open('api/templates/login-page.html').read())

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
        

#Routes for components data
@app.route('/component/<component_type>')
@cross_origin()
def component(component_type):
    if component_type =='iframe':
        return make_response(open('api/static/web-components/iframe/component-template.html').read())
    elif component_type =='polymer':
        return make_response(open('api/static/web-components/polymer/component-template.html').read())
    
    
@app.route('/bower/<path>')
@cross_origin()
def bower(path):
     return make_response(open('api/static/bower_components/{}'.format(path)).read())

@app.route('/get-components/<component_type>')
def component_test(component_type):
    """
    Routes for components test.
    """
    if component_type=='iframe':
        return make_response(open('api/static/web-components/iframe/iframe-index.html').read())
    elif component_type=='polymer':
        return make_response(open('api/static/web-components/polymer/polymer-index.html').read())
    return None

