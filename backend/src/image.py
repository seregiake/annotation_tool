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


def abort_if_image_doesnt_exist(image_id):
    image = [image for image in IMAGES if image['id'] == image_id]
    if len(image) == 0:
        abort(404, message="Image {} doesn't exist".format(image_id))


""" images_folder = os.listdir('static/img') """


# ImagesList
# shows a list of all images in the folder images
class ImagesSchema(Resource):
    """
    def __init__(self):
        for count, image in enumerate(images_folder, 1):
            IMAGES[count] = {
                'id': count,
                'image': image,
                'path': 'http://127.0.0.1:5000/static/img/' + image
            }
    """

    def get(self):
        # con flask
        # jsonify({'IMAGES': IMAGES})
        return {'IMAGES': IMAGES}

    def post(self):
        pass


# Image
# shows a single image and lets you delete a item
# added the put method but it isn't necessary
class ImageSchema(Resource):

    def get(self, image_id):
        abort_if_image_doesnt_exist(image_id)
        # con flask
        # jsonify({'image': IMAGES[image_id-1]})
        return {'image': IMAGES[image_id - 1]}
        pass

    def put(self, image_id):
        pass

    def delete(self, image_id):
        abort_if_image_doesnt_exist(image_id)
        del IMAGES[image_id]
        return '', 204


from .segmentation import segment_image
from .boundaries import get_boundaries

MASKS = [
    {
        'id': 1,
        'mask': 0,
        'boundaries': 0,
        'valid': "N",
        'ratio': 0.5,
        'kernel': 2,
        'dist': 10
    },
    {
        'id': 2,
        'mask': 0,
        'boundaries': 0,
        'valid': "N",
        'ratio': 0.5,
        'kernel': 2,
        'dist': 10
    },
    {
        'id': 3,
        'mask': 0,
        'boundaries': 0,
        'valid': "N",
        'ratio': 0.5,
        'kernel': 2,
        'dist': 10
    },
    {
        'id': 4,
        'mask': 0,
        'boundaries': 0,
        'valid': "N",
        'ratio': 0.5,
        'kernel': 2,
        'dist': 10
    },
    {
        'id': 5,
        'mask': 0,
        'boundaries': 0,
        'valid': "N",
        'ratio': 0.5,
        'kernel': 2,
        'dist': 10
    },
    {
        'id': 6,
        'mask': 0,
        'boundaries': 0,
        'valid': "N",
        'ratio': 0.5,
        'kernel': 2,
        'dist': 10
    },
    {
        'id': 7,
        'mask': 0,
        'boundaries': 0,
        'valid': "N",
        'ratio': 0.5,
        'kernel': 2,
        'dist': 10
    },
    {
        'id': 8,
        'mask': 0,
        'boundaries': 0,
        'valid': "N",
        'ratio': 0.5,
        'kernel': 2,
        'dist': 10
    }
]  # mask, ratio, kernel, max-dist


# mask_id corrisponde a image_id


def abort_if_mask_doesnt_exist(mask_id):
    mask = [mask for mask in MASKS if mask['id'] == mask_id]
    if len(mask) == 0:
        abort(404, message="Mask {} doesn't exist".format(mask_id))

"""
parser = reqparse.RequestParser()
parser.add_argument('ratio')
parser.add_argument('dist')
parser.add_argument('kernel')
"""

# MasksList
# shows a list of all images in the folder images
class MasksSchema(Resource):

    def get(self):
        return {'MASK': MASKS}

    def post(self):  # user_id, image_id, cluster_id, color
        # controllo su mask_id al max uguale al max image_id
        # chiama funzione che crea la maschera

        json_data = request.get_json(force=True)
        image_id = int(json_data['id'])

        abort_if_image_doesnt_exist(image_id)
        mask_id = image_id

        """
        !!! DA RIGUARDARE !!!
        Aggiungere controllo: esiste gia la maschera con mask_id? 
         - Si -> aggiorno la maschera esistente (anche se invalida)
         - No -> creo una nuova maschera e faccio append al dizionario MASKS
                Attenzione! Se ad es. ho solo due elementi e devo aggiungere il 7° 
                devo prima fare l'append di tutte le maschere precedenti con 'valid': "N"
        """

        # prendi immagine
        image = IMAGES[image_id - 1]
        ratio = float(json_data['ratio'])
        dist = int(json_data['dist'])
        kernel = int(json_data['kernel'])

        first_mask = segment_image(image['name'], ratio, kernel, dist)
        mask = json.dumps(first_mask.tolist())
        boundaries = get_boundaries(first_mask, image['size'][0], image['size'][1])

        MASKS[mask_id - 1] = {
            'id': mask_id,
            'mask': mask,
            'boundaries': boundaries,
            'valid': "Y",
            'ratio': ratio,
            'dist': dist,
            'kernel': kernel
        }

        """
        abort_if_image_doesnt_exist(image_id)
        mask_id = image_id

        # prendi immagine

        image = IMAGES[image_id - 1]
        args = parser.parse_args()
        mask = segment_image(image['url'], args['ratio'], args['kernel'], args['max-dist'])

        MASKS[mask_id - 1] = {
            'mask': mask,
            'valid': "Y",
            'ratio': args['ratio'],
            'kernel': args['kernel'],
            'max-dist': args['max-dist']
        }
        return MASKS[mask_id - 1], 201
        """

        return MASKS[mask_id - 1], 201


# Mask
class MaskSchema(Resource):

    def get(self, mask_id):  # return mask for image, add user_id
        abort_if_mask_doesnt_exist(mask_id)

        """
        if mask['valid'] == "N":
            abort(404, message="Mask {} doesn't valid".format(mask_id))
        """
        return {'mask': MASKS[mask_id - 1]}
        pass

    """
    def post(self, image_id):  # user_id, image_id, cluster_id, color
        # controllo su mask_id al max uguale al max image_id
        # chiama funzione che crea la maschera

        abort_if_image_doesnt_exist(image_id)
        mask_id = image_id

        # prendi immagine
        image = IMAGES[image_id - 1]
        mask = segment_image(image['name'], 2, 3, 10)


        args = parser.parse_args()
        
        # mask = segment_image(image['url'], args['ratio'], args['kernel'], args['max-dist'])
        

        MASKS[mask_id - 1] = {
            'mask': mask,
            'valid': "Y",
            'ratio': args['ratio'],
            'kernel': args['kernel'],
            'max-dist': args['max-dist']
        }

        return MASKS[mask_id - 1], 201
    """

    def delete(self, mask_id):
        abort_if_mask_doesnt_exist(mask_id)
        MASKS[mask_id - 1]['valid'] == "N"
        return {'MASKS': MASKS[mask_id - 1]}
