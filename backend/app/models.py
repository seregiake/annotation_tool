# Database models
from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import db


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    admin = db.Column(db.Boolean)
    password_hash = db.Column(db.String(128))
    masks = db.relationship('Mask', backref='user', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    # Password hashing and verification
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        data = {
            'id': self.id,
            'username': self.username,
            'admin': self.admin,
            'email': self.email
        }
        return data

    @classmethod
    def find_by_name(cls, name):
        users = User.query.all()
        for user in users:
            if user.username == name:
                return user

    @classmethod
    def find_by_id(cls, id):
        user = db.session.query(User).filter_by(id=id)
        if len(user.all() != 0):
            user = user[0]
            return user


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    width = db.Column(db.Integer)
    height = db.Column(db.Integer)
    folder_name = db.Column(db.String(140))
    masks = db.relationship('Mask', backref='image', lazy='dynamic')

    def __repr__(self):
        return '<Image {}>'.format(self.name)

    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
            'size': [self.width, self.height],
            'dataset': self.folder_name,
            'path': 'static/' + self.folder_name + '/' + self.name,
            'url': 'http://127.0.0.1:5000/static/' + self.folder_name + '/' + self.name
        }
        return data


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    folder_name = db.Column(db.String(140), db.ForeignKey('image.folder_name'))
    super_id = db.Column(db.Integer, db.ForeignKey('superclass.id'))

    def __repr__(self):
        return '<Task {}>'.format(self.id)

    def to_dict(self):
        data = {
            'id': self.id,
            'folder_name': self.folder_name,
            'super_id': self.super_id,
        }
        return data


class Superclass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    masks = db.relationship('Mask', backref='superclass', lazy='dynamic')
    subclasses = db.relationship('Subclass', backref='superclass', lazy='dynamic')

    def __repr__(self):
        return '<Superclass {}>'.format(self.name)

    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
        }
        return data


class Subclass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    super_id = db.Column(db.Integer, db.ForeignKey('superclass.id'))
    name = db.Column(db.String(64))
    annotations = db.relationship('Annotation', backref='subclass', lazy='dynamic')

    def __repr__(self):
        return '<Subclass {}>'.format(self.name)

    def to_dict(self):
        data = {
            'id': self.id,
            'super_id': self.super_id,
            'name': self.name
        }
        return data


class Mask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    image_id = db.Column(db.Integer, db.ForeignKey('image.id'))
    super_id = db.Column(db.Integer, db.ForeignKey('superclass.id'))
    kernel = db.Column(db.Integer)
    dist = db.Column(db.Integer)
    ratio = db.Column(db.Float)
    annotations = db.relationship('Annotation', backref='mask', lazy='dynamic')

    def __repr__(self):
        return '<Mask {}>'.format(self.id)

    def to_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'image_id': self.image_id,
            'super_id': self.super_id,
            'kernel': self.kernel,
            'dist': self.dist,
            'ratio': self.ratio
        }
        return data


class Annotation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mask_id = db.Column(db.Integer, db.ForeignKey('mask.id'))
    sub_id = db.Column(db.Integer, db.ForeignKey('subclass.id'))
    cluster = db.Column(db.Integer)
    color = db.Column(db.Integer)
    multiple = db.Column(db.Integer)
    point = db.Column(db.Integer)
    count = db.Column(db.Integer)
    size = db.Column(db.Integer)

    def __repr__(self):
        return '<Annotation {}>'.format(self.id)

    def to_dict(self):
        data = {
            'id': self.id,
            'mask_id': self.mask_id,
            'sub_id': self.sub_id,
            'cluster': self.cluster,
            'color': self.color,
            'multiple': self.multiple,
            'point': self.point,
            'count': self.count,
            'size': self.size
        }
        return data


"""
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from app import db, login


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    posts = db.relationship('Post', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    # Password hashing and verification
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Post {}>'.format(self.body)
"""
