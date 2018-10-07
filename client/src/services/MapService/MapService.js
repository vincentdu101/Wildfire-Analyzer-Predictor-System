import axios from "axios";
import * as usStates from "../../data/us-states-features.json";

export class MapService {

    static getMapData() {
        return new Promise((resolve) => {return resolve(usStates)});
    }

}