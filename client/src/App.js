import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import PredictorDash from "./components/Dashboard/PredictorDash";
import AnalyzerDash from "./components/Dashboard/AnalyzerDash";

export default class App extends Component {
    render() {
        let width="500px";
        let height="300px";
        return (
            <div className="App no-gutters">
                <nav className="navbar navbar-expand-lg">
                    <a className="navbar-brand">Wildfire Analytic Dashboard</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                Analytic Dashboard
                            </li>
                            <li className="nav-item active">
                                Prediction Dashboard
                            </li>
                        </ul>
                    </div>
                </nav>

                <AnalyzerDash />
            </div>
        );
    }
}
