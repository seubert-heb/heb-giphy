from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from db import db
from models.favorite import Favorite
from models.user import User
from views.parsers import categories_parser


class CategoryAPI(Resource):
    @jwt_required
    def post(self):
        current_user = get_jwt_identity()

        data = categories_parser.parse_args()

        f = Favorite.query.get(data['fave_id'])
        if not f:
            return 404

        u = User.query.filter_by(email=current_user).first()
        if not u:
            return {'error': 'user not found'}, 404
        if u.id != f.user_id:
            return {'error': 'user can only categorize their own faves'}, 403

        if not f.categories:
            f.categories = [data['category']]
        else:
            f.categories.append(data['category'])
        db.session.add(f)
        db.session.commit()
        return 200
