import numpy as np
from skimage.segmentation import find_boundaries, mark_boundaries
import json


def get_boundaries(segments_quick, width, height):
    blank_image = np.zeros((height, width, 3), np.uint8)
    blank_image[:, 0:width // 2] = (255, 255, 255)  # (B, G, R)
    blank_image[:, width // 2:width] = (255, 255, 255)

    marked_bound = mark_boundaries(blank_image, segments_quick, color=(0, 0, 0)).astype(int);

    # marked_bound = find_boundaries(segments_quick, connectivity=1, mode="thick", background=0).astype(np.uint8)

    array_data_type = marked_bound.dtype.name
    array_shape = marked_bound.shape
    as_bytes = marked_bound.tobytes()

    serialized = json.dumps(marked_bound.tolist())

    return serialized
