# https://hackernoon.com/what-is-one-hot-encoding-why-and-when-do-you-have-to-use-it-e3c6186d008f
# https://medium.com/data-science-group-iitr/loss-functions-and-optimization-algorithms-demystified-bb92daff331c
# https://www.kaggle.com/rtatman/188-million-us-wildfires

# python3 -m pip install --user virtualenv
# python3 -m virtualenv env
# source env/bin/activate
# python3 -m pip install numpy tensorflow pandas keras pysqlite3 sklearn



import sqlite3
import numpy as np
import pandas as pd
import keras
import math
import tensorflowjs as tfjs
from keras.models import Sequential, model_from_yaml, load_model
from keras.layers import Dense
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix

def encodeOutputVariable(y):
    labelencoder_Y_Origin = LabelEncoder()
    y = labelencoder_Y_Origin.fit_transform(y.astype(str))
    return y

def encodeCategoricalData(X, index):
    # encode categorical data
    labelencoder_X_Origin = LabelEncoder()
    X[:, index] = labelencoder_X_Origin.fit_transform(X[:, index].astype(str))
    return X    

def manualEncodeLongStrings(X, column):
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
    
def defaultMinimumValues(values): 
    for index, x in enumerate(values):
        x = [float(y) if y != None and float(y) > 0.0 else 0 for y in x]
        values[index] = x
    return pd.DataFrame(values)

def encodeHotEncoder(X, categoryIndex):
    # meant to create dummy variables for each category data
    # you only use it for one column at a time, output will be the number of columns
    # needed to represent all discrete values of column
    onehotencoder = OneHotEncoder(categorical_features = [categoryIndex])
    X = defaultMinimumValues(X)
    X = onehotencoder.fit_transform(X.astype(str)).toarray()    
    X = X[:, 1:]
    return X

def determineTotalTime(startDay, startTime, endDay, endTime):
    minsPerDay = 24 * 60
    totalStart = (int(startDay) * minsPerDay) + int(startTime)
    totalEnd = (int(endDay) * minsPerDay) + int(endTime)
    return totalEnd - totalStart

sqlite_file = "./wildfires.sqlite"

# connecting to the database file and saving the select
conn = sqlite3.connect(sqlite_file)
dataset = pd.read_sql_query("select * from Fires limit 50000;", conn)

# split dataset into train and test lists
X = dataset.iloc[:, [34, 35, 30, 31, 23, 21, 22, 26, 27]].values
y = dataset.iloc[:, 29].values

# 34|STATE|text(255)|0||0
# 35|COUNTY|text(255)|0||0
# 30|LATITUDE|float64|0||0
# 31|LONGITUDE|float64|0||0
# 23|STAT_CAUSE_CODE|float64|0||0
# 21|DISCOVERY_DOY|int32|0||0
# 22|DISCOVERY_TIME|text(4)|0||0
# 26|CONT_DOY|int32|0||0
# 27|CONT_TIME|text(4)|0||0

# encode the categorical data
X = encodeCategoricalData(X, 0)
# X = encodeCategoricalData(X, 1)

X = encodeHotEncoder(X, 0)
# X = encodeHotEncoder(X, 13)
# X = encodeHotEncoder(X, 9)
y = encodeOutputVariable(y)

# split the dataset into the training and test set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

# feature scaling - adjust for varying values in features
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

# create ANN

# initialize the ann
classifier = Sequential()

# adding the input layer and the first hidden layer
classifier.add(Dense(50, kernel_initializer = "uniform", activation = "relu", input_dim = 48))

# adding the second hidden layer
classifier.add(Dense(25, kernel_initializer = "uniform", activation = "relu"))

# adding the third hidden layer
classifier.add(Dense(10, kernel_initializer = "uniform", activation = "relu"))

# adding the output layer 
classifier.add(Dense(1, kernel_initializer = "uniform", activation = "sigmoid"))

# compiling the ANN
classifier.compile(optimizer = "adam", loss = "mean_squared_error", metrics = ["accuracy"])

# fitting the ANN to the training set
classifier.fit(X_train, y_train, batch_size = 10, epochs = 100)

# making predictions and evaluating the model
y_pred = classifier.predict(X_test)
y_pred = (y_pred > 0.5)

cm = confusion_matrix(y_test, y_pred)

score = classifier.evaluate(X_test, y_test, verbose=0)

print("Before model save")
print(y_pred)
print(cm)
print("%s: %.2f%%" % (classifier.metrics_names[1], score[1]*100))

# save model
classifier.save("model.h5")

# load model
loaded_model = load_model("model.h5")
print("loaded model from disk")

# evaluate loaded model on test data
loaded_model.compile(loss = "mean_squared_error", optimizer = "adam", metrics=["accuracy"])
score = loaded_model.evaluate(X_test, y_test, verbose=0)

print("After model save")
print(y_pred)
print(cm)
print("%s: %.2f%%" % (loaded_model.metrics_names[1], score[1]*100))

tfjs.converters.save_keras_model(loaded_model, "./")

