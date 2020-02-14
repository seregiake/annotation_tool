#from app import db
from app.models import Image
import json

# per creare la sezione info
"""
"info": {
    "description": "COCO 2017 Dataset",
    "url": "http://cocodataset.org",
    "version": "1.0",
    "year": 2017,
    "contributor": "COCO Consortium",
    "date_created": "2017/09/01"
}
"""

# per creare la sezione licenses

images = Image.query.all()
imagesList = []
# per creare la sezione images
for image in images:
    # print(image.id)
    # print(image.name)
    # print(image.to_dict()['url'])
    # print(image.height)
    # print(image.width)
    newImg = {
        "file_name": image.name,
        "coco_url": image.to_dict()['url'],
        "height": image.height,
        "width": image.width,
        "id": image.id
    }
    imagesList.append(newImg)
    """
    "images": [
    {
        "license": 4,
        "file_name": "000000397133.jpg",
        "coco_url": "http://images.cocodataset.org/val2017/000000397133.jpg",
        "height": 427,
        "width": 640,
        "date_captured": "2013-11-14 17:02:52",
        "flickr_url": "http://farm7.staticflickr.com/6116/6255196340_da26cf2c9e_z.jpg",
        "id": 397133
    },
    {
        "license": 1,
        "file_name": "000000037777.jpg",
        "coco_url": "http://images.cocodataset.org/val2017/000000037777.jpg",
        "height": 230,
        "width": 352,
        "date_captured": "2013-11-14 20:55:31",
        "flickr_url": "http://farm9.staticflickr.com/8429/7839199426_f6d48aa585_z.jpg",
        "id": 37777
    },
    ...
    ]
    """

data = {}
data.update({'images': imagesList})

# per creare la sezione categories
"""
"categories": [
    {"supercategory": "person","id": 1,"name": "person"},
    {"supercategory": "vehicle","id": 2,"name": "bicycle"},
    {"supercategory": "vehicle","id": 3,"name": "car"},
    {"supercategory": "vehicle","id": 4,"name": "motorcycle"},
    {"supercategory": "vehicle","id": 5,"name": "airplane"},
    ...
    {"supercategory": "indoor","id": 89,"name": "hair drier"},
    {"supercategory": "indoor","id": 90,"name": "toothbrush"}
]
"""

# per creare la sezione annotations
"""
"annotations": [
    {
        "segmentation": {
            "counts": [179,27,392,41,…,55,20],
            "size": [426,640]
        },
        "area": 220834,
        "iscrowd": 1,
        "image_id": 250282,
        "bbox": [0,34,639,388],
        "category_id": 1,
        "id": 900100250282
    },
    ...
]
"""

with open("output.json", "w") as outfile:
    json.dump(data, outfile, indent=4)


