from flask_restful import inputs, reqparse

user_parser = reqparse.RequestParser()
user_parser.add_argument('email', required=True, type=inputs.regex('\S*@\S*')) # NOQA
user_parser.add_argument('password', required=True)

faves_parser = reqparse.RequestParser()
faves_parser.add_argument('user_email', required=True)
faves_parser.add_argument('url', required=True)

categories_parser = reqparse.RequestParser()
categories_parser.add_argument('fave_id', required=True)
categories_parser.add_argument('category', required=True)
