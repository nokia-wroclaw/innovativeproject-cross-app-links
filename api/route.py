from flask import Flask, make_response, jsonify, render_template, redirect
from api import app
from api.models import User, Group, App, Log
from api.database import db

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

#Default templates for Flask route
@app.route('/')
@app.route('/<content>')
@app.route('/<content>/<content_id>')
def main(content='dashboard', content_id=None):
    
    if content in index_content_list:
        return make_response(open('api/templates/index.html').read())
    return make_response(open('api/templates/404.html').read())

#Routes for components
@app.route('/getcomponent/<component_type>/<component_id>')
def component(component_type, component_id):
    if component_type=='iframe':
        return render_template('iframe-web-component.html')
    elif component_type=='json':
        return jsonify({'name': 'json-component', 'data': '755'})
    return None