import numpy as np
import cv2
import matplotlib
import matplotlib.pyplot as plt
import os
import json

# Root directory of the project
ROOT_DIR = os.path.abspath("../backend")  # in questo modo ROOT_DIR = /home/student5/Desktop/Mask_RCNN
print(ROOT_DIR)
image_dir = "{}/foto_facce".format(os.path.join(ROOT_DIR, "app/static/Dataset4"))
obj = {
    "segmentation": {
        "counts": "[175750,1,790,1,8,1,5,2,694,2,87,4,5,1,2,5,694,2,88,3,1,1,2,11,692,3,33,2,53,17,3,1,689,3,31,4,53,25,682,5,31,3,51,30,676,2,2,6,25,1,3,3,50,34,673,12,6,1,16,2,2,3,53,31,675,12,5,1,16,6,52,33,676,11,2,2,1,1,18,4,2,1,50,33,7,1,666,18,3,2,13,7,50,36,4,1,667,21,13,8,1,1,48,36,4,1,3,3,660,23,9,11,1,1,8,1,39,41,2,3,1,2,658,23,10,24,8,2,27,44,1,3,660,22,1,1,7,26,1,4,1,3,10,8,6,1,1,44,1,2,662,24,5,40,2,12,5,52,659,84,3,54,658,86,5,51,658,87,5,51,657,88,3,51,656,143,657,142,660,139,659,142,657,143,661,135,667,139,11,5,645,141,9,5,645,147,3,7,643,164,636,171,630,172,628,173,627,177,3,1,619,181,619,181,619,183,617,186,2,1,612,185,2,2,612,188,612,188,612,190,611,190,610,190,611,189,611,189,612,188,613,190,611,189,611,189,612,187,614,186,613,188,612,188,613,187,614,186,614,186,614,186,614,186,615,186,614,186,614,186,614,186,614,186,614,186,614,186,614,186,614,187,613,187,1,1,611,187,1,1,611,189,611,190,610,190,610,190,610,190,610,190,610,189,611,189,611,189,611,189,611,190,610,190,610,191,609,191,609,191,609,191,609,190,611,189,611,189,611,189,611,189,611,189,7,1,603,191,3,3,603,191,3,4,602,193,1,4,602,198,602,198,602,200,600,200,600,200,600,200,600,200,600,200,1,2,597,203,597,205,595,205,596,204,596,204,596,204,596,204,596,205,595,205,595,205,596,204,596,204,596,203,597,203,597,203,597,202,599,200,599,201,599,201,599,201,599,201,601,1,1,197,601,1,1,197,603,196,605,195,605,195,606,194,606,194,606,194,607,31,1,159,610,30,2,158,610,31,1,158,610,32,1,157,611,31,2,156,612,31,1,156,612,32,1,156,612,31,1,156,613,30,2,155,615,29,2,154,615,30,1,154,615,31,1,153,617,182,618,182,621,178,622,178,622,177,622,178,626,173,627,172,629,171,629,171,629,169,637,161,640,160,640,160,640,160,640,1,2,157,643,155,645,153,647,153,647,152,656,142,658,142,660,140,661,139,661,133,1,3,666,130,1,1,669,129,1,1,669,128,672,127,673,126,674,1,1,124,678,122,678,17,7,96,682,12,11,95,682,12,11,93,685,11,21,83,716,83,717,83,717,83,717,62,1,20,709,70,1,20,709,70,2,16,1,2,709,70,5,11,714,70,5,5,1,5,714,69,8,2,5,1,715,68,16,1,715,68,732,68,732,68,732,68,732,68,732,67,737,60,740,60,739,61,742,58,742,57,745,54,747,52,748,52,748,50,750,49,751,49,751,49,751,1,1,47,753,47,753,46,754,11,3,31,750,47,753,45,755,43,756,44,756,43,756,44,757,43,757,40,761,37,763,33,2,2,763,33,767,31,769,28,772,31,769,26,774,26,784,15,785,15,785,14,65826]",
        "size": "[393621,32779]"
    },
    "height": 533,
    "width": 800,
}

print(obj["segmentation"])
counts = obj["segmentation"]["counts"]
counts = counts.replace(']','').replace('[','').split(",")

tot = 0
for i in counts:
    tot = tot + int(i)

print(tot)


"""
tot = 0
for i in count:
    tot = tot + int(i)

print(size[0] + size[1])
print(tot)
"""
