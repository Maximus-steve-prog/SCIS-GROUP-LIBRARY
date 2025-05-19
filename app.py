from flask import Flask
from flask_cors import CORS #type: ignore
from routes.employee import employee_routes
from routes.message import message_bp
from routes.books import books_bp
from extensions.socketio import init_socketio, db, bcrypt, jwt, socketio
from db.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init extensions
    db.init_app(app)
    CORS(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(employee_routes)
    app.register_blueprint(message_bp)
    app.register_blueprint(books_bp)

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    socketio = init_socketio(app)
    socketio.run(app, host='192.168.48.11', port=2025, debug=True)
