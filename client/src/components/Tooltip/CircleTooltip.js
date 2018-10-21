import * as React from "react";
import "./CircleTooltip.css";

export default class CircleTooltip extends React.Component {

    leftBuffer = 40;
    topBuffer = 100;

    constructor(props) {
        super(props);

        this.determinePosition = this.determinePosition.bind(this);
        this.outputTooltipClass = this.outputTooltipClass.bind(this);

        this.state = {
            text: "tewds",
            x: 0,
            y: 0,
            active: false
        };
    } 

    componentDidMount() {
        this.setState({});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            x: nextProps.x, 
            y: nextProps.y, 
            text: nextProps.text,
            active: nextProps.active
        });
    }

    outputTooltipClass() {
        return this.state.active ? "circle-tooltip active" : "circle-tooltip";
    }

    determinePosition() {
        return {
            left: (this.state.x + this.leftBuffer) + "px",
            top: (this.state.y - this.topBuffer) + "px"
        }
    }

    render() {
        return (
            <div className={this.outputTooltipClass()} style={this.determinePosition()}>
                {this.state.text}
            </div>
        );
    }

}