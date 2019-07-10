from sklearn.externals import joblib
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
        # load the pipeline model first
        self.ann_wildfire_cause = joblib.load("./models/ann_pipeline.pkl")

        # load the keras model
        ann_keras_model = load_model("./models/ann_cause_model.h5")

        # save it into the pipeline estimator model
        self.ann_wildfire_cause.steps.append(("estimator", ann_keras_model))
        return self.ann_wildfire_cause        

    def load_random_forest_wildfire_cause(self):
        # self.random_forest_cause = pickle.load(open("./models/random_forest_cause_model.h5", "rb"))
        self.random_forest_cause = joblib.load("./models/random_forest_pipeline.pkl")
        print("Random Forest Model loaded successfully.")
        return self.random_forest_cause

    def load_naive_bayes_wildfire_cause(self):
        # self.naive_bayes_cause = pickle.load(open("./models/naive_bayes_cause_model.h5", "rb"))
        self.naive_bayes_cause = joblib.load("./models/naive_bayes_pipeline.pkl")
        print("Naive Bayes Model loaded successfully.")
        return self.naive_bayes_cause        
