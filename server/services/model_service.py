from keras.models import load_model
import pickle

class ModelService:

    def __init__(self):
        print("settin up model service")

    def load_wildfire_size(self):
        self.wildfire_size = load_model("./models/model.h5")
        self.wildfire_size.load_weights("./models/model_weights.h5")
        self.wildfire_size.compile(optimizer="adam", loss="mean_squared_error", metrics=["accuracy"])
        return self.wildfire_size

    def load_ann_wildfire_cause(self):
        self.ann_wildfire_cause = load_model("./models/ann_cause_model.h5")
        self.ann_wildfire_cause.load_weights("./models/ann_cause_model_weights.h5")
        self.ann_wildfire_cause.compile(optimizer="adam", loss="mean_squared_error", metrics=["accuracy"])
        return self.ann_wildfire_cause        

    def load_random_forest_wildfire_cause(self):
        self.random_forest_cause = pickle.load(open("./models/random_forest_cause_model.h5", "rb"))
        print("Random Forest Model loaded successfully.")
        return self.random_forest_cause

    def load_naive_bayes_wildfire_cause(self):
        self.naive_bayes_cause = pickle.load(open("./models/naive_bayes_cause_model.h5", "rb"))
        print("Naive Bayes Model loaded successfully.")
        return self.naive_bayes_cause        
