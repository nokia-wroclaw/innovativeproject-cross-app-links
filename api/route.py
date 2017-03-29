from flask import Flask, make_response, jsonify, render_template, redirect
from api import app

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
#Registered list of available api data
api_list =[
    'site'
    
]

#Registered list of available components
components_list=[
    'json',
    'iframe'
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

#Routes for components
@app.route('/api/component/<component_type>/<component_id>')
def component(component_type, component_id):
    if component_type=='iframe':
        return render_template('iframe-web-component.html')
    elif component_type=='json':
        return make_response(open('api/static/json/app.html').read())
    return None

@app.route('/api/applications', methods=['GET'])
def json_applications():
    return jsonify([{'name': 'Office', 'link': 'http://www.google.pl'},{'name': 'Web', 'link': 'http://www.google.pl'}, {'name': 'Yahoo', 'link': 'http://www.google.pl'}])
