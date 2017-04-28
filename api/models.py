from flask_login import UserMixin
from api.database import db
from flask_uuid import FlaskUUID
from api import app
import uuid

flask_uuid = FlaskUUID()
flask_uuid.init_app(app)

class User(UserMixin, db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(25), unique=True)
    username = db.Column(db.String(30), unique=True)
    password_hash = db.Column(db.String(128))
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    date = db.Column(db.TIMESTAMP)
    avatar_url = db.Column(db.String)
    been_active = db.Column(db.String)
    
    applications = db.relationship('App', backref='creator', lazy='dynamic')
    logs = db.relationship('Log', backref='author', lazy='dynamic')
    notes = db.relationship('Note', backref='owner', lazy='dynamic')
    
    def __init__(self, email, password_hash, group_id, been_active):
        
        self.email = email
        self.password_hash = password_hash
        self.group_id = group
        self.username = email.split('@')[0]
        self.date = "CURRENT_TIMESTAMP"
        self.avatar_url = "default_avatar"
        self.been_active = been_active
        
    def is_authenticated():
        return True
    
    def is_active():
        return True
    
    def is_anonymous():
        return False
    
    def get_id(self):
        return str(self.id)

            
            
class Group(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)
    app_add = db.Column(db.Boolean)
    app_edit_all = db.Column(db.Boolean) 
    app_edit_my = db.Column(db.Boolean)
    app_drop = db.Column(db.Boolean)    
    user_add = db.Column(db.Boolean)
    user_drop = db.Column(db.Boolean)
    
    
    users = db.relationship('User', backref='group', lazy='dynamic')
        
    def __init__(self, name, app_add, app_edit_all, app_edit_my, app_drop, user_add, user_drop):
        
        self.name = name
        self.app_add = app_add
        self.app_edit_all= app_edit_all
        self.app_edit_my= app_edit_my
        self.app_drop = app_drop
        self.user_add = user_add
        self.user_drop = user_drop

            
            
class App(db.Model):
    
    id=db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)
    link = db.Column(db.String(50), unique=True)
    desc = db.Column(db.String(50))
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    img_link = db.Column(db.String(50))
    order_id = db.Column(db.Integer)
    status = db.Column(db.Boolean)
    beta = db.Column(db.Boolean)
    maintenance = db.Column(db.Boolean)
    date = db.Column(db.TIMESTAMP)
    landing_clicks = db.Column(db.Integer) 
    component_clicks = db.Column(db.Integer)
    


    def __init__(self, name, link, desc, creator_id, img_link, date):
        self.name = name
        self.link = link
        self.desc = desc
        self.creator_id = creator_id
        self.img_link = img_link
        self.date = date
        self.status = True
        self.beta = False
        self.maintenance = False
        self.landing_clicks = 0
        self.component_clicks = 0
            
            
class Log(db.Model):
    
    id = db.Column(db.Integer,primary_key=True)
    data_time = db.Column(db.TIMESTAMP)
    content = db.Column(db.String(60)) #modelstochange - change
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, content, data_time, author_id):
        
        self.content = content
        self.data_time = data_time
        self.author_id = author_id
        
class  Note(db.Model):
     
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    tag = db.Column(db.String(20))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date = db.Column(db.TIMESTAMP)

    def __init__(self, content, tag, owner_id, date):
        self.content = content
        self.tag = tag
        self.owner_id = owner_id
        self.date = date
        

class Invite(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(25), unique=True)
    token = db.Column(db.String(50), unique=True)
    maker = db.Column(db.Integer)
    group = db.Column(db.Integer)
    date = db.Column(db.TIMESTAMP)
    
    def __init__(self, email, maker,group):
        
        self.email = email
        self.maker = maker
        self.group = group
        self.token = str(uuid.uuid4())
        self.date = "CURRENT_TIMESTAMP"


class Reset(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(25), unique=True)
    token = db.Column(db.String(50), unique=True)
    
    def __init__(self, email):
        
        self.email = email
        self.token = str(uuid.uuid4())


    
class Component(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    domain = db.Column(db.String(160), unique=True)
    
    def __init__(self, domain):
        self.domain = domain
    
    db.create_all()