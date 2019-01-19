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
import Loader from "react-loader-spinner";

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
        this.outputCountySelect = this.outputCountySelect.bind(this);
        this.outputCountyValues = this.outputCountyValues.bind(this);
        this.determineCountyCode = this.determineCountyCode.bind(this);
        this.updateCountyStateInfo = this.updateCountyStateInfo.bind(this);
        this.outputPredictionSection = this.outputPredictionSection.bind(this);
        this.imgWidth = "400";
        this.imgHeight = "300";

        this.state = {
            data: null,
            maps: null,
            prediction: null,
            slider: {
                step: 10,
                max: 700000,
                min: 0.1,
            },
            loader: false,
            stateData: StateDataService.statesAndCounties,
            model: "ANN",
            post: {
                STATE: "CA",
                FIPS_CODE: "063",
                COUNTY: "Plumas",
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

    componentWillMount() {
        StateDataService.injectStateCountyInfo().then((data) => {
            this.setState({stateData: data});
        });
    }

    componentDidMount() {
        MapService.getMapData().then((mapData) => {
            this.setState({maps: mapData});
        });
    }

    componentDidUpdate() {
    }

    determineCountyCode(code) {
        return code.toString().slice(2, code.length - 1);
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

    updateCountyStateInfo(value) {
        let param = this.state.post;
        let stateAndCounty = this.state.stateData[param.STATE][value];
        param.LATITUDE = stateAndCounty.lat
        param.COUNTY = value;
        param.LONGITUDE = stateAndCounty.lng;
        this.setState({post: param});
    }

    outputCountyValues() {
        if (this.state.post.STATE && Object.keys(this.state.stateData).length > 0) {
            let counties = Object.keys(this.state.stateData[this.state.post.STATE]).sort();
            return counties.map((row, index) => {
                return (
                    <option value={row} key={row + index}>{row}</option>
                );
            });
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
        let stateAndCounty = this.state.stateData[post.STATE][post.COUNTY];
        post.CONT_DATE = DateService.convertTimeToJulian(this.state.post.CONT_DATE);
        post.DISCOVERY_DATE = DateService.convertTimeToJulian(this.state.post.DISCOVERY_DATE);
        post.CONT_TIME = this.state.post.CONT_TIME.replace(":", "");
        post.DISCOVERY_TIME = this.state.post.DISCOVERY_TIME.replace(":", "");
        post.FIRE_YEAR = this.state.post.CONT_DATE.getFullYear();
        post.FIRE_SIZE = this.determineFireSize(this.state.post.FIRE_SIZE_CLASS);
        post.FIPS_CODE = this.determineCountyCode(stateAndCounty.fips_code);
        delete post.DISCOVERY_DOY;
        delete post.CONT_DOY;
        delete post.COUNTY
        this.setState({ loader: true });
        this.determinePredictionModel(this.state.model, post).then(res => {
            this.setState({prediction: FireDataService.causeOfFirePerCode(res.data.prediction), loader: false});
        });
    }

    inputFieldChanged(key, value) {
        let param = this.state.post;
        param[key] = value;
        this.setState({post: param});
    }

    isPredictionMade() {
        return !!this.state.prediction ? true : false;
    }

    outputStateSelect() {
        return (
            <Input  type="select" 
                    name="state" 
                    id="state-select" 
                    onChange={(event) => this.inputFieldChanged("STATE", event.target.value)}
                    value={this.state.post.STATE}>
                {StateDataService.outputStateValues()}
            </Input>
        );
    }

    outputCountySelect() {
        return (
            <Input  type="select" 
                    name="county" 
                    id="county-select" 
                    onChange={(event) => this.updateCountyStateInfo(event.target.value)}
                    value={this.state.post.COUNTY}>
                {this.outputCountyValues()}
            </Input>
        );
    }

    outputPrediction() {
        if (this.state.loader) {
            return (
                <Loader type="ThreeDots" color="#00BFFF" height="500" width="500" />
            )
        } else if (this.isPredictionMade()) {
            return (
                <div className="card-body container">
                    <div className="row">
                        <div className="col-xs-12 col-xs-4 align-items-left">
                            <img    width={this.imgWidth}
                                    height={this.imgHeight}
                                    src={window.location.origin + this.state.prediction.image} 
                                    className="img-fluid" />
                        </div>
    
                        <div className="col-xs-12 col-xs-8 prediction-intro card">
                            <h5>{this.state.prediction.name}</h5>
    
                            <div className="prediction-description">
                                {this.state.prediction.description}
                            </div>
                        </div>
                    </div>
    
                    <div className="row">
                        <div className="col-xs-12 prediction-details">
                            {this.state.prediction.details}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<input type="hidden" />);
        }
    }

    outputPredictionSection() {
        return (
            <div className="row col-xs-12 card">
                <div className="card-title">
                    <h3>Prediction Results</h3>
                </div>

                {this.outputPrediction()}

            </div>
        );
    }

    render() {
        return (
            <div className="no-gutters">

                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">Fire Cause Prediction Dashboard</h1>
                        <p className="lead">Select the various options to predict the likely cause of a fire. Other details/statistics will also be provided.</p>
                    </div>
                </div>

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
                                {this.outputStateSelect(this.state.stateData)}
                            </FormGroup>

                            <FormGroup row>
                                <Label for="state-select">Counties</Label>
                                {this.outputCountySelect()}
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
                            <Map maps={this.state.maps} focusedPoint={[this.state.post.LATITUDE, this.state.post.LONGITUDE]} />
                        </section>
                    </div>
                </div>

                <div className="row col-xs-12 card align-items-center button-section">
                    <Button onClick={this.submitForm}>Submit</Button>
                </div>

                {this.outputPredictionSection()}

            </div>

        );
    }
    
}