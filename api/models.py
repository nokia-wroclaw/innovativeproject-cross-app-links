from flask_login import UserMixin
from api.database import db


rel = db.Table('rel',
                   db.Column('user_id', db.Integer, db.ForeignKey('user.user_id')),
                   db.Column('group_id', db.Integer, db.ForeignKey('group.group_id'))
                   )
rel1 = db.Table('rel1',
                    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id')),
                    db.Column('app_id', db.Integer, db.ForeignKey('app.app_id')))



class User(UserMixin,db.Model):
        user_id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(30), unique=True)
        relations = db.relationship('Group', secondary=rel, backref=db.backref('group_members', lazy='dynamic'))
        relations1 = db.relationship('App', secondary=rel1, backref=db.backref('app_owners', lazy='dynamic'))

        def __init__(self,user_id,username):
            self.user_id=user_id
            self.username=username

            
            
class Group(db.Model):
        group_id = db.Column(db.Integer, primary_key=True)
        group_name = db.Column(db.String(30), unique=True)

        def __init__(self,group_id,group_name):
            self.group_id=group_id
            self.group_name=group_name

            
            
class App(db.Model):
        app_id = db.Column(db.Integer, primary_key=True)
        app_name = db.Column(db.String(30), unique=True)
        app_link = db.Column(db.String(50), unique=True)
        app_desc = db.Column(db.String(50), unique=True)

        def __init__(self,app_id,app_name,app_link,app_desc):
            self.app_id=app_id
            self.app_name=app_name
            self.app_link=app_link
            self.app_desc=app_desc
            
            
            
class Log   (db.Model):
    log_id = db.Column(db.Integer,primary_key=True)
    data_time = db.Column(db.TIMESTAMP,unique=True)
    author = db.Column(db.String(40),unique=True)
    content = db.Column(db.String(60),unique=True)

    def __init__(self,log_id,data_time,author,content):
        self.log_id=log_id
        self.data_time=data_time
        self.author=author
        self.content=content