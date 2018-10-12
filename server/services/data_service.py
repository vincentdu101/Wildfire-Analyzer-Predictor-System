import sqlite3
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from db.fire import db, Fire

class DataService:

    def __init__(self, app):
        sqlite_file = "./models/wildfires.sqlite"
        self.connection = sqlite3.connect(sqlite_file)
        self.wildfires = self.load_all_wildfires()
        db.init_app(app)

    def load_all_wildfires(self):
        return pd.read_sql_query("select * from Fires limit 50000;", self.connection)

    def get_all_wildfires(self):
        return Fire.query.paginate(1, 20, False).items

    def get_wildfires_independent(self):
        return self.wildfires.iloc[:, [34, 35, 30, 31, 23, 21, 22, 26, 27]]

    def get_wildfires_dependent(self):
        return self.wildfires.iloc[:, 29]

    def get_distinct_states(): 
        return pd.read_sql_query("select distinct state from Fires limit 50000;", self.connection)