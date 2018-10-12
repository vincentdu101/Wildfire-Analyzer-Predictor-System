from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Fire(db.Model):
    __tablename__ = "Fires"

    FOD_ID = db.Column(db.Integer, primary_key = True)
    FPA_ID = db.Column(db.String(100))
    SOURCE_SYSTEM_TYPE = db.Column(db.String(255))
    SOURCE_SYSTEM = db.Column(db.String(30))
    NWCG_REPORTING_AGENCY = db.Column(db.String(255))
    NWCG_REPORTING_UNIT_ID = db.Column(db.String(255))
    NWCG_REPORTING_UNIT_NAME = db.Column(db.String(255))
    SOURCE_REPORTING_UNIT = db.Column(db.String(30))
    SOURCE_REPORTING_UNIT_NAME = db.Column(db.String(255))
    LOCAL_FIRE_REPORT_ID = db.Column(db.String(255))
    LOCAL_INCIDENT_ID = db.Column(db.String(255))
    FIRE_CODE = db.Column(db.String(10))
    FIRE_NAME = db.Column(db.String(255))
    ICS_209_INCIDENT_NUMBER = db.Column(db.String(255))
    ICS_209_NAME = db.Column(db.String(255))
    MTBS_ID = db.Column(db.String(255))
    MTBS_FIRE_NAME = db.Column(db.String(50))
    COMPLEX_NAME = db.Column(db.String(255))
    FIRE_YEAR = db.Column(db.Integer)
    DISCOVERY_DATE = db.Column(db.Float)
    DISCOVERY_DOY = db.Column(db.Integer)
    DISCOVERY_TIME = db.Column(db.String(4))
    STAT_CAUSE_CODE = db.Column(db.Float)
    STAT_CAUSE_DESCR = db.Column(db.String(100))
    CONT_DATE = db.Column(db.Float)
    CONT_DOY = db.Column(db.Integer)
    CONT_TIME = db.Column(db.String(4))
    FIRE_SIZE = db.Column(db.Float)
    FIRE_SIZE_CLASS = db.Column(db.String(1))
    LATITUDE = db.Column(db.Float)
    LONGITUDE = db.Column(db.Float)
    OWNER_CODE = db.Column(db.Float)
    OWNER_DESCR = db.Column(db.String(100))
    STATE = db.Column(db.String(255))
    COUNTY = db.Column(db.String(255))
    FIPS_CODE = db.Column(db.String(255))
    FIPS_NAME = db.Column(db.String(255))

    def to_dict(self):
        return dict(FOD_ID = self.FOD_ID,
                    FPA_ID = self.FPA_ID,
                    SOURCE_SYSTEM_TYPE = self.SOURCE_SYSTEM_TYPE,
                    SOURCE_SYSTEM = self.SOURCE_SYSTEM,
                    NWCG_REPORTING_AGENCY = self.NWCG_REPORTING_AGENCY,
                    NWCG_REPORTING_UNIT_ID = self.NWCG_REPORTING_UNIT_ID,
                    NWCG_REPORTING_UNIT_NAME = self.NWCG_REPORTING_UNIT_NAME,
                    SOURCE_REPORTING_UNIT = self.SOURCE_REPORTING_UNIT,
                    SOURCE_REPORTING_UNIT_NAME = self.SOURCE_REPORTING_UNIT_NAME,
                    LOCAL_FIRE_REPORT_ID = self.LOCAL_FIRE_REPORT_ID,
                    LOCAL_INCIDENT_ID = self.LOCAL_INCIDENT_ID,
                    FIRE_CODE = self.FIRE_CODE,
                    FIRE_NAME = self.FIRE_NAME,
                    ICS_209_INCIDENT_NUMBER = self.ICS_209_INCIDENT_NUMBER,
                    ICS_209_NAME = self.ICS_209_NAME,
                    MTBS_ID = self.MTBS_ID,
                    MTBS_FIRE_NAME = self.MTBS_FIRE_NAME,
                    COMPLEX_NAME = self.COMPLEX_NAME,
                    FIRE_YEAR = self.FIRE_YEAR,
                    DISCOVERY_DATE = self.DISCOVERY_DATE,
                    DISCOVERY_DOY = self.DISCOVERY_DOY,
                    DISCOVERY_TIME = self.DISCOVERY_TIME,
                    STAT_CAUSE_CODE = self.STAT_CAUSE_CODE,
                    STAT_CAUSE_DESCR = self.STAT_CAUSE_DESCR,
                    CONT_DATE = self.CONT_DATE,
                    CONT_DOY = self.CONT_DOY,
                    CONT_TIME = self.CONT_TIME,
                    FIRE_SIZE = self.FIRE_SIZE,
                    FIRE_SIZE_CLASS = self.FIRE_SIZE_CLASS,
                    LATITUDE = self.LATITUDE,
                    LONGITUDE = self.LONGITUDE,
                    OWNER_CODE = self.OWNER_CODE,
                    OWNER_DESCR = self.OWNER_DESCR,
                    STATE = self.STATE,
                    COUNTY = self.COUNTY,
                    FIPS_CODE = self.FIPS_CODE,
                    FIPS_NAME = self.FIPS_NAME)


