import React from "react";
import * as tf from "@tensorflow/tfjs";
import Map from "../Map/Map";

export default class PredictorDash extends React.Component {

    constructor() {
        super();

        this.state = {
            data: null
        };
    }

    componentDidMount() {
        let modelPromise = async function() {
            const model = await tf.loadModel("http://localhost:5000/wildfire-size-model");
            console.log(model);
        }

        modelPromise();
    }

    componentDidUpdate() {

    }

    render() {
        let width="500px";
        let height="300px";

        return (
            <Map />
        );
    }
    
}