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
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <AnalyzerDash />
            </div>
        );
    }
}
