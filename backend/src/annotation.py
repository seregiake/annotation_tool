# from ..app import db
import parser

from flask_restful import abort, Resource, reqparse

"""
# Annotation Class/Model
class Annotation(db.Model):
    __tablename__ = 'annotations'
    id = db.Column(db.Integer, primary_key=True)
    # Foreign Keys
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'))
    image_id = db.Column(db.String(50), db.ForeignKey('images.id'))

    cluster_id = db.Column(db.String(50))
    color = db.Column(db.String(20))

    def __init__(self, user_id, image_id, cluster_id, color):
        self.user_id = user_id
        self.image_id = image_id
        self.cluster_id = cluster_id
        self.color = color
"""

ANNOTATIONS = []


def abort_if_annotation_doesnt_exist(annotation_id):
    annotation = [annotation for annotation in ANNOTATIONS if annotation['id'] == annotation_id]
    if len(annotation) == 0:
        abort(404, message="Image {} doesn't exist".format(annotation_id))


parser = reqparse.RequestParser()
parser.add_argument('label_name')
parser.add_argument('user_id')
parser.add_argument('image_id')
parser.add_argument('cluster_id')
parser.add_argument('color')


# Annotations
class AnnotationsSchema(Resource):

    def get_all(self):  # return all annotations
        return {'ANNOTATIONS': ANNOTATIONS}

    def get(self, image_id):  # return annotation for image, add user_id
        i = 0
        image_annotation = []
        for annotation in ANNOTATIONS:
            if annotation['image_id'] == image_id:
                image_annotation[i] = annotation
            i = i + 1

        return {'ANNOTATIONS': image_annotation}

    def post(self):  # user_id, image_id, cluster_id, color
        args = parser.parse_args()
        annotation_id = int(max(ANNOTATIONS.keys())) + 1
        ANNOTATIONS[annotation_id] = {
            'id': annotation_id,
            'label_name': args['label_name'],
            'user_id': args['user_id'],
            'image_id': args['image_id'],
            'cluster_id': args['cluster_id'],
            'color': args['color']}
        return ANNOTATIONS[annotation_id], 201

    def put(self, annotation_id):  # user_id, image_id, cluster_id, color
        args = parser.parse_args()
        annotation = {
            'label_name': args['label_name'],
            'user_id': args['user_id'],
            'image_id': args['image_id'],
            'cluster_id': args['cluster_id'],
            'color': args['color']}
        ANNOTATIONS[annotation_id] = annotation
        return annotation, 201

    def delete(self, image_id):  # delete annotations for image, add user_id
        i = 0
        image_annotation = []
        for annotation in ANNOTATIONS:
            if annotation['image_id'] == image_id:
                image_annotation[i] = annotation
                del ANNOTATIONS[annotation['annotation_id']]
            i = i + 1
        return {'ANNOTATIONS': image_annotation}

    def delete_one(self, annotation_id):
        abort_if_annotation_doesnt_exist(annotation_id)
        del ANNOTATIONS[annotation_id]
        return '', 204


"""
# Annotation
class AnnotationSchema(Resource):

    def get(self, annotation_id):
        abort_if_annotation_doesnt_exist(annotation_id)
        return {'annotation': ANNOTATIONS[annotation_id - 1]}
        pass

    def put(self, annotation_id):  # user_id, image_id, cluster_id, color
        args = parser.parse_args()
        annotation = {
            'user_id': args['user_id'],
            'image_id': args['image_id'],
            'cluster_id': args['cluster_id'],
            'color': args['color']}
        ANNOTATIONS[annotation_id] = annotation
        return annotation, 201

    def delete_one(self, annotation_id):
        abort_if_annotation_doesnt_exist(annotation_id)
        del ANNOTATIONS[annotation_id]
        return '', 204
"""
