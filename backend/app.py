from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

from flask_restful import Api
from flask_cors import CORS

import json
import os

from .src.image import ImageSchema, ImagesSchema
from .src.mask import MaskSchema, MasksSchema
from .src.annotation import AnnotationSchema, AnnotationsSchema
from .src.category import CategoriesSchema
# from .src.mask import MaskSchema

# Init app
app = Flask(__name__, static_folder='src/static')


"""
basedir = os.path.abspath(os.path.dirname(__file__))
# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init db
db = SQLAlchemy(app)
"""

CORS(app)

api = Api(app)

api.add_resource(ImagesSchema, '/images')
api.add_resource(ImageSchema, '/images/<int:image_id>')
api.add_resource(MasksSchema, '/masks/<int:user_id>')
api.add_resource(MaskSchema, '/masks/<int:user_id>/<int:mask_id>')
api.add_resource(AnnotationsSchema, '/annotations/<int:user_id>')
api.add_resource(AnnotationSchema, '/annotations/<int:user_id>/<int:ann_id>')
api.add_resource(CategoriesSchema, '/categories')

# Run Server
if __name__ == '__main__':
    app.run(debug=True)


