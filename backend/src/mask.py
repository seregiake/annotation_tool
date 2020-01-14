import parser
from .image import ImagesSchema, ImageSchema, abort_if_image_doesnt_exist
from .annotation import AnnotationsSchema
from .segmentation import segment_image
from flask_restful import abort, Resource, reqparse

import numpy as np

MASKS = [
    {
        'id': 1,
        'mask': 1,
        'ratio': 0.5,
        'kernel': 2,
        'max-dist': 10
    },
    {
        'id': 2,
        'mask': np.zeros,
        'ratio': 0.5,
        'kernel': 2,
        'max-dist': 10
    }
]  # mask, ratio, kernel, max-dist


# mask_id corrisponde a image_id


def abort_if_mask_doesnt_exist(mask_id):
    mask = [mask for mask in MASKS if mask['id'] == mask_id]
    if len(mask) == 0:
        abort(404, message="Mask {} doesn't exist".format(mask_id))


parser = reqparse.RequestParser()
parser.add_argument('id')
parser.add_argument('ratio')
parser.add_argument('dist')
parser.add_argument('kernel')


# Mask
class MaskSchema(Resource):

    def get(self, image_id):  # return mask for image, add user_id
        mask_id = image_id
        abort_if_mask_doesnt_exist(mask_id)

        # con flask
        # jsonify({'image': IMAGES[image_id-1]})
        return {'mask': MASKS[mask_id - 1]}
        pass

    def post(self):  # user_id, image_id, cluster_id, color
        # controllo su mask_id al max uguale al max image_id
        # chiama funzione che crea la maschera




        """
        args = parser.parse_args()
        abort_if_image_doesnt_exist(args['id'])
        mask_id = args['id']

        # prendi immagine
        image = ImageSchema.get(mask_id)
        args = parser.parse_args()
        mask = segment_image(image['url'], args['ratio'], args['kernel'], args['dist'])

        MASKS[mask_id] = {
            'mask': mask,
            'ratio': args['ratio'],
            'kernel': args['kernel'],
            'max-dist': args['dist']
        }
        return MASKS[mask_id], 201
        """

        return MASKS[mask_id], 201



    """
    def put(self, mask_id):  # user_id, image_id, cluster_id, color
        args = parser.parse_args()
        mask = {
            'mask': args['mask']}
        MASKS[mask_id] = mask
        return mask, 201
    

    def delete(self, mask_id):
        mask = {
            'mask': '0'}  # invalidate mask
        MASKS[mask_id] = mask
        return {'MASKS': mask}
    """
