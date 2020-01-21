# from ..app import db
from flask import jsonify, request
from flask_restful import abort, Resource, reqparse
from werkzeug.debug import console
import json

"""
# Image Class/Model
class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), default="undefined_name")
    url = db.Column(db.String(100))

    def __init__(self, name, url):
        self.name = name
        self.url = url
"""

# images_folder = os.listdir('static/img')
# per il momento IMAGES è un dizionario python scritto a mano
# l'idea è di far si che al momento del lancio dell'app venga creato
# automaticamente da una funzione che legge la cartella static/img/

# IMAGES = []

"""
IMAGES = [
    {
        'id': 1,
        'name': 'IMG1.jpg',
        'size': [1200, 800],
        'url': 'http://127.0.0.1:5000/static/img/IMG1.jpg'
    },
    {
        'id': 2,
        'name': 'IMG2.jpg',
        'size': [400, 300],
        'url': 'http://127.0.0.1:5000/static/img/IMG2.jpg'
    },
    {
        'id': 3,
        'name': 'IMG3.jpg',
        'size': [3500, 2333],
        'url': 'http://127.0.0.1:5000/static/img/IMG3.jpg'
    },
    {
        'id': 4,
        'name': 'IMG4.jpg',
        'size': [626, 375],
        'url': 'http://127.0.0.1:5000/static/img/IMG4.jpg'
    },
    {
        'id': 5,
        'name': 'IMG5.jpg',
        'size': [700, 467],
        'url': 'http://127.0.0.1:5000/static/img/IMG5.jpg'
    },
    {
        'id': 6,
        'name': 'IMG6.jpg',
        'size': [1000, 560],
        'url': 'http://127.0.0.1:5000/static/img/IMG6.jpg'
    },
    {
        'id': 7,
        'name': 'IMG7.jpg',
        'size': [295, 171],
        'url': 'http://127.0.0.1:5000/static/img/IMG7.jpg'
    },
    {
        'id': 8,
        'name': 'IMG8.jpg',
        'size': [312, 233],
        'url': 'http://127.0.0.1:5000/static/img/IMG8.jpg'
    }
]
"""

IMAGES = json.load(open('src/data/images.json'))

def abort_if_image_doesnt_exist(image_id):
    image = [image for image in IMAGES if image == image_id]
    if len(image) == 0:
        abort(404, message="Image {} doesn't exist".format(image_id))


# ImagesList
# shows a list of all images in the folder images
class ImagesSchema(Resource):

    def get(self):
        # con flask
        # jsonify({'IMAGES': IMAGES})
        return IMAGES

    def post(self):
        pass


# Image
# shows a single image and lets you delete a item
# added the put method but it isn't necessary
class ImageSchema(Resource):

    def get(self, image_id):
        index = str(image_id - 1)
        abort_if_image_doesnt_exist(index)
        # con flask
        # jsonify({'image': IMAGES[image_id-1]})
        # return {'image': IMAGES[image_id - 1]}
        return IMAGES[index]
        pass

