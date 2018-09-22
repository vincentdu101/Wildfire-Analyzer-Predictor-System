import pandas as pd 
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from services.data_service import DataService

class EncoderService:

    def __init__(self):
        self.data_service = DataService()
        self.scaler = pickle.load(open("./models/scaler.sav", "rb"))

    def encode_wildfire_size_categories(self, params):
        params = pd.DataFrame(data=params)
        X = self.data_service.get_wildfires_independent()
        X = X.append(params)
        X = X.values
        X = self.encodeCategoricalData(X, 0)
        X = self.encodeHotEncoder(X, 0)
        return X.pop()

    def encodeOutputVariable(self, y):
        labelencoder_Y_Origin = LabelEncoder()
        y = labelencoder_Y_Origin.fit_transform(y.astype(str))
        return y

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
        
    def defaultMinimumValues(self, values): 
        for index, x in enumerate(values):
            x = [float(y) if y != None and float(y) > 0.0 else 0 for y in x]
            values[index] = x
        return pd.DataFrame(values)

    def encodeHotEncoder(self, X, categoryIndex):
        # meant to create dummy variables for each category data
        # you only use it for one column at a time, output will be the number of columns
        # needed to represent all discrete values of column
        onehotencoder = OneHotEncoder(categorical_features = [categoryIndex])
        X = self.defaultMinimumValues(X)
        X = onehotencoder.fit_transform(X.astype(str)).toarray()    
        X = X[:, 1:]
        return X

    def standardScaleTransform(self, params):
        return self.scaler.transform(params)

    def standardScaleTestValues(self, X_train, X_test):
        sc = StandardScaler()
        sc.fit(X_train)
        return sc.transform(X_test)
