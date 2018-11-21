import React, { Component } from 'react';
import Map from "../Map/Map";
import "./PredictorDash.css";
import { MapService } from "../../services/MapService/MapService";
import DatePicker from "react-bootstrap-date-picker/src/index"; 
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export default class PredictorDash extends Component {

    constructor() {
        super();

        this.state = {
            data: null,
            maps: null
        };
    }

    componentDidMount() {
        this.setState({discoveryDate: new Date().toISOString()});

        MapService.getMapData().then((mapData) => {
            this.setState({maps: mapData});
        });
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div className="no-gutters">

                <div className="row">
                    <div className="col-xs-12 col-sm-4 card">
                        <Form className="predictor-form">
                            <FormGroup row>
                                <Label for="exampleSelect">State</Label>
                                <Input type="select" name="select" id="exampleSelect">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="exampleSelect">Cause of Fire</Label>
                                <Input type="select" name="select" id="exampleSelect">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="exampleSelect">Discovery Date</Label>
                                <DatePicker id="example-datepicker" />
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
                    <Button>Submit</Button>
                </div>

            </div>

        );
    }
    
}