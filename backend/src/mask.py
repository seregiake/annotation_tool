from flask_restful import abort, Resource, request
import json

from .segmentation import segment_image
from .boundaries import get_boundaries
from .image import abort_if_image_doesnt_exist, IMAGES


def open_masks_file():
    with open('src/data/masks.json', "r") as jsonFile:
        MASKS = json.load(jsonFile)
        return MASKS


def abort_if_mask_doesnt_exist(user_id, mask_id):
    MASKS = open_masks_file()
    mask_list = MASKS[user_id]
    mask = mask_list[mask_id]
    if len(mask) == 0:
        abort(404, message="Mask {} doesn't exist".format(mask_id))


# MasksList
# shows a list of all images in the folder images
class MasksSchema(Resource):

    def get(self, user_id):
        MASKS = open_masks_file()
        # return MASKS
        index = str(user_id)
        return MASKS[index]

    def post(self, user_id):  # user_id, image_id, cluster_id, color
        MASKS = open_masks_file()
        index = str(user_id)

        json_data = request.get_json(force=True)
        image_id = int(json_data['id'])

        index_img = str(image_id - 1)
        abort_if_image_doesnt_exist(index_img)
        mask_id = image_id

        """
        !!! DA RIGUARDARE !!!
        Aggiungere controllo: esiste gia la maschera con mask_id? 
         - Si -> aggiorno la maschera esistente (anche se invalida)
         - No -> creo una nuova maschera e faccio append al dizionario MASKS
                Attenzione! Se ad es. ho solo due elementi e devo aggiungere il 7° 
                devo prima fare l'append di tutte le maschere precedenti con 'valid': "N"
        """

        # prendi immagine
        image = IMAGES[index_img]
        ratio = float(json_data['ratio'])
        dist = int(json_data['dist'])
        kernel = int(json_data['kernel'])

        # sicuramente image['name'] sbagliato potrei passare image['path']
        # first_mask = segment_image(image['name'], ratio, kernel, dist)
        first_mask = segment_image(image['path'], ratio, kernel, dist)
        mask = json.dumps(first_mask.tolist())
        size = IMAGES[index_img]['size'].lstrip("[").rstrip("]").split(", ")

        boundaries = get_boundaries(first_mask, int(size[0]), int(size[1]))
        mask_index = str(mask_id)

        newMask = {
            'id': mask_id,
            'mask': mask,
            'boundaries': boundaries,
            'valid': "Y",
            'ratio': ratio,
            'dist': dist,
            'kernel': kernel
        }

        # TODO quando si inserisce una nuova maschera tutte le
        #  annotazioni relative devono essere eliminate

        # usa user_id come chiave del gruppo di maschere
        MASKS[index][mask_index] = newMask

        with open("src/data/masks.json",
                  "w") as jsonFile:
            json.dump(MASKS, jsonFile)

        return MASKS[index][mask_index], 201


# Mask
class MaskSchema(Resource):

    def get(self, user_id, mask_id):  # return mask for image, add user_id
        # abort_if_mask_doesnt_exist(mask_id)
        MASKS = open_masks_file()
        index = str(user_id)
        mask_index = str(mask_id)
        abort_if_mask_doesnt_exist(index, mask_index)
        # return {'mask': MASKS[mask_id - 1]}
        return MASKS[index][mask_index]
        pass
