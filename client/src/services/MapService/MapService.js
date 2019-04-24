import axios from "axios";
import * as usStates from "../../data/us-states-features.json";
import Config from "../Config/config";

export class MapService {

    static getMapData() {
        return new Promise((resolve) => {return resolve(usStates)});
    }

    static getFiresData() {
        return axios.get(Config.serverUrl() + "/fires");
    }

}