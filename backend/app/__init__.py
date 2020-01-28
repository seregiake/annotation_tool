from flask import Flask, jsonify
from flask_jwt import JWT, jwt_required, JWTError
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

CORS(app)


api = Api(app)

from app.image import ImageSchema, ImagesSchema
from app.mask import MaskSchema, MasksSchema
from app.annotation import AnnotationSchema, AnnotationsSchema
from app.category import SuperclassesSchema, SuperclassSchema
from app.user import UsersSchema, UserSchema
from app.task import TasksSchema, TaskSchema

from app.security import authenticate, identity

jwt = JWT(app, authenticate, identity)


@jwt.auth_response_handler
def customized_response_handler(access_token, identity):
    return jsonify({
        'access_token': access_token.decode('utf-8'),
        'user_id': identity.id,
        'admin': identity.admin
        })


api.add_resource(ImagesSchema, '/images')
api.add_resource(ImageSchema, '/images/<int:image_id>')

api.add_resource(MasksSchema, '/masks/<int:user_id>')
api.add_resource(MaskSchema, '/masks/<int:user_id>/<int:image_id>/<int:super_id>')

api.add_resource(AnnotationsSchema, '/annotations/<int:mask_id>')
api.add_resource(AnnotationSchema, '/annotations/<int:mask_id>/<int:ann_id>')

api.add_resource(SuperclassesSchema, '/categories')
api.add_resource(SuperclassSchema, '/categories/<int:super_id>')

api.add_resource(UsersSchema, '/users')
api.add_resource(UserSchema, '/users/<int:user_id>')

api.add_resource(TasksSchema, '/tasks')
api.add_resource(TaskSchema, '/tasks/<int:task_id>')


@app.errorhandler(JWTError)
def auth_error_handler(err):
    return jsonify({'message': 'Could not authorize user.'}), 400


from app import models
