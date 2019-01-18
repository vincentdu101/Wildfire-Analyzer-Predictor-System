import * as JulianDate from "julian-date";
import * as julianParse from "julian";

export class DateService {

    static julian = new JulianDate();

    static parseJulianDate(date) {
        if (!date) {
            return new Date();
        }

        let parsedDate = DateService.julian.julian(date).d.toString();
        return new Date(parsedDate);
    } 

    static convertTimeToJulian(datetime) {
        // Jan. 1, 1970 00:00:00 UTC
        let epoch = 2440587.500000;                   
        return datetime.getTime() / 86400000 + epoch;
    }

    static getWildfireYears() {
        let startYear = 2005;
        let endYear = 2015;
        let years = [];
        for (let i = 2005; i <= 2015; i++) {
            years.push(i);
        }
        return years;
    }


}