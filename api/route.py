from flask import Flask, make_response, jsonify, render_template, redirect, session, request, g, send_from_directory
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from passlib.hash import sha256_crypt
from api import app
from api.models import User, Group, App, Log, Invites, Reset
from api.database import db
from api.functions import Mailing
from flask_cors import CORS, cross_origin 

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

@app.route('/database')
def database():
    group1 = Group('Administrator', True, True, True, True, True, True)
    group2 = Group('Application manager', True, True, True, True, False, False)
    group3 = Group('User', True, False, True, True, False, False)
    admin = User('admin@example.com', sha256_crypt.encrypt('admin123'), 1, '04/26/2017')
    db.session.add(group1)
    db.session.add(group2)
    db.session.add(group3)
    db.session.add(admin)
    db.session.commit()

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
        if current_user.group_id == 1:
            Mailing().commitinvite(request.form['email'],current_user,request.form['group'])
            return redirect('/add-user')
        else:
            return render_template("message_template.html", type="Warning!", message="You don't have permission to perform this action.", path="/add-user")
    else:
        return render_template("message_template.html", type="Warning!", message="User exists or invitation send already.", path="/add-user")


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
        Mailing().commituser(temp,givenpassword)
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
        Mailing().askforreset(givenemail)
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
        Mailing().updatepassword(temp,givenpassword)
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
                removeinvite(request.form['email'])
    """
    if current_user.group_id == 1:
        if User.query.filter_by(email=request.form['email']).first():
            Mailing().removeuser(request.form['email'], current_user)
        if Invites.query.filter_by(email=request.form['email']).first():
            Mailing().removeinvite(request.form['email'])
        return redirect('/add-user')
    else:
        return render_template("message_template.html", type="Warning!", message="You don't have permission to perform this action.", path="/add-user")


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
        

@app.route('/static/bower_components/<path:path>')
@cross_origin()
def static_file(path):
    return send_from_directory('static/bower_components', path)
        
#Routes for components data
@app.route('/component/<component_type>')
@cross_origin()
def component(component_type):
    if component_type =='iframe':
        return make_response(open('api/static/web-components/iframe/component-template.html').read())
    elif component_type =='polymer':
        return make_response(open('api/static/web-components/polymer/component-template.html').read())
    
    
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

