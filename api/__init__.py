from flask import Flask
import os

app = Flask(__name__)
app.secret_key = os.urandom(12)

import api.mail
import api.database
import api.models
import api.restfull
import api.route
import api.upload