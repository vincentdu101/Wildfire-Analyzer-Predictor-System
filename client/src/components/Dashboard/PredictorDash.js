import React, { Component } from 'react';
import Map from "../Map/Map";
import "./PredictorDash.css";
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import "react-datepicker/dist/react-datepicker.css";
import { MapService } from "../../services/MapService/MapService"; 
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { DateService } from "../../services/DateService/DateService";
import "react-input-range/lib/css/index.css";
import * as _ from "lodash";
import { FireDataService } from "../../services/FireDataService/FireDataService";
import { StateDataService } from "../../services/StateDataService/StateDataService";

// range slider
// https://github.com/davidchin/react-input-range

export default class PredictorDash extends Component {

    constructor() {
        super();

        this.inputFieldChanged = this.inputFieldChanged.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.determineFireSize = this.determineFireSize.bind(this);
        this.isPredictionMade = this.isPredictionMade.bind(this);
        this.determinePredictionModel = this.determinePredictionModel.bind(this);

        this.state = {
            data: null,
            maps: null,
            prediction: null,
            slider: {
                step: 10,
                max: 700000,
                min: 0.1,
            },
            stateData: null,
            model: "ANN",
            post: {
                STATE: "CA",
                COUNTY: "63",
                FIRE_SIZE_CLASS: "A",
                FIRE_SIZE: 0.1,
                FIRE_YEAR: 2005,
                LATITUDE: 40.03694444,
                LONGITUDE: -121.00583333,
                DISCOVERY_DATE: new Date(),
                DISCOVERY_TIME: "00:00",
                CONT_DATE: new Date(),
                CONT_TIME: "00:00"
            }
        };
    }

    componentDidMount() {
        this.setState({stateData: StateDataService.statesAndCounties});

        MapService.getMapData().then((mapData) => {
            this.setState({maps: mapData});
        });
    }

    componentDidUpdate() {

    }

    determineFireSize(classSize) {
        switch (classSize) {
            case "A": {
                return 0.25;
            } case "B": {
                return 0.9;
            } case "C": {
                return 99.9;
            } case "D": {
                return 299.8;
            } case "E": {
                return 999.0;
            } case "F": {
                return 4994.0;
            } case "G": {
                return 700000;
            } default: {
                return 0.1;
            }
        }
    }

    determinePredictionModel(model, post) {
        if (model === "ANN") {
            return FireDataService.postANNCausePredictionModel(post);
        } else if (model === "Random Forest") {
            return FireDataService.postRandomForestCausePredictionModel(post);
        } else if (model === "Naive Bayes") {
            return FireDataService.postNaiveBayesCausePredictionModel(post)
        }
    }

    submitForm() {
        let post = _.clone(this.state.post);
        post.CONT_DATE = DateService.convertTimeToJulian(this.state.post.CONT_DATE);
        post.DISCOVERY_DATE = DateService.convertTimeToJulian(this.state.post.DISCOVERY_DATE);
        post.CONT_TIME = this.state.post.CONT_TIME.replace(":", "");
        post.DISCOVERY_TIME = this.state.post.DISCOVERY_TIME.replace(":", "");
        post.FIRE_YEAR = this.state.post.CONT_DATE.getFullYear();
        post.FIRE_SIZE = this.determineFireSize(this.state.post.FIRE_SIZE_CLASS);
        delete post.DISCOVERY_DOY;
        delete post.CONT_DOY;
        this.determinePredictionModel(this.state.model, post).then(res => {
            this.setState({prediction: res.data.prediction});
        });
    }

    inputFieldChanged(key, value) {
        let param = this.state.post;
        param[key] = value;
        this.setState({post: param});
    }

    isPredictionMade() {
        return (!!this.state.prediction).toString();
    }

    render() {
        return (
            <div className="no-gutters">

                <div className="row">
                    <div className="col-xs-12 col-sm-4 card">
                        <Form className="predictor-form">
                            <FormGroup row>
                                <Label for="state-select">Prediction Model</Label>
                                <Input  type="select" 
                                        name="model" 
                                        id="model-select" 
                                        onChange={(event) => this.setState({model: event.target.value})}
                                        value={this.state.model}>
                                    <option value={"ANN"}>Artificial Neural Network</option>
                                    <option value={"Random Forest"}>Random Forest</option>
                                    <option value={"Naive Bayes"}>Naive Bayes</option>
                                </Input>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="state-select">State</Label>
                                <Input  type="select" 
                                        name="state" 
                                        id="state-select" 
                                        onChange={(event) => this.inputFieldChanged("STATE", event.target.value)}
                                        value={this.state.post.STATE}>
                                    <option value={"CA"}>CA</option>
                                    <option value={"WA"}>WA</option>
                                </Input>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="cause-select">Fire Size</Label>
                                <Input  type="select" 
                                        name="fire-size-class" 
                                        id="fire-size-class-select" 
                                        onChange={(event) => this.inputFieldChanged("FIRE_SIZE_CLASS", event.target.value)}
                                        value={this.state.post.FIRE_SIZE_CLASS}>
                                    <option value={"A"}>A</option>
                                    <option value={"B"}>B</option>
                                    <option value={"C"}>C</option>
                                    <option value={"D"}>D</option>
                                    <option value={"E"}>E</option>
                                    <option value={"F"}>F</option>
                                    <option value={"G"}>G</option>
                                </Input>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="discovery-date">Discovery Date</Label>
                                <DatePicker className="form-control"
                                            name="discovery-date"
                                            selected={this.state.post.DISCOVERY_DOY} 
                                            onChange={(date) => this.inputFieldChanged("DISCOVERY_DOY", date)} />
                            </FormGroup>

                            <FormGroup row>
                                <Label for="exampleSelect">Discovery Time</Label>
                                <TimePicker name="discovered-time"
                                            value={this.state.post.DISCOVERY_TIME} 
                                            onChange={(time) => this.inputFieldChanged("DISCOVERY_TIME", time)} />
                            </FormGroup>

                            <FormGroup row>
                                <Label for="contained-date">Contained Date</Label>
                                <DatePicker className="form-control"
                                            name="contained-date"
                                            selected={this.state.post.CONT_DOY} 
                                            onChange={(date) => this.inputFieldChanged("CONT_DOY", date)} />
                            </FormGroup>

                            <FormGroup row>
                                <Label for="exampleSelect">Contained Time</Label>
                                <TimePicker name="contained-time"
                                            value={this.state.post.CONT_TIME} 
                                            onChange={(time) => this.inputFieldChanged("CONT_TIME", time)} />
                            </FormGroup>
                        </Form>
                    </div>

                    <div className="col-xs-12 col-sm-8 card">
                        <section className="predictor-dash">
                            <Map maps={this.state.maps} />
                        </section>
                    </div>
                </div>

                <div className="row col-xs-12 card" if={this.isPredictionMade()}>

                    {this.state.prediction}

                </div>

                <div className="row col-xs-12 card align-items-center button-section">
                    <Button onClick={this.submitForm}>Submit</Button>
                </div>

            </div>

        );
    }
    
}