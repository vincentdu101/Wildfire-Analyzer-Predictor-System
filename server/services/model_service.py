from keras.models import load_model

class ModelService:

    def __init__(self):
        self.wildfire_size = load_model("/models/model.h5")

    def load_wildfire_size():
        print("loaded model from disk")

        # evaluate loaded model on test data
        self.wildfire_size.compile(loss = "mean_squared_error", optimizer = "adam", metrics=["accuracy"])
        score = self.wildfire_size.evaluate(X_test, y_test, verbose=0)

        print("After model save")
        print(y_pred)
        print(cm)
        print("%s: %.2f%%" % (self.wildfire_size.metrics_names[1], score[1]*100))