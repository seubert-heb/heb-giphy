from flask import jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_restful import Resource

from db import db
from heb_bcrypt import bcrypt
from models.user import User
from views.parsers import user_parser


class UserAPI(Resource):
    def post(self):
        data = user_parser.parse_args()
        u = User(data['email'], bcrypt.generate_password_hash(data['password']).decode('utf-8'))
        db.session.add(u)
        db.session.commit()

        access_token = create_access_token(identity=data['email'])
        return {'token': access_token, 'user': data['email']}, 200


class Login(Resource):
    # Check a token
    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        return {'user': current_user}, 200

    def post(self):
        data = user_parser.parse_args()
        u = User.query.filter_by(email=data['email']).first()
        if not u:
            response = jsonify({'error': 'user not found'})
            response.status_code = 404
            return response

        passed = bcrypt.check_password_hash(u.password, data['password'])

        if passed:
            access_token = create_access_token(identity=data['email'])
            return {'token': access_token, 'user': data['email']}, 200
        else:
            return {'error': 'bad password'}, 403
