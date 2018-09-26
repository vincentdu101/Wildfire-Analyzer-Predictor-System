from keras.models import load_model

class ModelService:

    def __init__(self):
        print("settin up model service")

    def load_wildfire_size(self):
        self.wildfire_size = load_model("./models/model.h5")
        self.wildfire_size.load_weights("./models/model_weights.h5")
        self.wildfire_size.compile(optimizer="adam", loss="mean_squared_error", metrics=["accuracy"])
        return self.wildfire_size