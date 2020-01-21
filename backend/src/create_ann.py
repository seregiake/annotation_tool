import json
import os
import cv2
import matplotlib.image as mpimg

USERS = json.load(open("data/users.json"))
ANNOTATATIONS = json.load(open("data/annotations.json"))

for user in USERS:
    print(user)
    i = 0
    print(ANNOTATATIONS)
    mask_list = {}
    with open('data/annotations.json', 'r+') as ann_file:
        ANNOTATATIONS.update({user: {}})
        json.dump(ANNOTATATIONS, ann_file)

