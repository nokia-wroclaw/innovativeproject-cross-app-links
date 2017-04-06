from api import app
from api.database import db
from api.models import User, Group, App, Log
from flask_restless import APIManager, ProcessingException
from flask_login import current_user



def auth_func(*args, **kw):
    if not hasattr(current_user,'username'):
        raise ProcessingException(description='Not authenticated!', code=401)

manager = APIManager(app, flask_sqlalchemy_db=db, preprocessors=dict(POST=[auth_func], DELETE=[auth_func], PUT=[auth_func]))

# /api/user , /api/user/<int>
manager.create_api(User,  exclude_columns=['password_hash'], methods=['GET', 'POST', 'DELETE','PUT'], preprocessors=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func]), results_per_page=0)

# /api/group , /api/group/<int>
manager.create_api(Group, exclude_columns=['users.password_hash', 'users.group_id'], methods=['GET', 'POST', 'DELETE','PUT'], preprocessors=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func]), results_per_page=0)

# /api/app , /api/app/<int>
manager.create_api(App, exclude_columns=['creator.password_hash'], methods=['GET', 'POST', 'DELETE','PUT'], preprocessors=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func]), results_per_page=0)

# /api/v2/app , /api/v2/app/<int>
manager.create_api(App, include_columns=['name','link'], url_prefix='/api/v2', methods=['GET'], results_per_page=0)

# /api/log , /api/log/<int>
manager.create_api(Log, exclude_columns=['author.password_hash'], methods=['GET', 'POST'], preprocessors=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func]), results_per_page=0)

