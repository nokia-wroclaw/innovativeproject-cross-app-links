from flask import Flask
import os

app = Flask(__name__)
app.secret_key = os.urandom(32)

import api.database
from api.database import db
import api.models
import api.route
import api.mail

db.create_all()
import api.restfull
import api.upload