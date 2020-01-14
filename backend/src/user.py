from ..app import db


# User Class/Model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))

    def __init__(self, username, password):
        self.username = username
        self.password = password

