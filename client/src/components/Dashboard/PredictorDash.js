import React from "react";
import * as tf from "@tensorflow/tfjs";
import Map from "../Map/Map";
import { MapService } from "../../services/MapService/MapService";

export default class PredictorDash extends React.Component {

    constructor() {
        super();

        this.state = {
            data: null,
            maps: null
        };
    }

    componentDidMount() {
        let modelPromise = async function() {
            const model = await tf.loadModel("http://localhost:5000/wildfire-size-model");
            console.log(model);
        }

        MapService.getMapData().then((mapData) => {
            this.setState({maps: mapData.data});
        });

        modelPromise();
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <section className="predictor-dash">
                <Map maps={this.state.maps} />
            </section>
        );
    }
    
}