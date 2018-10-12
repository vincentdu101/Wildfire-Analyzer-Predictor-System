class BaseConfig(object):  
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///models/wildfires.sqlite'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # used for encryption and session management
    SECRET_KEY = 'mysecretkey'