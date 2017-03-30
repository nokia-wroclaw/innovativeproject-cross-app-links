from flask import Flask, make_response, jsonify, render_template, redirect, session
from api import app
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from api.database import db
from api.models import User
from flask import request
from passlib.hash import sha256_crypt

#Registered list of available templates
index_content_list = [
    'dashboard',
    'stats',
    'action-log',
    'links',
    'add-link',
    'users-permissions',
    'add-user',
    'settings',
    'ver'
]
#Registered list of available api data
api_list =[
    'site'
    
]

#Registered list of available components
components_list=[
    'json',
    'iframe'
]

#Login manager
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# put @login_required to deny access for unknown visitors


#-----------
#ROUTING
#-----------

#Auth route
# User verification
# pass: admin123
@app.route('/api/auth', methods=['POST'])
def auth():
    user = User.query.filter_by(email=request.form['email']).first()
    if user:
        if sha256_crypt.verify(request.form['password'], user.password):
            login_user(user)
            session['logged_in'] = True
            return redirect('/')
        else:
            return make_response(open('api/templates/login-page.html').read())
    else:
        return make_response(open('api/templates/login-page.html').read())


#Logout user and close session
@app.route('/api/auth/logout')
@login_required
def logout():
    logout_user()
    session.pop('logged_in', None)
    return redirect('/')

#Register new user in database
@app.route('/api/auth/register', methods=['POST'])
@login_required
def register():
    if not User.query.filter_by(email=request.form['email']).first():
        if not User.query.filter_by(username=request.form['username']).first():
            new = User(request.form['username'],request.form['email'],sha256_crypt.encrypt(request.form['password']))
            db.session.add(new)
            db.session.commit()
            return 'New user created.'
        else:
            return 'Error. Username already taken!'
    else:
        return 'Error. Email already in use!'

#Verify user and redirect to register form        
@app.route('/register')
def registerpage():
    if session.get('logged_in'):
        if current_user.username == 'admin':
            return make_response(open('api/templates/register-page.html').read())
        else:
            return redirect('/')
    else:
        return redirect('/')


#Verify if user is logged in
@app.route('/api/auth/checkifloggedin')
@login_required
def checkifloggedin():
    return 'The current user is ' + current_user.username + ' / ' + current_user.email

    
#Default templates for Flask route
@app.route('/')
@app.route('/<content>')
@app.route('/<content>/<content_id>')
def main(content='dashboard', content_id=None):
    
        if content in index_content_list:
            if not session.get('logged_in'):
                return make_response(open('api/templates/login-page.html').read())
            else:
                return make_response(open('api/templates/index.html').read())
        else:    
            return make_response(open('api/templates/404.html').read())
   
    
#Routes for REST API data
@app.route('/api/<table>')
@app.route('/api/<table>/<row_id>')
def api(table, row_id = None):
    
    if table in api_list:
        return jsonify({'name': 'cross-app-links', 'wlcm_txt': 'Hello World!'})
    return None


#Routes for components
@app.route('/api/component/<component_type>/<component_id>')
def component(component_type, component_id):
    if component_type=='iframe':
        return render_template('iframe-web-component.html')
    elif component_type=='json':
        return jsonify({'name': 'json-component', 'data': '755'})
    return None