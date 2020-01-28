from flask import jsonify
from flask_restful import Resource, abort
from app.models import Superclass, Subclass
from app import db


def abort_if_superclass_doesnt_exist(super_id):
    superclass = Superclass.query.get(super_id)
    if superclass is None:
        abort(404, message="Superclass {} doesn't exist".format(super_id))


class SuperclassesSchema(Resource):
    def get(self):
        data = [superclass.to_dict() for superclass in Superclass.query.all()]
        j_data = jsonify(data)
        return j_data
        pass

    def post(self):
        pass


class SuperclassSchema(Resource):
    def get(self, super_id):
        abort_if_superclass_doesnt_exist(super_id)
        subclasses = db.session.query(Subclass).filter(Subclass.super_id == super_id)
        sub_data = [subclass.to_dict() for subclass in subclasses]
        return sub_data
        pass

    def put(self):
        pass

    def delete(self):
        pass


def abort_if_subclass_doesnt_exist(sub_id):
    subclass = Superclass.query.get(sub_id)
    if subclass is None:
        abort(404, message="Subclass {} doesn't exist".format(sub_id))


class SubclassesSchema(Resource):
    def get(self):
        data = [subclass.to_dict() for subclass in Subclass.query.all()]
        j_data = jsonify(data)
        return j_data
        pass

    def post(self):
        pass


class SubclassSchema(Resource):
    def get(self, sub_id):
        abort_if_subclass_doesnt_exist(sub_id)
        data = Subclass.query.get(sub_id).to_dict()
        j_data = jsonify(data)
        return j_data
        pass

    def put(self):
        pass

    def delete(self):
        pass
