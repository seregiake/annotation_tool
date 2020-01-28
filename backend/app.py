from app import app, db
from app.models import User, Image, Annotation, Mask, Superclass, Subclass


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Image': Image,
            'Annotation': Annotation, 'Mask': Mask,
            'Superclass': Superclass, 'Subclass': Subclass}


"""
from app import create_app, db

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
"""
