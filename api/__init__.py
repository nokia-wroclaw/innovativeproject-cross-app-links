from flask import Flask

app = Flask(__name__)

import api.database
import api.models
import api.route


