from keras.models import load_model

class ModelService:

    def __init__(self):
        self.wildfire_size = load_model("./models/model.h5")

    def load_wildfire_size(self):
        return self.wildfire_size