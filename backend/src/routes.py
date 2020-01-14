from ..app import api
from .image import ImageSchema, ImagesSchema
from .mask import MaskSchema


api.add_resource(ImagesSchema, '/images')
api.add_resource(ImageSchema, '/images/<int:image_id>')
api.add_resource(MaskSchema, '/images/<int:image_id>/mask')


