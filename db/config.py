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
    
    # Secret Key for JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    
    #Secret Key for APP
    APP_SECRET_KEY = os.environ.get('APP_SECRET_KEY')
    
    
    #Use the retrieved credentials to the database URL
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI') or \
        f'mysql+mysqlconnector://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
