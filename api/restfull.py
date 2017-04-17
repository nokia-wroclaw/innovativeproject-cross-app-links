from api import app
from api.database import db
from api.models import User, Group, App, Log
from flask_restless import APIManager, ProcessingException
from flask_login import current_user
from flask import g



def auth_func(*args, **kw):
    if not current_user.is_authenticated:
        raise ProcessingException(description='Not authenticated!', code=401)

def get_logged_user(search_params=None, **kw):
    if search_params is None:
        return
    filt = dict(name='id', op='eq', val=current_user.get_id())
    if 'filters' not in search_params:
        search_params['filters'] = []
    search_params['filters'].append(filt)
        
manager = APIManager(app, flask_sqlalchemy_db=db, preprocessors=dict(POST=[auth_func], DELETE=[auth_func], PUT=[auth_func]))

# /api/user , /api/user/<int>
manager.create_api(User, exclude_columns=['password_hash'], methods=['GET', 'POST', 'DELETE','PUT'], preprocessors=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func]), results_per_page=0)

manager.create_api(User, url_prefix='/api/me',methods=['GET', 'POST', 'DELETE','PUT'], preprocessors=dict(GET_SINGLE=[auth_func, get_logged_user], GET_MANY=[auth_func, get_logged_user]), results_per_page=0)

# /api/group , /api/group/<int>
manager.create_api(Group, exclude_columns=['users.password_hash', 'users.group_id'], methods=['GET', 'POST', 'DELETE','PUT'], preprocessors=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func]), results_per_page=0)

# /api/app , /api/app/<int>
manager.create_api(App, exclude_columns=['creator.password_hash'], methods=['GET', 'POST', 'DELETE','PUT'], preprocessors=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func]), results_per_page=0)

# /api/v2/app , /api/v2/app/<int>
manager.create_api(App, include_columns=['name','link','desc', 'img_link'], url_prefix='/api/v2', methods=['GET'], results_per_page=0)

# /api/log , /api/log/<int>
manager.create_api(Log, exclude_columns=['author.password_hash'], methods=['GET', 'POST'], preprocessors=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func]), results_per_page=0)

