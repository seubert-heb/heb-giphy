from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api

import config
from db import db
from heb_bcrypt import bcrypt
from views import categories, favorites, giphy, users

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
app.config['GIPHY_API_KEY'] = config.GIPHY_API_KEY
api = Api(app)
jwt = JWTManager(app)
CORS(app)

db.init_app(app)
bcrypt.init_app(app)

with app.app_context():
    db.create_all()

api.add_resource(users.UserAPI, '/user')
api.add_resource(users.Login, '/login')
api.add_resource(giphy.GiphyList, '/gifs')
api.add_resource(favorites.FavoriteAPI, '/favorites')
api.add_resource(categories.CategoryAPI, '/category')
