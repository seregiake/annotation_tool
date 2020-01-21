import json
import os
import cv2
import matplotlib.image as mpimg

USERS = json.load(open("data/users.json"))
IMAGES = json.load(open("data/images.json"))
MASKS = json.load(open("data/masks.json"))

for user in USERS:
    print(user)
    i = 0
    print(MASKS)
    mask_list = {}
    for img in IMAGES:
        newMask_id = i + 1
        newMask = {
            'id': newMask_id,
            'mask': 0,
            'boundaries': 0,
            'valid': "N",
            'ratio': 0.5,
            'kernel': 2,
            'dist': 10
        }
        mask_list.update({newMask_id: newMask})
        i = i + 1
    with open('data/masks.json', 'r+') as masks_file:
        MASKS.update({user: mask_list})
        json.dump(MASKS, masks_file)
