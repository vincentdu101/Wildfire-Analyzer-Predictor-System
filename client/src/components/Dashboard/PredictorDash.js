import React, { Component } from 'react';
import Map from "../Map/Map";
import "./PredictorDash.css";
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';
import "react-datepicker/dist/react-datepicker.css";
import { MapService } from "../../services/MapService/MapService"; 
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

// another possibility for date time range
// http://projects.wojtekmaj.pl/react-datetimerange-picker/

export default class PredictorDash extends Component {

    constructor() {
        super();

        this.inputFieldChanged = this.inputFieldChanged.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.dateChanged = this.dateChanged.bind(this);

        this.state = {
            data: null,
            maps: null,
            post: {
                STATE: "CA",
                STAT_CAUSE_CODE: "",
                LONGITUDE: 1,
                DISCOVERY_DOY: new Date(),
                DISCOVERY_TIME: "00:00",
                CONT_DOY: new Date(),
                CONT_TIME: "00:00"
            }
        };
    }

    componentDidMount() {
        MapService.getMapData().then((mapData) => {
            this.setState({maps: mapData});
        });
    }

    componentDidUpdate() {

    }

    submitForm() {
        console.log(this.state);
    }

    inputFieldChanged(key, value) {
        let param = this.state.post;
        param[key] = value;
        this.setState({post: param});
    }

    dateChanged(key, value) {
        console.log(value);
    }
 
    render() {
        return (
            <div className="no-gutters">

                <div className="row">
                    <div className="col-xs-12 col-sm-4 card">
                        <Form className="predictor-form">
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
                                <Label for="cause-select">Cause of Fire</Label>
                                <Input  type="select" 
                                        name="cause" 
                                        id="cause-select"
                                        onChange={(event) => this.inputFieldChanged("STAT_CAUSE_CODE", event.target.value)}
                                        value={this.state.post.STAT_CAUSE_CODE}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
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

                <div className="row col-xs-12 card align-items-center button-section">
                    <Button onClick={this.submitForm}>Submit</Button>
                </div>

            </div>

        );
    }
    
}