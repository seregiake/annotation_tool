from flask import jsonify
from flask_restful import Resource, abort
from app.models import Image, Task
from app import db


def abort_if_image_doesnt_exist(image_id):
    image = Image.query.get(image_id)
    if image is None:
        abort(404, message="Image {} doesn't exist".format(image_id))


class ImagesSchema(Resource):
    def get(self):
        data = [image.to_dict() for image in Image.query.all()]
        j_data = jsonify(data)
        return j_data
        pass

    def post(self):
        pass

class ImagesTaskSchema(Resource):
    def get(self, task_id):
        task = Task.query.get(task_id).to_dict()
        data = [image.to_dict() for image in db.session.query(Image).filter(Image.folder_name == task['folder_name'])]
        j_data = jsonify(data)
        return j_data
        pass

    def post(self):
        pass



class ImageSchema(Resource):
    def get(self, image_id):
        abort_if_image_doesnt_exist(image_id)
        data = Image.query.get(image_id).to_dict()
        j_data = jsonify(data)
        return j_data
        pass

    def put(self, image_id):
        pass

    def delete(self, image_id):
        pass
