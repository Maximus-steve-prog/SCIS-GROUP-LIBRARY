import os
from dotenv import load_dotenv #type: ignore
from pathlib import Path

# Load environment variables from the .env file
env_path = Path('.') / '.env'  # Change to the correct path
load_dotenv(dotenv_path=env_path)


class Config :
    
    DB_USERNAME = os.environ.get('DB_USERNAME')
    DB_PASSWORD = os.environ.get('DB_PASSWORD')
    DB_HOST = os.environ.get('DB_HOST')
    DB_PORT = os.environ.get('DB_PORT')
    DB_NAME = os.environ.get('DB_NAME')
    
    
    UPLOAD_FOLDER = 'static/images' # Path relative to the app's root
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    
    # Secret Key for JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or '0b016f5159b8b483a88575e1b50cedcace00111a9b463a2ce2347864fdf74d2968449f3105b65430daa421c123e6a487139f48073662418bc8881d7dfb9d5a75f6fc90856516a3f73e5a72b1f44efbfacc062748f42942fa8befb9279a6d6845e30c73c5233bd941b777be4eebbd3383dbace2f11f52b5143ffa74bca09df073a5957a3a937a7e7627844d0e9705f1c4a3d6ee94b5d0600662ee6423365932547ecd2df424dc523a97262565cf84445f1c3761f00c6ff445ce62a664861775a69d8575b4deb924671ac9e17304d8e413e94c78072ae05f52470b95f53b29d5456570e7818da0d524827397f66098ad35a86dece1eb3a8cb650efa7bd753629f4'
    
    #Secret Key for APP
    APP_SECRET_KEY = os.environ.get('APP_SECRET_KEY')
    
    
    #Use the retrieved credentials to the database URL
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI') or \
        f'mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
