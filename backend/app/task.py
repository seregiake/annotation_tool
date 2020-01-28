from flask import jsonify, request
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
        json_data = request.get_json(force=True)
        folder_name = str(json_data['name'])
        sup_id = int(json_data['super'])

        newTask = Task(folder_name=folder_name, super_id=sup_id)

        db.session.add(newTask)
        db.session.commit()

        data = db.session.query(Task) \
            .filter(Task.folder_name == folder_name,
                    Task.super_id == sup_id)

        data = data.all()[0].to_dict()

        return data, 201
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
