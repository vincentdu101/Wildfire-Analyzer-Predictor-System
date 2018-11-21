import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import AnalyzerDash from "./Dashboard/AnalyzerDash";
import PredictorDash from "./Dashboard/PredictorDash";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
export default class Main extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Switch>
                <Route exact={true} path="/" component={AnalyzerDash} />
                <Route path="/predictor" component={PredictorDash} />
            </Switch>
        );
    }

}