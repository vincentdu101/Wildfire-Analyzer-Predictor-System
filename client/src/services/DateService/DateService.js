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

    static convertTimeToJuian(time) {
        debugger;
    }


}