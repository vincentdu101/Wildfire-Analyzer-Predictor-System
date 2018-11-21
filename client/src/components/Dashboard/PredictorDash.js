import React, { Component } from 'react';
import * as tf from "@tensorflow/tfjs";
import Map from "../Map/Map";
import { MapService } from "../../services/MapService/MapService";

export default class PredictorDash extends Component {

    constructor() {
        super();

        this.state = {
            data: null,
            maps: null
        };
    }

    componentDidMount() {
        MapService.getMapData().then((mapData) => {
            this.setState({maps: mapData});
        });
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