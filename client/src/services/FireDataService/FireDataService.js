import axios from "axios";

export class FireDataService {

    static server = "http://localhost:5000";

    static getFiresData() {
        return axios.get(FireDataService.server + "/fires");
    }

    static getStatesCountData() {
        return axios.get(FireDataService.server + "/states");
    }

    static getCausesCountData() {
        return axios.get(FireDataService.server + "/cause");
    }

    static getWildfireByYear() {
        return axios.get(FireDataService.server + "/wildfire-by-year");
    }

}