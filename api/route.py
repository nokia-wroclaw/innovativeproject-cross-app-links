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

#Default templates for Flask route
@app.route('/')
@app.route('/<content>')
@app.route('/<content>/<content_id>')
def main(content='dashboard', content_id=None):
    
    if content in index_content_list:
        return make_response(open('api/templates/index.html').read())
    return make_response(open('api/templates/404.html').read())


#Routes for REST API data
@app.route('/api/<table>')
@app.route('/api/<table>/<row_id>')
def api(table, row_id = None):
    
    if table in api_list:
        return jsonify({'name': 'cross-app-links', 'wlcm_txt': 'Hello World!'})
    return None

#Routes for components data
@app.route('/component_data/iframe')
def component():
    return render_template('iframe-web-component.html')


#Routes for components test
@app.route('/component/<component_type>')
def component_test(component_type):
    if component_type=='iframe':
        return make_response(open('api/static/web-components/iframe/iframe-index.html').read())
    elif component_type=='json':
        return make_response(open('api/static/web-components/json/json-index.html').read())
    return None

