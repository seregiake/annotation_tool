from flask import jsonify, request
from flask_restful import Resource
from app.models import Annotation
from app import db


def extract_from_json(json_data):
    sub_id = int(json_data['category_id'])
    cluster = json_data['cluster_id']
    multiple = json_data['multiple']
    point = json_data['point']
    count = json_data['count']
    size = json_data['size']
    color = json_data['color']

    return [sub_id, cluster, multiple, color, point, count, size]


class AnnotationsSchema(Resource):
    def get(self, mask_id):
        annotations = db.session.query(Annotation).filter(Annotation.mask_id == mask_id)
        data = [ann.to_dict() for ann in annotations]
        j_data = jsonify(data)
        return j_data
        pass

    def post(self, mask_id):
        sub_id, cluster, multiple, color, point, count, size = extract_from_json(request.get_json(force=True))

        newAnn = Annotation(mask_id=mask_id, sub_id=sub_id, cluster=cluster,
                            multiple=multiple, color=color, point=point, count=count, size=size)

        db.session.add(newAnn)
        db.session.commit()

        data = db.session.query(Annotation).filter(Annotation.id == newAnn.id,
                                                   Annotation.mask_id == mask_id)

        data = data.all()[0].to_dict()

        return data, 201
        pass


class AnnotationSchema(Resource):
    def get(self, mask_id, ann_id):
        annotation = db.session.query(Annotation).filter(Annotation.id == ann_id,
                                                         Annotation.mask_id == mask_id)
        annotation = annotation[0].to_dict()
        return annotation
        pass

    def put(self, mask_id, ann_id):
        sub_id, cluster, multiple, color, point, count, size = extract_from_json(request.get_json(force=True))

        data = db.session.query(Annotation).filter(Annotation.id == ann_id,
                                                   Annotation.mask_id == mask_id)

        data = data[0]
        data.mask_id = mask_id
        data.sub_id = sub_id
        data.cluster = cluster
        data.multiple = multiple
        data.color = color
        data.point = point
        data.count = count
        data.size = size

        db.session.commit()

        data = data.to_dict()

        return data, 201
        pass

    def delete(self, mask_id, ann_id):
        data = db.session.query(Annotation).filter(Annotation.id == ann_id,
                                                   Annotation.mask_id == mask_id)
        data = data[0]
        send_data = data.to_dict()

        db.session.delete(data)
        db.session.commit()
        return send_data, 201
        pass
