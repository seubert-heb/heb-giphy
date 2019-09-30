from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.mutable import MutableList

from db import db


class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    url = db.Column(db.String(1000), nullable=False)
    categories = db.Column('categories', MutableList.as_mutable(ARRAY(db.String(100))))

    def __init__(self, user_id, url):
        self.user_id = user_id
        self.url = url
