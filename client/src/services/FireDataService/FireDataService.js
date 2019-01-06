import axios from "axios";
import * as _ from "lodash";

export class FireDataService {

    static server = "http://localhost:5000";

    static parsePostData(post) {
        let keys = Object.keys(post);
        for (let i = 0; i < keys.length; i++) {
            post[keys[i]] = [post[keys[i]]];
        }
        return post;
    }

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

}