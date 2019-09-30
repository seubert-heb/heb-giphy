from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from db import db
from models.favorite import Favorite
from models.user import User
from views.parsers import faves_parser


class FavoriteAPI(Resource):
    @jwt_required
    def post(self):
        current_user = get_jwt_identity()

        data = faves_parser.parse_args()
        u = User.query.filter_by(email=data['user_email']).first()
        if not u:
            return {'error': 'user not found'}, 404
        if current_user != u.email:
            return {'error': 'user cannot fave for other users'}, 403
        f = Favorite(u.id, data['url'])
        db.session.add(f)
        db.session.commit()
        return 201

    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        u = User.query.filter_by(email=current_user).first()
        if not u:
            return {'error': 'user not found'}, 404

        return_faves = []
        faves = Favorite.query.filter_by(user_id=u.id).all()
        for fave in faves:
            return_faves.append({'url': fave.url, 'categories': fave.categories, 'id': fave.id})
        return {'faves': return_faves}
