from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

from flask_restful import Api
from flask_cors import CORS

import os

from .src.image import ImageSchema, ImagesSchema, MaskSchema, MasksSchema
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
api.add_resource(MasksSchema, '/masks')
api.add_resource(MaskSchema, '/masks/<int:mask_id>')


# Run Server
if __name__ == '__main__':
    app.run(debug=True)

"""
# Init ma
ma = Marshmallow(app)

# Image Schema
class ImageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'url')


# Init schema
image_schema = ImageSchema()
images_schema = ImageSchema(many=True)


# Create an Image
@app.route('/image', methods=['POST'])
def add_image():
    name = request.json['name']
    url = request.json['url']

    new_image = Image(name, url)

    db.session.add(new_image)
    db.session.commit()

    return image_schema.jsonify(new_image)


# Get All Images
@app.route('/image', methods=['GET'])
def get_images():
    all_images = Image.query.all()
    result = images_schema.dump(all_images)

    return jsonify(result.data)

# Get single Image
@app.route('/image/<id>', methods=['GET'])
def get_image(id):
    image = Image.query.get(id)
    return image_schema.jsonify(image)


# Update an Image
@app.route('/image/<id>', methods=['PUT'])
def update_image(id):
    image = Image.query.get(id)

    name = request.json['name']
    url = request.json['url']

    image.name = name
    image.url = url

    db.session.commit()

    return image_schema.jsonify(image)

# Delete Image
@app.route('/image/<id>', methods=['DELETE'])
def delete_image(id):
    image = Image.query.get(id)
    db.session.delete(image)
    db.session.commit()
    return image_schema.jsonify(image)
"""

