from flask_login import UserMixin
from api.database import db

class User(UserMixin, db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String(25), unique=True)
    username=db.Column(db.String(30), unique=True)
    password_hash=db.Column(db.String(128))
    group_id=db.Column(db.Integer, db.ForeignKey('group.id'))
    
    applications=db.relationship('App', backref='creator', lazy='dynamic')
    logs=db.relationship('Log', backref='author', lazy='dynamic')

    def __init__(self, email, password_hash):
        
        self.email=email
        self.password_hash=password_hash
        self.username=email.split('@')[0]

            
            
class Group(db.Model):
    
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(30), unique=True)
    
    users=db.relationship('User', backref='group', lazy='dynamic')
        
    def __init__(name):
        
        self.group_name=name

            
            
class App(db.Model):
    
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(30), unique=True)
    link=db.Column(db.String(50), unique=True)
    desc=db.Column(db.String(50))
    creator_id=db.Column(dbInteger, db.ForeignKey('user.id'))

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

    def __init__(self, data_time, content, author_id):
        
        self.data_time=data_time
        self.author=author
        self.content=content