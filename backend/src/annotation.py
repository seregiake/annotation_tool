# from ..app import db
from flask import jsonify, request
from flask_restful import abort, Resource, reqparse
from werkzeug.debug import console
import json


def open_annotations_file():
    with open('src/data/annotations.json', "r") \
            as jsonFile:
        ANNOTATIONS = json.load(jsonFile)
        return ANNOTATIONS


def abort_if_ann_doesnt_exist(user_id, ann_id):
    ANNOTATIONS = open_annotations_file()
    ann = []
    for key in ANNOTATIONS[user_id]:
        if ANNOTATIONS[user_id][key]["id"] == ann_id:
            ann = ANNOTATIONS[user_id][key]
    if len(ann) == 0:
        abort(404, message="Annotation {} doesn't exist".format(ann_id))


# AnnotationsList
# shows a list of all images in the folder images
class AnnotationsSchema(Resource):

    def get(self, user_id):
        ANNOTATIONS = open_annotations_file()
        index = str(user_id)
        return ANNOTATIONS[index]

    def post(self, user_id):
        ANNOTATIONS = open_annotations_file()
        index = str(user_id)

        max_ann = 0

        for key in ANNOTATIONS[index]:
            if ANNOTATIONS[index][key]["id"] > max_ann:
                max_ann = ANNOTATIONS[index][key]["id"]

        """
        for ann in ANNOTATIONS[index]:
            if ann['id'] > max_ann:
                max_ann = ann['id']
        """

        key = max_ann + 1

        json_data = request.get_json(force=True)

        image_id = int(json_data['image_id'])
        category_id = int(json_data['category_id'])
        multiple = int(json_data['multiple'])
        counts = []
        size = []
        # counts = json_data['counts']
        # size = json_data['size']
        cluster_id = json_data['cluster_id']
        point = json_data['point']
        color = json_data['color']
        annotation = {
            'id': max_ann + 1,
            'category_id': category_id,
            'image_id': image_id,
            'cluster_id': cluster_id,
            'point': point,
            'color': color,
            'multiple': multiple,
            'segmentation': {
                "counts": counts,
                "size": size
            }
        }
        ANNOTATIONS[index].update({key: annotation})
        with open("src/data/annotations.json", "w") as jsonFile:
            json.dump(ANNOTATIONS, jsonFile)
        # return ANNOTATIONS[key - 1], 201
        return ANNOTATIONS[index][key], 201


# Annotation
class AnnotationSchema(Resource):

    def get(self, user_id, ann_id):
        ANNOTATIONS = open_annotations_file()
        index = str(user_id)
        # ann_id è il campo id dell'annotazione non il numero dell'annozaione
        abort_if_ann_doesnt_exist(index, ann_id)
        for key in ANNOTATIONS[index]:
            if ANNOTATIONS[index][key]["id"] == ann_id:
                return ANNOTATIONS[index][key], 201

    def put(self, user_id, ann_id):
        ANNOTATIONS = open_annotations_file()
        index = str(user_id)
        abort_if_ann_doesnt_exist(index, ann_id)
        for key in ANNOTATIONS[index]:
            if ANNOTATIONS[index][key]["id"] == ann_id:
                image_id = ANNOTATIONS[index][key]['image_id']
                json_data = request.get_json(force=True)
                category_id = int(json_data['category_id'])
                multiple = int(json_data['multiple'])
                counts = json_data['counts']
                size = json_data['size']
                cluster_id = json_data['cluster_id']
                point = json_data['point']
                color = json_data['color']
                newAnn = {
                    'id': ann_id,
                    'category_id': category_id,
                    'image_id': image_id,
                    'cluster_id': cluster_id,
                    'point': point,
                    'color': color,
                    'multiple': multiple,
                    'segmentation': {
                        "counts": counts,
                        "size": size
                    }
                }
                ANNOTATIONS[index][key] = newAnn
                with open("src/data/annotations.json",
                          "w") as jsonFile:
                    json.dump(ANNOTATIONS, jsonFile)
                return ANNOTATIONS[index][key], 201

    def delete(self, user_id, ann_id):
        ANNOTATIONS = open_annotations_file()
        index = str(user_id)
        abort_if_ann_doesnt_exist(index, ann_id)
        for key in ANNOTATIONS[index]:
            if ANNOTATIONS[index][key]["id"] == ann_id:
                annotation = ANNOTATIONS[index][key]
                del ANNOTATIONS[index][key]
                with open("src/data/annotations.json",
                          "w") as jsonFile:
                    json.dump(ANNOTATIONS, jsonFile)
                return annotation, 201
