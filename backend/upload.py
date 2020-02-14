import os
import cv2
import matplotlib.image as mpimg
from app import db
from app.models import Image, Superclass, Subclass


def uploadImages():
    main_folder = os.listdir('app/static')
    for folder in main_folder:
        #if folder == 'Dataset4':
        if folder != '.DS_Store':
            images = os.listdir('app/static/' + folder)
            for image in images:
                if image != '.DS_Store':
                    img = mpimg.imread('app/static/' + folder + '/' + image)
                    h, w, _ = img.shape
                    i = Image(name=image, width=w, height=h, folder_name=folder)
                    db.session.add(i)
    db.session.commit()

