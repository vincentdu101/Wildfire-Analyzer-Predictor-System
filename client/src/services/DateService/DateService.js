import * as JulianDate from "julian-date";

export class DateService {

    static julian = new JulianDate();

    static parseJulianDate(date) {
        if (!date) {
            return new Date();
        }

        let parsedDate = DateService.julian.julian(date).d.toString();
        return new Date(parsedDate);
    } 


}