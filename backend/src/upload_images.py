import json
import os
import cv2
import matplotlib.image as mpimg

CATEGORIES = json.load(open("data/categories.json"))
IMAGES = json.load(open("data/images.json"))


img_id = 0
for cat in CATEGORIES["super"]:
    folder_name = cat["name"]
    path = "static/" + folder_name
    images = os.listdir(path)
    for img in images:
        url = "http://127.0.0.1:5000/" + path + "/" + img
        newImg_path = path + "/" + img
        image = mpimg.imread(newImg_path)
        h, w, _ = image.shape
        newImg_id = img_id + 1
        newImg = {
            'id': newImg_id,
            'name': img,
            'size': json.dumps([w, h]),
            'category': cat["id"],
            'path': newImg_path,
            'url': url
        }
        with open('data/images.json', 'r+') as img_file:
            IMAGES.update({img_id: newImg})
            json.dump(IMAGES, img_file)
            print(IMAGES)
            # newIMAGES = IMAGES_file.update({img_id: newImg})
            # json.dump(newImg, IMAGES)
        img_id = img_id + 1

