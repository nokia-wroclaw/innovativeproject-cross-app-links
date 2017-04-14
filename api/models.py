from flask_login import UserMixin
from api.database import db
from flask_uuid import FlaskUUID
from api import app
import uuid

flask_uuid = FlaskUUID()
flask_uuid.init_app(app)

class User(UserMixin, db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String(25), unique=True)
    username=db.Column(db.String(30), unique=True)
    password_hash=db.Column(db.String(128))
    group_id=db.Column(db.Integer, db.ForeignKey('group.id'))
    
    applications=db.relationship('App', backref='creator', lazy='dynamic')
    logs=db.relationship('Log', backref='author', lazy='dynamic')
    notes=db.relationship('Note', backref='owner', lazy='dynamic')
    
    def __init__(self, email, password_hash,group):
        
        self.email=email
        self.password_hash=password_hash
        self.group_id=group
        self.username=email.split('@')[0]
        
    def is_authenticated():
        return True
    
    def is_active():
        return True
    
    def is_anonymous():
        return False
    
    def get_id(self):
        return str(self.id)

            
            
class Group(db.Model):
    
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(30), unique=True)
    app_add=db.Column(db.Boolean)
    app_edit=db.Column(db.Boolean)
    app_drop=db.Column(db.Boolean)
    user_add=db.Column(db.Boolean)
    user_drop=db.Column(db.Boolean)
    users=db.relationship('User', backref='group', lazy='dynamic')
        
    def __init__(self, name, app_add, app_edit, app_drop, user_add, user_drop):
        
        self.name=name
        self.app_add=app_add
        self.app_edit=app_edit
        self.app_drop=app_drop
        self.user_add=user_add
        self.user_drop=user_drop

            
            
class App(db.Model):
    
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(30), unique=True)
    link=db.Column(db.String(50), unique=True)
    desc=db.Column(db.String(50))
    creator_id=db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, name, link, desc, creator_id):
        
        self.name=name
        self.link=link
        self.desc=desc
        self.creator_id=creator_id
            
            
            
class Log(db.Model):
    
    id=db.Column(db.Integer,primary_key=True)
    data_time=db.Column(db.TIMESTAMP)
    content=db.Column(db.String(60),unique=True)
    author_id=db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, content, data_time, author_id):
        
        self.content=content
        self.data_time=data_time
        self.author_id=author_id
        
#To create

class  Note(db.Model):
    __tablename__ = 'Note'
    
    id=db.Column(db.Integer, primary_key=True)
    content=db.Column(db.Text)
    tag=db.Column(db.String(20))
    owner_id=db.Column(db.Integer, db.ForeignKey('user.id'))
        
#db.create_all()

class Invites(db.Model):
    __tablename__ = 'Invites'
    
    id = db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String(25), unique=True)
    token = db.Column(db.String(50), unique=True)
    maker = db.Column(db.Integer)
    group = db.Column(db.Integer)
    
    def __init__(self, email, maker,group):
        
        self.email=email
        self.maker=maker
        self.group=group
        self.token=str(uuid.uuid4())

