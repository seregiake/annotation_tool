from skimage.segmentation import quickshift
import matplotlib.image as mpimg
from skimage.util import img_as_float
import os
import json


def segment_image(image_name, ratio=0.5, kernel_size=2, max_dist=10):
    path = 'src/' + image_name
    image = mpimg.imread(path)
    # image = mpimg.imread(os.path.join('src/static/img', image_name))
    img = img_as_float(image)

    # !!! Source image colorspace should be RGB to allow RGB2LAB conversion
    segmented_mask = quickshift(img, ratio, kernel_size, max_dist)

    # array_data_type = segmented_mask.dtype.name
    # array_shape = segmented_mask.shape
    # as_bytes = segmented_mask.tobytes()

    # serialized = json.dumps(segmented_mask.tolist())

    # serialized = pickle.dumps(segmented_mask, protocol=0).decode('latin-1')

    return segmented_mask
    # return segmented_mask
