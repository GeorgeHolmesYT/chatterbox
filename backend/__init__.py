from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from .config import Config

socketio = SocketIO()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app)
    
    from .routes import auth_routes, message_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(message_routes.bp)
    
    socketio.init_app(app, cors_allowed_origins="*")
    
    return app
