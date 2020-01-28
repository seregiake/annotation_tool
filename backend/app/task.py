from flask import jsonify
from flask_restful import Resource, abort
from app.models import Task
from app import db


class TasksSchema(Resource):
    def get(self):
        data = [task.to_dict() for task in Task.query.all()]
        j_data = jsonify(data)
        return j_data
        pass

    def post(self):
        pass


class TaskSchema(Resource):
    def get(self, task_id):
        data = Task.query.get(task_id).to_dict()
        j_data = jsonify(data)
        return j_data
        pass

    def put(self, task_id):
        pass

    def delete(self, task_id):
        pass
