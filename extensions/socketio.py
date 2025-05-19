from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from gevent import monkey


monkey.patch_all()
# Create instances
socketio = SocketIO(cors_allowed_origins="*", async_mode='gevent')
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def init_socketio(app):
    socketio.init_app(app)
    return socketio
