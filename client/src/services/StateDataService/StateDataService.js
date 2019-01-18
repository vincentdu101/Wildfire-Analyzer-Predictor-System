import React, { Component } from "react";
import * as d3 from "d3";

export class StateDataService {

    static statesAndCounties = {};
    static stateCountyFile = "https://s3-us-west-2.amazonaws.com/wildfire-analyzer-system/county-gps-data.csv";

    static injectStateCountyInfo() {
        return new Promise((resolve) => {
            d3.csv(this.stateCountyFile).then((data) => {
                for (let x = 0; x < data.length; x++) {
                    let entry = data[x];
                    let stateId = entry.state_id;
                    let county = entry.county_name;
    
                    if (!this.statesAndCounties[stateId] && !!stateId) {
                        this.statesAndCounties[stateId] = {};
                    }
    
                    if (!this.statesAndCounties[stateId][county] && !!county) {
                        this.statesAndCounties[stateId][county] = {
                            lat: entry.lat, lng: entry.lng, fips_code: entry.county_fips
                        };
                    }
                }
                return resolve(this.statesAndCounties);
            });
        });
    }

    static outputStateValues(data) {
        let states = Object.keys(data).sort();
        return states.map((row, index) => {
            if (Object.keys(data[row]).length > 0) {
                return (
                    <option value={row} key={row + index}>{row}</option>
                );
            }
        });
    }

}