import axios from "axios";
import * as _ from "lodash";
import * as causes from "../../data/fire-causes.json";
import { axisBottom } from "d3-axis";

export class FireDataService {

    static server = "http://localhost:5000";

    static parsePostData(post) {
        let keys = Object.keys(post);
        for (let i = 0; i < keys.length; i++) {
            post[keys[i]] = [post[keys[i]]];
        }
        return post;
    }

    static generateQueryParams(params) {
        let query = "?";
        for (let key in params) {
            query += key + "=" + params[key] + "&";
        }
        return query.slice(0, query.length - 1);
    }

    static getFiresData(params = {}) {
        return axios.get(FireDataService.server + "/fires" + this.generateQueryParams(params));
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

    static getWildfireByYears() {
        return axios.get(FireDataService.server + "/fires-by-years");
    }

    static getMostPronedCounties() {
        return axios.get(FireDataService.server + "/most-proned-counties");
    }

    static getLeastPronedCounties() {
        return axios.get(FireDataService.server + "/least-proned-counties");
    }

    static postANNCausePredictionModel(post) {
        post = this.parsePostData(post);
        return axios.post("http://localhost:5000/ann-wildfire-cause-predict", post);
    }

    static postRandomForestCausePredictionModel(post) {
        post = this.parsePostData(post);
        return axios.post("http://localhost:5000/random-forest-wildfire-cause-predict", post);
    }

    static postNaiveBayesCausePredictionModel(post) {
        post = this.parsePostData(post);
        return axios.post("http://localhost:5000/naive-bayes-wildfire-cause-predict", post);
    }

    static causeOfFirePerCode(code) {
        return causes[parseInt(code.toString())];
    }

    static getCausesList() {
        return ["Arson",
                "Campfire",
                "Children",
                "Debris Burning",
                "Equipment Use",
                "Fireworks",
                "Lightning",
                "Miscellaneous",
                "Missing/Undefined",
                "Powerline",
                "Railroad",
                "Smoking",
                "Structure"]
    }

}