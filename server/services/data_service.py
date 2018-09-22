import sqlite3
import pandas as pd

class DataService:

    def __init__(self):
        sqlite_file = "./models/wildfires.sqlite"
        self.connection = sqlite3.connect(sqlite_file)
        self.wildfires = self.load_all_wildfires()

    def load_all_wildfires(self):
        return pd.read_sql_query("select * from Fires limit 50000;", self.connection)

    def get_all_wildfires(self):
        return self.wildfires

    def get_wildfires_independent(self):
        return self.wildfires.iloc[:, [34, 35, 30, 31, 23, 21, 22, 26, 27]]

    def get_wildfires_dependent(self):
        return self.wildfires.iloc[:, 29].values