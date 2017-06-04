from api import app
from api.database import db
from api.models import User, Group, App, Log, Note, ComponentUser, Component, Invite
from flask_restless import APIManager, ProcessingException
from flask_login import current_user, login_fresh
from flask import session
from flask_cors import CORS

cors = CORS(app, resources={r"/api/v2/*": {"origins": "*"}})
cors = CORS(app, resources={r"/api/component": {"origins": "*"}})

def auth_func(*args, **kw):
    if not login_fresh() and not current_user.is_authenticated:
        if not 'user' in session:
            raise ProcessingException(description='Not authenticated!', code=401)

def is_auth_to_app_edit(*args, **kw):
     if not current_user.group.app_edit_all:
        raise ProcessingException(description='Not authenticated!', code=401)

def is_auth_to_app_drop(*args, **kw):
    if not current_user.group.app_drop:
        raise ProcessingException(description='Not authenticated!', code=401)

def is_auth_to_user_add(*args, **kw):
    if not current_user.group.user_add:
        raise ProcessingException(description='Not authenticated!', code=401)

def is_auth_to_user_drop(*args, **kw):
    if not current_user.group.user_drop:
        raise ProcessingException(description='Not authenticated!', code=401)

def get_logged_user(search_params=None, **kw):
    if search_params is None:
        return
    filt = dict(name='id', op='eq', val=current_user.get_id())
    if 'filters' not in search_params:
        search_params['filters'] = []
    search_params['filters'].append(filt)

def get_app_visible(search_params=None, **kw):
    if search_params is None:
        return
    filt = dict(name='status', op='eq', val=True)
    if 'filters' not in search_params:
        search_params['filters'] = []
    search_params['filters'].append(filt)

manager = APIManager(app,
                     flask_sqlalchemy_db=db,
                     preprocessors=dict(DELETE_SINGLE=[auth_func],
                                        PUT_SINGLE=[auth_func]))

# /api/user , /api/user/<int>
manager.create_api(User,
                   exclude_columns=['password_hash'],
                   methods=['GET', 'POST', 'DELETE','PUT'],
                   preprocessors=dict(GET_SINGLE=[auth_func],
                                      GET_MANY=[auth_func],
                                      POST=[auth_func, is_auth_to_user_add],
                                      DELETE_SINGLE=[is_auth_to_user_drop]),
                   results_per_page=0)

manager.create_api(User,
                   url_prefix='/api/me',
                   methods=['GET', 'POST', 'PUT'],
                   preprocessors=dict(POST=[auth_func],
                                      GET_SINGLE=[auth_func, get_logged_user],
                                      GET_MANY=[auth_func, get_logged_user]),
                   results_per_page=0)

# /api/group , /api/group/<int>
manager.create_api(Group,
                   exclude_columns=['users.password_hash', 'users.group_id'],
                   methods=['GET', 'POST', 'DELETE','PUT'],
                   preprocessors=dict(POST=[auth_func],
                                      GET_SINGLE=[auth_func],
                                      GET_MANY=[auth_func]),
                   results_per_page=0)

# /api/app , /api/app/<int>
manager.create_api(App,
                   exclude_columns=['creator.password_hash'],
                   methods=['GET', 'POST', 'DELETE','PUT'],
                   preprocessors=dict(POST=[auth_func],
                                      GET_SINGLE=[auth_func],
                                      GET_MANY=[auth_func],
                                      PUT_SINGLE=[is_auth_to_app_edit],
                                      DELETE_SINGLE=[is_auth_to_app_drop]),
                   results_per_page=0)

# /api/v2/app , /api/v2/app/<int>
manager.create_api(App,
                   include_columns=['id','name','link','desc', 'img_link', 'order_id', 'beta'],
                   url_prefix='/api/v2',
                   methods=['GET'],
                   preprocessors=dict(POST=[auth_func],
                                      GET_SINGLE=[get_app_visible],
                                      GET_MANY=[get_app_visible]),
                   results_per_page=0)

# /api/log , /api/log/<int>
manager.create_api(Log,
                   exclude_columns=['author.password_hash'],
                   methods=['GET', 'POST'],
                   preprocessors=dict(POST=[auth_func],
                                      GET_SINGLE=[auth_func],
                                      GET_MANY=[auth_func]),
                   results_per_page=0)

# /api/note , /api/note/<int>
manager.create_api(Note,
                   exclude_columns=['owner.password_hash'],
                   methods=['GET', 'POST', 'DELETE'],
                   preprocessors=dict(POST=[auth_func],
                                      GET_SINGLE=[auth_func],
                                      GET_MANY=[auth_func]),
                   results_per_page=0)

manager.create_api(Invite,
                   exclude_columns=['author.password_hash'],
                   methods=['GET', 'POST', 'DELETE'],
                   preprocessors=dict(POST=[auth_func],
                                      GET_SINGLE=[auth_func],
                                      GET_MANY=[auth_func]),
                   results_per_page=0)

manager.create_api(ComponentUser,
                   methods=['GET', 'POST'],
                   preprocessors=dict(POST=[auth_func],
                                      GET_SINGLE=[auth_func], 
                                      GET_MANY=[auth_func]),
                   results_per_page=0)

manager.create_api(Component,
                   methods=['GET', 'POST'],
                   preprocessors=dict(GET_SINGLE=[auth_func],
                                      GET_MANY=[auth_func]),
                   results_per_page=0)
