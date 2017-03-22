from flask import Flask, make_response, jsonify, render_template, redirect, session, g
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

@app.before_request
def before_request():
    g.user = None
    if 'email' in session:
        g.user = session['email']

#-----------
#ROUTING
#-----------
@app.route('/login')
def login():
    if g.user:
        return redirect('/')
    else:
        return make_response(open('api/templates/login-page.html').read())
    
    
    
#Default templates for Flask route
@app.route('/')
@app.route('/<content>')
@app.route('/<content>/<content_id>')
def main(content='dashboard', content_id=None):
    
        if content in index_content_list:
            if g.user:
                return make_response(open('api/templates/index.html').read())
            else:
                return redirect('/login')
        else:    
            return make_response(open('api/templates/404.html').read())
   
    
#Routes for REST API data
@app.route('/api/<table>')
@app.route('/api/<table>/<row_id>')
def api(table, row_id = None):
    
    if table in api_list:
        return jsonify({'name': 'cross-app-links', 'wlcm_txt': 'Hello World!'})
    return None




#Auth route - TEMPORARY
@app.route('/api/auth')
def auth():
    session['email'] = 'test@com.pl'
    return redirect('/')
@app.route('/api/auth/logout')
def logout():
    session['email'] = None
    return redirect('/')



#Routes for components
@app.route('/api/component/<component_type>/<component_id>')
def component(component_type, component_id):
    if component_type=='iframe':
        return render_template('iframe-web-component.html')
    elif component_type=='json':
        return jsonify({'name': 'json-component', 'data': '755'})
    return None