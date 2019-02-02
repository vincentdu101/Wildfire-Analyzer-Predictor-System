import React, { Component } from 'react';
import {BrowserRouter as Router, Link} from "react-router-dom";
import './App.css';
import Main from "./components/Main";
import {StateDataService} from "./services/StateDataService/StateDataService"; 
import { ListGroup, ListGroupItem } from "reactstrap";

export default class App extends Component {

    constructor() {
        StateDataService.injectStateCountyInfo();
        super();
    }

    render() {
        return (
            <Router>
                <div className="App no-gutters">
                    <nav className="bg-danger navbar navbar-expand-lg"
                        style={{color: "white"}}>
                        <a className="navbar-brand">Wildfire Analytic Dashboard</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item nav-link active">
                                    <Link style={{color: "white"}} to="/">Analytic Dashboard</Link>
                                </li>
                                <li className="nav-item nav-link active">
                                    <Link style={{color: "white"}} to="/predictor/">Prediction Dashboard</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <Main />

                    <div className="bg-danger footer">
                        
                        <div className="row">
                            <div className="col-xs-12 col-lg-4">

                                <div className="footer-profile">

                                    <h2>Vincent Du</h2>
                                    <h5>Senior Software Engineer</h5>

                                    <div className="footer-autobio">
                                        Passionate engineer with full stack experience and looking to apply 
                                        skills to develop new AI, machine learning, and full stack systems.
                                    </div>

                                </div>
                            </div>

                            <div className="bg-danger col-xs-12 col-lg-4">
                                <h4>Technologies/Frameworks/Tools Used</h4>

                                <ListGroup>
                                    <ListGroupItem>Python</ListGroupItem>
                                    <ListGroupItem>Javascript</ListGroupItem>
                                    <ListGroupItem>Flask</ListGroupItem>
                                    <ListGroupItem>React</ListGroupItem>
                                    <ListGroupItem>Keras</ListGroupItem>
                                    <ListGroupItem>SkiLearn</ListGroupItem>
                                    <ListGroupItem>Tensorflow</ListGroupItem>
                                </ListGroup>
                            </div>

                            <div className="bg-danger footer-links-section col-xs-12 col-lg-4">

                                <h4>Portfolio and Profile</h4>

                                <ListGroup>
                                    <ListGroupItem>LinkedIn</ListGroupItem>
                                    <ListGroupItem>Github</ListGroupItem>
                                    <ListGroupItem>Website</ListGroupItem>
                                </ListGroup>

                            </div>                            
                        </div>

                    </div>
                </div>
            </Router>
        );
    }
}
