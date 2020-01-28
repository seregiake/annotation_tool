from flask import jsonify, request
from flask_restful import Resource, abort
from app.models import Mask, Image, Annotation
from app import db
from flask_restful.representations import json


import os
import json
import numpy as np
from skimage.segmentation import quickshift, find_boundaries, mark_boundaries
import matplotlib.image as mpimg
from skimage.util import img_as_float


def segment_image(path_to_image, ratio=0.5, kernel_size=2, max_dist=10):
    # Sicuramente non va bene qualcosa in path.. perche non passare direttamente il path
    image = mpimg.imread("app/" + path_to_image)
    img = img_as_float(image)

    # !!! Source image colorspace should be RGB to allow RGB2LAB conversion
    segmented_mask = quickshift(img, ratio, kernel_size, max_dist)

    # array_data_type = segmented_mask.dtype.name
    # array_shape = segmented_mask.shape
    # as_bytes = segmented_mask.tobytes()

    # serialized = json.dumps(segmented_mask.tolist())
    return segmented_mask


def get_boundaries(segments_quick, width, height):
    blank_image = np.zeros((height, width, 3), np.uint8)
    blank_image[:] = (255, 255, 255)  # (B, G, R)

    marked_bound = mark_boundaries(blank_image, segments_quick, color=(0, 0, 0)).astype(int);
    # marked_bound = find_boundaries(segments_quick, connectivity=1, mode="thick", background=0).astype(np.uint8)

    # array_data_type = marked_bound.dtype.name
    # array_shape = marked_bound.shape
    # as_bytes = marked_bound.tobytes()

    serialized = json.dumps(marked_bound.tolist())
    return serialized



def abort_if_mask_doesnt_exist(mask_id):
    superclass = Mask.query.get(mask_id)
    if superclass is None:
        abort(404, message="Mask {} doesn't exist".format(mask_id))


def extract_from_json(json_data):
    image = int(json_data['id'])
    sup = int(json_data['super'])
    ratio = float(json_data['ratio'])
    dist = int(json_data['dist'])
    kernel = int(json_data['kernel'])

    img = Image.query.get(image).to_dict()

    first_mask = segment_image(img['path'], ratio, kernel, dist)
    mask = json.dumps(first_mask.tolist())
    size = img['size']

    boundaries = get_boundaries(first_mask, int(size[0]), int(size[1]))
    return [image, sup, ratio, dist, kernel, mask, boundaries]


class MasksSchema(Resource):
    def get(self, user_id):
        masks = db.session.query(Mask).filter(Mask.user_id == user_id)
        data = [mask.to_dict() for mask in masks]
        j_data = jsonify(data)
        return j_data
        pass

    def post(self, user_id):
        """
        json_data = request.get_json(force=True)
        image = int(json_data['id'])
        sup = int(json_data['super'])
        ratio = float(json_data['ratio'])
        dist = int(json_data['dist'])
        kernel = int(json_data['kernel'])

        img = Image.query.get(image).to_dict()

        first_mask = segment_image(img['path'], ratio, kernel, dist)
        mask = json.dumps(first_mask.tolist())
        size = img['size']

        boundaries = get_boundaries(first_mask, int(size[0]), int(size[1]))
        """

        image, sup, ratio, dist, kernel, mask, boundaries = extract_from_json(request.get_json(force=True))

        newMask = Mask(user_id=user_id, image_id=image, super_id=sup,
                       kernel=kernel, dist=dist, ratio=ratio)

        db.session.add(newMask)
        db.session.commit()

        data = db.session.query(Mask) \
            .filter(Mask.user_id == user_id,
                    Mask.image_id == image,
                    Mask.super_id == sup)

        data = data.all()[0].to_dict()

        send_data = {
            'id': data['id'],
            'user_id': data['user_id'],
            'mask': mask,
            'boundaries': boundaries,
            'ratio': data['ratio'],
            'dist': data['dist'],
            'kernel': data['kernel']
        }

        return send_data, 201
        pass


class MaskSchema(Resource):
    def get(self, user_id, image_id, super_id):
        data = db.session.query(Mask).filter(Mask.user_id == user_id,
                                             Mask.image_id == image_id,
                                             Mask.super_id == super_id)
        if len(data.all()) == 0:
            data = "Mask doesn\'t exist"
            j_data = jsonify(data)
        else:
            data = data.all()[0].to_dict()
            img = Image.query.get(image_id).to_dict()

            first_mask = segment_image(img['path'], data['ratio'], data['kernel'], data['dist'])
            mask = json.dumps(first_mask.tolist())
            size = img['size']
            boundaries = get_boundaries(first_mask, int(size[0]), int(size[1]))

            send_data = {
                'id': data['id'],
                'mask': mask,
                'boundaries': boundaries,
                'ratio': data['ratio'],
                'dist': data['dist'],
                'kernel': data['kernel']
            }
            j_data = jsonify(send_data)

        return j_data
        pass

    def put(self, user_id, image_id, super_id):

        image, sup, ratio, dist, kernel, mask, boundaries = extract_from_json(request.get_json(force=True))

        data = db.session.query(Mask).filter(Mask.user_id == user_id,
                                             Mask.image_id == image_id,
                                             Mask.super_id == super_id)

        data = data[0]
        data.kernel = kernel
        data.dist = dist
        data.ratio = ratio

        ann_data = db.session.query(Annotation).filter(Annotation.mask_id == data.id)
        if len(ann_data.all()) != 0:
            for ann in ann_data:
                db.session.delete(ann)

        db.session.commit()

        data = data.to_dict()

        send_data = {
            'id': data['id'],
            'mask': mask,
            'boundaries': boundaries,
            'ratio': data['ratio'],
            'dist': data['dist'],
            'kernel': data['kernel']
        }
        return send_data, 201
        pass

    def delete(self):
        pass
