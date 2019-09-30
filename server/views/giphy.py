from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from clients import giphy
import config
from db import db
from models.favorite import Favorite
from models.user import User


class GiphyList(Resource):
    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        u = User.query.filter_by(email=current_user).first()
        if not u:
            return {'error': 'user not found'}, 404

        gclient = giphy.GiphyClient(config.GIPHY_API_KEY)  # TODO: Initialize this once & get it into views
        search_term = request.args.get('search')
        gifs = gclient.search_gifs(search_term)

        return_gifs = []
        for gif in gifs:
            q = db.session.query(Favorite).filter(Favorite.user_id == u.id, Favorite.url == gif)
            already_fave = db.session.query(q.exists()).scalar()
            return_gifs.append({'url': gif, 'favorite': already_fave})

        return {'gifs': return_gifs}, 200
