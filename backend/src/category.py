# from ..app import db
from flask import jsonify, request
from flask_restful import abort, Resource, reqparse
from werkzeug.debug import console
import json


CATEGORIES = json.load(open('src/data/categories.json'))

# CategoriesList
# shows a list of all categories
class CategoriesSchema(Resource):

    def get(self):
        # con flask
        # jsonify({'IMAGES': IMAGES})
        return CATEGORIES
