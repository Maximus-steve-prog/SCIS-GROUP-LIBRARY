from flask import Flask
from flask_migrate import Migrate #type: ignore
from flask_jwt_extended import JWTManager #type: ignore
from flask_cors import CORS #type: ignore
from flask_socketio import SocketIO #type: ignore

from db.config import Config
from db.db import db

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)
socketIO = SocketIO(app, cors_allowed_origins='*')  
# Import and Register Blueprints
from routes.employee import employee_routes
app.register_blueprint(employee_routes)


with app.app_context():
    db.create_all()



if __name__ == '__main__':
    socketIO.run(app, host='192.168.48.49', port=2025 , debug=True)