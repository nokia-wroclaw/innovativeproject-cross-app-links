from flask import Flask, make_response, jsonify, render_template, redirect, session, request, g
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from passlib.hash import sha256_crypt
from api import app
from api.models import User, Group, App, Log
from api.database import db
from api.mail import sendmail



#-----------
#FUNCTIONS
#-----------

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
    'users-permissions',
    'add-user',
    'settings',
    'ver'
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
@app.route('/create_all')
def create_all():
    app1 = App('Lorem ipsum app', 'http://9gag.com', 'Lorem ipsum dolor sit amet.', 1)
    app2 = App('Calculator', 'https://www.online-calculator.com','Fusce in urna sem.', 1)
    app3 = App('Dropbox', 'http://www.dropbox.com/', 'Dropbox is a file hosting service.', 1)
    app4 = App('YouTube', 'https://www.youtube.com', 'YouTube is a free video sharing website.', 1)
    db.session.add(app1)
    db.session.add(app2)
    db.session.add(app3)
    db.session.add(app4)
    #db.session.commit()
    #group1 = Group()
    #group2 = Group()
    #group3 = Group()
    
    #user1 = User()
    #user2 = User()

#Auth route
# User verification
# pass: admin123
@app.route('/api/auth', methods=['POST'])
def auth():
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


#Logout user and close session
@app.route('/api/auth/logout')
@login_required
def logout():
    logout_user()
    session.pop('user', None)
    return redirect('/')

#Register new user in database
#Send email after successful registration
@app.route('/api/auth/register', methods=['POST'])
@login_required
def register():
    if not User.query.filter_by(email=request.form['email']).first():
        new = User(request.form['email'],sha256_crypt.encrypt(request.form['password']))
        db.session.add(new)
        db.session.commit()
        receiver = [request.form['email']]
        email = request.form['email']
        sendmail(receiver,email)
        return 'User created. Email send to %s ' % email
    else:
        return 'Error. Email already in use!'


#Verify if user is logged in
@app.route('/api/auth/check')
@login_required
def checkifloggedin():
    odbiorca = ['219258@student.pwr.edu.pl']
    sendmail(odbiorca)
    return 'The current user is ' + current_user.email

    
#Default templates for Flask route
@app.route('/')
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
   
    
#Routes for components
@app.route('/getcomponent/<component_type>/<component_id>')
def component(component_type, component_id):
    if component_type=='iframe':
        return render_template('iframe-web-component.html')
    elif component_type=='json':
        return jsonify({'name': 'json-component', 'data': '755'})
    return None