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
    app1 = App()
    app2 = App()
    app3 = App()
    
    group1 = Group()
    group2 = Group()
    group3 = Group()
    
    user1 = User()
    user2 = User()

#Default templates for Flask route
@app.route('/')
@app.route('/<content>')
@app.route('/<content>/<content_id>')
def main(content='dashboard', content_id=None):
    
    if content in index_content_list:
        return make_response(open('api/templates/index.html').read())
    return make_response(open('api/templates/404.html').read())

#Routes for components
@app.route('/api/component/<component_type>/<component_id>')
def component(component_type, component_id):
    if component_type=='iframe':
        return render_template('iframe-web-component.html')
    elif component_type=='json':
        return jsonify({'name': 'json-component', 'data': '755'})
    return None