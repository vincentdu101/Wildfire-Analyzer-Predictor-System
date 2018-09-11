import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from "./components/Map/Map";

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
                <Map width={width} height={height} />
            </div>
        );
    }
}
