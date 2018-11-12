import * as React from "react";
import * as d3 from "d3";
import "./BarChart.css";
import { format } from "d3-format";

// inspiration
// https://beta.observablehq.com/@mbostock/d3-horizontal-bar-chart

export default class BarChart extends React.Component {

    width = 960;
    margin = {top: 30, right: 0, bottom: 10, left: 30};

    constructor(props) {
        super(props);

        this.determineHeight = this.determineHeight.bind(this);
        this.getXScaleLinear = this.getXScaleLinear.bind(this);
        this.getYScaleLinear = this.getYScaleLinear.bind(this);

        this.state = {
            data: []
        };
    }

    componentWillMount() {
        this.setState({data: [{year: 1990, count: 1000}]});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({ data: nextProps.data });
        }
    }

    determineHeight() {
        if (!this.data) {
            return 0;
        }
        return (this.data.length * 25) + this.margin.top + this.margin.bottom;
    }

    getXScaleLinear() {
        return d3.scaleLinear()
                .domain([0, d3.max(this.data, d => d.count)])
                .range([this.margin.left, this.width - this.margin.right]);
    }

    getYScaleLinear() {
        return d3.scaleBand()
                .domain(this.data.map(d => d.year))
                .range([this.margin.top, this.determineHeight() - this.margin.bottom])
                .padding(0.1);
    }

    render() {
        const svg = d3.select(".bar-chart");

        this.data = this.state.data;
        this.x = this.getXScaleLinear();
        this.y = this.getYScaleLinear();

        this.xAxis = (g) => g
            .attr("transform", `translate(0, ${this.margin.top})`)
            .call(d3.axisTop(this.x).ticks(this.width / 80))
            .call(g => g.select(".domain").remove());

        this.yAxis = (g) => g
            .attr("transform", `translate(${this.margin.left}, 0)`)
            .call(d3.axisLeft(this.y).tickSizeOuter(0));

        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
                .data(this.state.data)
            .enter().append("rect")
                .attr("x", this.x(0))
                .attr("y", d => this.y(d.year))
                .attr("width", d => this.x(d.count) - this.x(0))
                .attr("height", this.y.bandwidth());
        
        svg.append("g")
            .attr("fill", "white")
            .attr("text-anchor", "end")
            .style("font", "12px sans-serif")
            .selectAll("text")
                .data(this.state.data)
            .enter().append("text")
                .attr("x", d => this.x(d.count) - 4)
                .attr("y", d => this.y(d.year) + this.y.bandwidth() / 2)
                .attr("dy", "0.35em")
                .text(d => format(d.count));    
        
        svg.append("g").call(this.xAxis);
        svg.append("g").call(this.yAxis);

        return (
            <svg    className="bar-chart"
                    width={this.width}
                    height={this.determineHeight(this.state.data)}>

            </svg>
        )
    }
 
}