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
        self.define_model_params()
        self.wildfires = self.load_all_wildfires()
        self.wildfires_cause = self.load_all_wildfires_cause_data()
        self.wildfires_nn_cause = self.load_sample_wildfires_cause_data()
        self.counties = self.get_distinct_counties()
        db.init_app(app)

    def define_model_params(self):
        self.size_params = ["STATE", "LATITUDE", "LONGITUDE", "STAT_CAUSE_CODE", 
        "DISCOVERY_DOY", "DISCOVERY_TIME", "CONT_DOY", "CONT_TIME"]

        self.cause_params = ["STATE", "COUNTY", "LATITUDE", "LONGITUDE", "FIRE_SIZE_CLASS", 
        "FIRE_SIZE", "FIRE_YEAR", "DISCOVERY_DATE", "DISCOVERY_TIME", "CONT_DATE", "CONT_TIME"]

        self.cause_nn_params = ["STATE", "FIPS_CODE", "FIRE_SIZE_CLASS", 
        "FIRE_SIZE", "FIRE_YEAR", "LATITUDE", "LONGITUDE", "DISCOVERY_DATE", "DISCOVERY_TIME", "CONT_DATE", "CONT_TIME"]

        self.cause_nn_one_hot_columns = ['AK',
        'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID',
        'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS',
        'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR',
        'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI',
        'WV', 'WY', 'A', 'B', 'C', 'D', 'E', 'F', 'G']


    def defaultMinimumValues(self, values): 
        output = []
        for index, x in enumerate(values):
            try:
                x = float(x) if x is not None and float(x) > 0.0 else 0
                output.append(x)
            except:
                output.append(0)
        return output

    def preprocessData(self, data):
        data.FIPS_CODE = self.defaultMinimumValues(data.FIPS_CODE)
        data.CONT_TIME = self.defaultMinimumValues(data.CONT_TIME)
        data.CONT_DATE = self.defaultMinimumValues(data.CONT_DATE)
        data.DISCOVERY_TIME = self.defaultMinimumValues(data.DISCOVERY_TIME)
        data.LATITUDE = self.defaultMinimumValues(data.LATITUDE)
        data.LONGITUDE = self.defaultMinimumValues(data.LONGITUDE)
        return data

    def load_all_wildfires(self):
        data = pd.read_sql_query("select * from Fires limit 50000;", self.connection)
        return self.preprocessData(data)

    def load_all_wildfires_cause_data(self):
        data = pd.read_sql_query("select * from Fires limit 50000;", self.connection)        
        return self.preprocessData(data)

    def load_sample_wildfires_cause_data(self):
        data = pd.read_sql_query("select * from Fires order by Random() limit 2500;", self.connection)
        return self.preprocessData(data)

    def get_all_wildfires(self, args):
        query = Fire.query
        limit = 20 if args.get("limit") is None else int(args.get("limit"))

        if (args.get("year") is not None):
            query = query.filter(Fire.FIRE_YEAR == int(args.get("year")))

        if (args.get("state") is not None):
            query = query.filter(Fire.STATE == args.get("state"))

        if (args.get("cause") is not None):
            query = query.filter(Fire.STAT_CAUSE_DESCR == args.get("cause"))   

        if (args.get("size") is not None):
            query = query.filter(Fire.FIRE_SIZE_CLASS == args.get("size"))   

        return query.paginate(1, limit, False).items

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

    def get_wildfires_size_independent(self):
        return self.wildfires[self.size_params]

    def get_wildfires_size_dependent(self):
        return self.wildfires["FIRE_SIZE_CLASS"]

    def get_wildfires_cause_independent(self):
        return self.wildfires_cause[self.cause_params]

    def get_wildfires_cause_nn_independent(self):
        return self.wildfires_nn_cause[self.cause_nn_params]        

    def get_wildfires_cause_dependent(self):
        return self.wildfires_cause["STAT_CAUSE_CODE"]

    def get_distinct_states(self): 
        return pd.read_sql_query("select distinct state from Fires limit 50000;", self.connection)
    
    def get_distinct_counties(self):
        return pd.read_sql_query("select distinct county from Fires;", self.connection)

    def get_counties(self):
        return self.counties

    def get_general_cols(self):
        return self.cause_nn_one_hot_columns

    def add_missing_one_hot_columns(self, missing_cols, dataset):
        for index, column in enumerate(missing_cols):
            if column not in dataset:
                dataset[column] = 0
        return dataset
