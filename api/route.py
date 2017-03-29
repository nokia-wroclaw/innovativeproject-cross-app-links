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

# Login manager to hande auth
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# put @login_required to deny access for no-login 




#-----------
#ROUTING
#-----------

#Auth route
# Temporary logs in default user and opens session for it
@app.route('/api/auth', methods=['POST'])
def auth():
    remail = request.form['email']
    rpassword = request.form['password']
    user = User.query.filter_by(email=remail).first()
    if user:
        if user.password == rpassword:
            login_user(user)
            session['logged_in'] = True
            return redirect('/')
        else:
            return make_response(open('api/templates/login-page.html').read())
    else:
        return make_response(open('api/templates/login-page.html').read())



# we logout user and close session
@app.route('/api/auth/logout')
@login_required
def logout():
    logout_user()
    session.pop('logged_in', None)
    return redirect('/')

# to check if user is logged in
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