import sqlite3
import numpy as np
import pandas as pd
from jdcal import gcal2jd, jd2gcal, jcal2jd, MJD_0
import keras
import math
import datetime
import tensorflowjs as tfjs
import pickle
import julian as julian
import datetime
import calendar
import sklearn.metrics as metrics
from keras.models import Sequential, model_from_yaml, load_model
from keras.layers import Dense, LSTM, Dropout, Embedding, Masking
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestClassifier
# from sklearn.compose import ColumnTransformer, make_column_transformer
from imblearn.over_sampling import SMOTE

def convertJulianDateToDays(y, jd):
    month = 1
    day = 0
    while jd - calendar.monthrange(y,month)[1] > 0 and month <= 12:
        jd = jd - calendar.monthrange(y,month)[1]
        month = month + 1
    return datetime.datetime(y, month, jd)

def convertJulianTimeToCategory(param):
    if (param[0] == None):
        return "n_a";
        
    row = int(param[0])
    if row >= 0 and row < 400:
        return 'early_morning'
    elif row >= 400 and  row < 800:
        return 'mid_morning'
    elif row >= 800 and  row < 1200:
        return 'late_morning'
    elif row >=1200 and  row <1600:
        return 'afternoon'
    elif row >=1600 and  row <2000:
        return 'evening'
    elif row >=2000 and  row <2400:
        return 'night'
    else:
        return 'n_a'

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

def convertDateColumns(X, column):
    X = X[:, column].apply(lambda row: julian.from_jd(row, fmt='mmddyyyy'))
    print(X[:, column])
    return X.values

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

def saveModelThroughPickle(model, filename):
    pickle.dump(model, open(filename, "wb"))

def outputPredictorResults(y_test, y_pred, title):
    # output results for model predictions
    print("For", title, "Classification")
    print(metrics.accuracy_score(y_test, y_pred) * 100)
    print(metrics.confusion_matrix(y_test, y_pred))
    print(pd.crosstab(y_test.ravel(), y_pred.ravel(), rownames=["True"], colnames=["Predicted"], margins=True))
    print(metrics.classification_report(y_test, y_pred))
    print(metrics.zero_one_loss(y_test, y_pred))

def createArtificialNeuralNetwork(X_train, y_train, X_test, y_test):
    # create ANN
    print("\nArtificial Neural Network Classifier Section")
    print("---------------------------------")

    # initialize the ann
    classifier = Sequential()

    # adding the input layer and the first hidden layer
    classifier.add(Dense(100, kernel_initializer = "uniform", activation = "relu", input_dim = 41))
    
    classifier.add(Dense(90, kernel_initializer = "uniform", activation="relu"))
    
    classifier.add(Dense(75, kernel_initializer = "uniform", activation="relu"))
    
    # adding the second hidden layer
    classifier.add(Dense(50, kernel_initializer = "uniform", activation = "relu"))

    # adding the third hidden layer
    classifier.add(Dense(25, kernel_initializer = "uniform", activation = "relu"))

    classifier.add(Dense(20, kernel_initializer = "uniform", activation="relu"))
    
    # adding the fourth hidden layer
    classifier.add(Dense(10, kernel_initializer = "uniform", activation = "relu"))
    
    classifier.add(Dense(5, kernel_initializer = "uniform", activation="relu"))

    # adding the output layer 
    classifier.add(Dense(1, kernel_initializer = "uniform", activation = "sigmoid"))

    # compiling the ANN
    classifier.compile(optimizer = "adam", loss = "mean_squared_error", metrics = ["accuracy"])

    # fitting the ANN to the training set
    classifier.fit(X_train, y_train, batch_size = 100, epochs = 200) 
    
    y_pred = classifier.predict(X_test)
    y_pred = (y_pred > 0.5)
    
    # output results
    outputPredictorResults(y_test, y_pred, "Artificial Neural Network")
    
    classifier.save("ann_cause_model.h5")
    classifier.save("ann_cause_model_weights.h5")
    
def creatingRandomForestPredictor(X_train, y_train, X_test, y_test):
    print("\nRandom Forest Classifier Section")
    print("---------------------------------")
    
    # initialize the Random Forest Classifier
    random_forest_classifier = RandomForestClassifier(**{'n_jobs': -1,
        'n_estimators': 1500,
        'warm_start': True, 
        'max_features': 0.5,
        'max_depth': 15,
        'min_samples_leaf': 2,
        'max_features' : 'sqrt',
        'random_state' : 0,
        'verbose': 0
                                                      })
    # run through oversampler simplifier
    oversampler = SMOTE(random_state=0)
    smote_X_train, smote_y_train = oversampler.fit_sample(X_train, y_train)
    
    # fitting Random Forest to the training set
    random_forest_classifier.fit(smote_X_train, smote_y_train)
    
    # Predicting the Test set results
    rf_y_pred = random_forest_classifier.predict(X_test)
    
    # use the threshold of error to determine whether a prediction is valid
    rf_y_pred = (rf_y_pred > 0.5)
    
    # making the confusion matrix
    cm = metrics.confusion_matrix(y_test.ravel(), rf_y_pred.ravel())
    
    print("Training set Score: ", random_forest_classifier.score(X_train, y_train))
    print("Testing set Score: ", random_forest_classifier.score(X_test, y_test)) 
    
    outputPredictorResults(y_test, rf_y_pred, "Random Forest")
    saveModelThroughPickle(random_forest_classifier, "random_forest_cause_model.h5")
    
def createNaiveBayesModel(X_train, y_train, X_test, y_test):
    classifier = GaussianNB()
    
    classifier.fit(X_train, y_train)
    
    y_pred = classifier.predict(X_test)
    
    y_pred = (y_pred > 0.5)
    
    print("Training set Score: ", classifier.score(X_train, y_train))
    print("Testing set Score: ", classifier.score(X_test, y_test))
    
    outputPredictorResults(y_test, y_pred, "Naive Bayes")
    saveModelThroughPickle(classifier, "naive_bayes_cause_model.h5")

sqlite_file = "./wildfires.sqlite"

# connecting to the database file and saving the select
conn = sqlite3.connect(sqlite_file)
dataset = pd.read_sql_query("select * from Fires limit 5000;", conn)