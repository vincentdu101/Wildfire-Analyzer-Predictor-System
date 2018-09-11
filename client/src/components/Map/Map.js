import React, { Component } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import "./Map.css";

export default class Map extends Component {

    constructor(props) {
        super(props);
        this.createUSMap = this.createUSMap.bind(this);
    }

    componentDidMount() {
        this.createUSMap();
    }

    componentDidUpdate() {
        this.createUSMap();
    }

    createUSMap() {
        const node = this.node;
        const path = d3.geoPath();
        // const svg = d3.select(node);
        // const usStatesMap = "../../data/us-states-map.json";

        d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
            if (error) throw error;

            d3.select(node).append("g")
                .attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter()
                .append("path")
                .attr("d", path);

            d3.select(node).append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states), function(a, b) {
                    return a !== b;
                }));
        });
    }

    render() {
        return (
            <svg    ref={node => this.node = node} 
                    width={this.props.width}
                    height={this.props.height}>
            </svg>
        );
    }

}