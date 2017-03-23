from api import app
from flask_sqlalchemy import SQLAlchemy
import os



#app.config['SQLALCHEMY_DATABASE_URI']= os.environ['DATABASE_URL']
app.config['SQLALCHEMY_DATABASE_URI']= 'postgres://thntcklaiyqbpp:f6f54577ecd3ef055e00ba7175b579a0726d018545e53742d3c1f21c6da236ee@ec2-54-247-166-129.eu-west-1.compute.amazonaws.com:5432/d9nu6m5q6271on'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False
db = SQLAlchemy(app)