from api import app
from api.database import db
from api.models import User, Group, App, Log
from flask_restless import APIManager
#from flask_login import current_user


'''''''''
def auth_func(*args, **kw):
    if not current_user.is_authenticated():
        raise ProcessingException(description='Not authenticated!', code=401)
'''''''''
manager = APIManager(app, flask_sqlalchemy_db=db)

# /api/user , /api/user/<int>
manager.create_api(User,  exclude_columns=['password_hash'], methods=['GET', 'POST', 'DELETE','PUT'])

# /api/group , /api/group/<int>
manager.create_api(Group, exclude_columns=['users.password_hash', 'users.group_id'], methods=['GET', 'POST', 'DELETE','PUT'])

# /api/app , /api/app/<int>
manager.create_api(App, methods=['GET', 'POST', 'DELETE','PUT'])

# /api/log , /api/log/<int>
manager.create_api(Log, methods=['GET', 'POST'])