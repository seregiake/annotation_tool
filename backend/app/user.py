from flask_jwt import jwt_required
from flask_restful import Resource
from flask import json, jsonify, request
from app.models import User
from app import db


class UsersSchema(Resource):
    def get(self):
        data = [user.to_dict() for user in User.query.all()]
        j_data = jsonify(data)
        return j_data
        pass

    def post(self):
        json_data = request.get_json(force=True)
        username = json_data['username']
        email = json_data['email']
        password = json_data['password']

        newUser = User(username=username, email=email)
        newUser.set_password(password)

        db.session.add(newUser)
        db.session.commit()

        data = db.session.query(User).filter(User.username == username)
        data = data.all()[0].to_dict()

        return data, 201
        pass


class UserSchema(Resource):
    def get(self, user_id):
        data = db.session.query(User).filter(User.id == user_id)
        data = data.all()[0]
        data = data.to_dict()
        return data
        """
        data = db.session.query(User).filter(User.username == username)
        data = data.all()[0]
        if data.check_password(psw):
            data = data.to_dict()
            return data
        return 'Login Error'
        """
        pass

    def put(self, user_id):
        # TODO modifica password
        pass

    def delete(self, user_id):
        # TODO quando elimini utente elimina anche tutte le maschere e annotazioni fatte
        pass


class RegistrationSchema(Resource):
    def get(self):
        pass
    
    def post(self):
        json_data = request.get_json(force=True)
        username = json_data['username']
        email = json_data['email']
        password1 = json_data['password1']
        password2 = json_data['password2']

        if password1 == password2:
            newUser = User(username=username, email=email)
            newUser.set_password(password1)

            db.session.add(newUser)
            db.session.commit()

            data = db.session.query(User).filter(User.username == username)
            data = data.all()[0].to_dict()
            return data, 201
        return 'different password', 400
        pass
