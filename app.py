from flask import Flask
from flask_migrate import Migrate #type: ignore
from flask_jwt_extended import JWTManager #type: ignore
from flask_cors import CORS #type: ignore
from flask_socketio import SocketIO #type: ignore

from db.config import Config
from db.db import db
from routes import api

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)