import axios from "axios";

export class FireDataService {

    static getFiresData() {
        return axios.get("http://localhost:5000/fires");
    }

}