import axios from "axios";

export class MapService {

    static getMapData() {
        return axios.get("https://d3js.org/us-10m.v1.json");
    }

}