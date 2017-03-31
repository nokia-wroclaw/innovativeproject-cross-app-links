from api import app
from api.database import db
from flask_restless import APIManager
from flask_login import current_user



def auth_func(*args, **kw):
    if not current_user.is_authenticated():
        raise ProcessingException(description='Not authenticated!', code=401)

manager = APIManager(app, flask_sqlalchemy_db=db, preprocessors=dict(POST=[auth_func], DELETE=[auth_func], PUT=[auth_func]))

# /api/user , /api/user/<int>
manager.create_api(User,include_columns=['id', 'email','username','group_id'], preprocessors=dict(GET=[auth_func]))

# /api/group , /api/group/<int>
manager.create_api(Group, preprocessors=dict(GET=[auth_func]))

# /api/app , /api/app/<int>
manager.create_api(App, include_columns=['id', 'name','link','desc'])

# /api/log , /api/log/<int>
manager.create_api(Log, preprocessors=dict(GET=[auth_func]))