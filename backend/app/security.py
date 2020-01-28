from werkzeug.security import safe_str_cmp
from app.models import User


def authenticate(username, password):
    users = User.query.all()
    for user in users:
        if user.username == username and user.check_password(password):
            return user
    return None


def identity(payload):
    user_id = payload['identity']
    users = User.query.all()
    for user in users:
        if user.id == user_id:
            return user