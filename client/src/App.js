import React, { Component } from 'react';
import {BrowserRouter as Router, Link} from "react-router-dom";
import './App.css';
import Main from "./components/Main";
import {StateDataService} from "./services/StateDataService/StateDataService"; 

export default class App extends Component {

    constructor() {
        StateDataService.injectStateCountyInfo();
        super();
    }

    render() {
        return (
            <Router>
                <div className="App no-gutters">
                    <nav className="navbar navbar-expand-lg">
                        <a className="navbar-brand">Wildfire Analytic Dashboard</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link to="/">Analytic Dashboard</Link>
                                </li>
                                <li className="nav-item active">
                                    <Link to="/predictor/">Prediction Dashboard</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <Main />
                </div>
            </Router>
        );
    }
}
