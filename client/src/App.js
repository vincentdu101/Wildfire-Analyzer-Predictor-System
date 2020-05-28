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
                <div className="App no-gutters container-fluid">
                    <div class="row">
                        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block sidebar collapse"
                            style={{color: "white"}}>
                                <div class="sidebar-sticky pt-3">
                                    
                                    <ul class="nav flex-column">
                                        <li class="nav-item">
                                            <Link style={{color: "white"}} to="/">Analytic Dashboard</Link>
                                        </li>
                                        <li class="nav-item">
                                        <Link style={{color: "white"}} to="/predictor/">Prediction Dashboard</Link>
                                        </li>
                                    </ul>

                                </div>
                        </nav>
                        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                            <Main />
                        </main>
                    </div>

                    <div className="bg-danger footer">
                        
                        <div className="row">
                            <div className="col-xs-12 col-lg-8 card">

                                <div className="footer-profile">

                                    <div class="row footer-profile-row">

                                        <div class="col-md-12 col-lg-4">
                                            <img    class="footer-profile-image"
                                                    src="https://media.licdn.com/dms/image/C5603AQF_MXglOGJ2cA/profile-displayphoto-shrink_200_200/0?e=1569456000&v=beta&t=YgOhFXXgt4xNYSo9cnOHAYBURAwJX6a-Y1CHqnalJ_o" />
                                        </div>

                                        <div class="col-md-12 col-lg-8">
                                            <h2>Vincent Du</h2>
                                            <h5>Senior Software Engineer</h5>
                                            <div className="footer-autobio">
                                                Passionate engineer with full stack experience and looking to apply 
                                                skills to develop new AI, machine learning, and full stack systems.
                                                Passionate engineer with full stack experience and looking to apply 
                                                skills to develop new AI, machine learning, and full stack systems.
                                                Passionate engineer with full stack experience and looking to apply 
                                                skills to develop new AI, machine learning, and full stack systems.                                                                                
                                            </div>
                                        </div>

                                    </div>

                                    <div class="footer-btn-group" role="group" aria-label="Basic example">
                                        <button type="button" class="btn btn-primary">LinkedIn</button>
                                        <button type="button" class="btn btn-secondary">GitHub</button>
                                        <button type="button" class="btn btn-success">Website</button>
                                    </div>

                                </div>
                            </div>

                            <div className="bg-danger footer-links-section col-xs-12 col-lg-4">

                                <h6 class="footer-tech-title">Technologies/Frameworks/Tools Used</h6>
                                <ListGroup>
                                    <ListGroupItem>Python</ListGroupItem>
                                    <ListGroupItem>Javascript</ListGroupItem>
                                    <ListGroupItem>Flask</ListGroupItem>
                                    <ListGroupItem>React</ListGroupItem>
                                    <ListGroupItem>Keras</ListGroupItem>
                                    <ListGroupItem>Scikit-Learn</ListGroupItem>
                                    <ListGroupItem>Tensorflow</ListGroupItem>
                                </ListGroup>
                            </div>                            
                        </div>

                    </div>
                </div>
            </Router>
        );
    }
}
