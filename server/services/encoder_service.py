import pandas as pd 
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from services.data_service import DataService

class EncoderService:

    def __init__(self, app):
        self.data_service = DataService(app)
        self.scaler = pickle.load(open("./models/scaler.sav", "rb"))

    def encode_wildfire_size_categories(self, params):
        # params = pd.DataFrame(data=params)
        X = self.data_service.get_wildfires_size_independent()
        df2 = pd.DataFrame(data=params, columns=self.data_service.size_params)
        X.loc[0] = df2.loc[0]
        X = X.values
        # X = self.encodeCategoricalData(X, 0)
        # X = self.encodeHotEncoder(X, 0)
        return X

    def encode_wildfire_cause_categories(self, params):
        X = self.data_service.get_wildfires_cause_independent()
        df2 = pd.DataFrame(data=params, columns=self.data_service.cause_params)
        X.loc[0] = df2.loc[0]
        X = X.values
        # X = self.encodeCategoricalData(X, 0)
        # X = self.encodeCategoricalData(X, 4)
        # X = self.encodeHotEncoder(X, 0)
        # X = self.encodeHotEncoder(X, 4)
        return X              

    def get_wildfires_size_test_data(self):
        X = self.data_service.get_wildfires_size_independent().values
        y = self.data_service.get_wildfires_size_dependent().values
        # X = self.encodeCategoricalData(X, 0)
        # X = self.encodeHotEncoder(X, 0)
        # y = self.encodeOutputVariable(y)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
        return X_test, y_test

    def get_wildfires_cause_test_data(self):
        X = self.data_service.get_wildfires_cause_independent().values
        y = self.data_service.get_wildfires_cause_dependent().values
        # X = self.encodeCategoricalData(X, 0)
        # X = self.encodeCategoricalData(X, 4)
        # X = self.encodeHotEncoder(X, 0)
        # X = self.encodeHotEncoder(X, 4)
        # y = self.encodeOutputVariable(y)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
        return X_test, y_test        

    def encodeOutputVariable(self, y):
        self.labelencoder_Y_Origin = LabelEncoder()
        y = self.labelencoder_Y_Origin.fit_transform(y.astype(str))
        return y

    def decodeOutputVariable(self, y):
        return self.labelencoder_Y_Origin.inverse_transform(y)

    def encodeCategoricalData(self, X, index):
        # encode categorical data
        labelencoder_X_Origin = LabelEncoder()
        X[:, index] = labelencoder_X_Origin.fit_transform(X[:, index].astype(str))
        return X    

    def manualEncodeLongStrings(self, X, column):
        index = 0
        test = 0
        keys = {}
        for row in X:
            key = row[column].replace(", ", "").replace(" ", "")
            if (keys.get(key) == None):
                keys[key] = index
                index += 1
            X[test][column] = keys.get(key)
            test += 1
        return X

    def standardScaleTransform(self, params):
        return self.scaler.transform(params)

    def standardScaleTestValues(self, X_train, X_test):
        sc = StandardScaler()
        sc.fit(X_train)
        return sc.transform(X_test)
