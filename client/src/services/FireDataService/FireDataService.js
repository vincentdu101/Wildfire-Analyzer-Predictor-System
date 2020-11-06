import axios from "axios";
import * as _ from "lodash";
import * as causes from "../../data/fire-causes.json";
import Config from "../Config/config";

export class FireDataService {

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

    static firesSizeCategories() {
        return [
            {value: "A", label: "A"},
            {value: "B", label: "B"},
            {value: "C", label: "C"},
            {value: "D", label: "D"},
            {value: "E", label: "E"},
            {value: "F", label: "F"},
            {value: "G", label: "G"},
        ]
    }

    static getFiresData(params = {}) {
        return axios.get(Config.serverUrl() + "/fires" + this.generateQueryParams(params));
    }

    static getStatesCountData() {
        return axios.get(Config.serverUrl() + "/states");
    }

    static getCausesCountData() {
        return axios.get(Config.serverUrl() + "/cause");
    }

    static getWildfireByYear() {
        return axios.get(Config.serverUrl() + "/wildfire-by-year");
    }

    static getWildfireByYears() {
        return axios.get(Config.serverUrl() + "/fires-by-years");
    }

    static getMostPronedCounties() {
        return axios.get(Config.serverUrl() + "/most-proned-counties");
    }

    static getLeastPronedCounties() {
        return axios.get(Config.serverUrl() + "/least-proned-counties");
    }

    static postANNCausePredictionModel(post) {
        post = this.parsePostData(post);
        return axios.post(Config.serverUrl() + "/ann-wildfire-cause-predict", post);
    }

    static postRandomForestCausePredictionModel(post) {
        post = this.parsePostData(post);
        return axios.post(Config.serverUrl() + "/random-forest-wildfire-cause-predict", post);
    }

    static postNaiveBayesCausePredictionModel(post) {
        post = this.parsePostData(post);
        return axios.post(Config.serverUrl() + "/naive-bayes-wildfire-cause-predict", post);
    }

    static postNeuralNetworkTensorflowKerasCause(post) {
        post = this.parsePostData(post);
        return axios.post(Config.serverUrl() + "/neural-network-tensorflow-keras-cause", post);
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