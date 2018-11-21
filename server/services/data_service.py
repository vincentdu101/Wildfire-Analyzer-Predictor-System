import sqlite3
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sqlalchemy import desc, func
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

    def get_states_with_fire(self):
        return Fire.query.with_entities(func.count(Fire.STATE), Fire.STATE).group_by(Fire.STATE).all()

    def get_cause_of_fire(self):
        return Fire.query.with_entities(func.count(Fire.STAT_CAUSE_DESCR), Fire.STAT_CAUSE_DESCR).group_by(Fire.STAT_CAUSE_DESCR).all()

    def get_fires_by_years(self):
        return Fire.query.with_entities(Fire.FIRE_YEAR, func.count(Fire.FIRE_YEAR)).group_by(Fire.FIRE_YEAR).all()

    def get_most_proned_counties(self):
        return Fire.query.with_entities(Fire.COUNTY, Fire.STATE, func.count(Fire.COUNTY)).group_by(Fire.COUNTY).order_by(func.count(Fire.COUNTY).desc()).limit(10).all()

    def get_least_proned_counties(self):
        return Fire.query.with_entities(Fire.COUNTY, Fire.STATE, func.count(Fire.COUNTY)).group_by(Fire.COUNTY).order_by(func.count(Fire.COUNTY).asc()).limit(10).all()

    def filter_by_year(self, year):
        return Fire.query.filter(Fire.FIRE_YEAR == year).order_by(desc(Fire.FIRE_YEAR))

    def get_wildfires_independent(self):
        return self.wildfires.iloc[:, [34, 30, 31, 23, 21, 22, 26, 27]]

    def get_wildfires_dependent(self):
        return self.wildfires.iloc[:, 29]

    def get_distinct_states(): 
        return pd.read_sql_query("select distinct state from Fires limit 50000;", self.connection)