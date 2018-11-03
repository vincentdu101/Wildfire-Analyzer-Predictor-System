// inspiration:
// https://beta.observablehq.com/@mbostock/d3-pie-chart

import * as React from "react";
import * as d3 from "d3";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./ScatterPlot.css";
import * as JulianDate from "julian-date";

export default class ScatterPlot extends React.Component {
    
    julian = new JulianDate();
    width = 960;
    height = 600;
    margin = {
        top: 20, right: 30, bottom: 30, left: 40
    };

    data = [
        {name: "Mazda RX4", x: 2453403.5, y: 110},
        {name: "Mazda RX4", x: 2453137.5, y: 180}
    ];
    x = d3.scaleLinear()
        .domain(d3.extent(this.data, d => d.x)).nice()
        .range([this.margin.left, this.width - this.margin.right]);

    y = d3.scaleLinear()
        .domain(d3.extent(this.data, d => d.y)).nice()
        .range([this.height - this.margin.bottom, this.margin.top]);

    convertDate(x) {
        new JulianDate().julian(this.data.x);
    }

    xAxis = (g) => g
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(d3.axisBottom(this.x))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", this.width - this.margin.right)
            .attr("y", -4)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(this.data.x));

    yAxis = (g) => g
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(d3.axisLeft(this.y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(this.data.y));

    constructor(props) {
        super(props);
        window["julian"] = new JulianDate();
        window["julian"].julian(2453403.5).d;
        this.state = {
            points: [],
            tooltipActive: false,
            tooltipText: ""
        };
    }

    componentDidMount() {
        this.setState({ args: [], tooltipActive: false, tooltipText: "" });
    }
    

    componentWillReceiveProps(nextProps) {
        if (nextProps.points) {
            this.setState({ points: nextProps.points });
        }
    }

    onInteractionHandler(arc) {
        let text = "Cause of Fire:      \n" + arc.name + " \n\n";
        text +=    "Number of Fires:    \n" + arc.value + " \n";
        this.setState({ tooltipActive: true, tooltipText: text });
    }

    tooltipVisible() {
        return this.state.tooltipActive ? "active" : "";
    }

    dodge(text, iterations = 300) {
        const nodes = text.nodes();
        const left = text => text.attr("text-anchor", "start").attr("dy", "0.32em");
        const right = text => text.attr("text-anchor", "end").attr("dy", "0.32em");
        const top = text => text.attr("text-anchor", "middle").attr("dy", "0.0em");
        const bottom = text => text.attr("text-anchor", "middle").attr("dy", "0.8em");
        const points = nodes.map(node => ({fx: +node.getAttribute("x"), fy: +node.getAttribute("y")}));
        const labels = points.map(({fx, fy}) => ({x: fx, y: fy}));
        const links = points.map((source, i) => ({source, target: labels[i]}));
      
        const simulation = d3.forceSimulation(points.concat(labels))
            .force("charge", d3.forceManyBody().distanceMax(80))
            .force("link", d3.forceLink(links).distance(4).iterations(4))
            .stop();
      
        for (let i = 0; i < iterations; ++i) simulation.tick();
      
        text
            .attr("x", (_, i) => labels[i].x)
            .attr("y", (_, i) => labels[i].y)
            .each(function(_, i) {
              const a = Math.atan2(labels[i].y - points[i].fy, labels[i].x - points[i].fx);
              d3.select(this).call(
                  a > Math.PI / 4 && a <= Math.PI * 3 / 4 ? bottom
                  : a > -Math.PI / 4 && a <= Math.PI / 4 ? left
                  : a > -Math.PI * 3 / 4 && a <= Math.PI * 3 / 4 ? top
                  : right);
            });
      }

    render() {
        const svg = d3.select(".scatter-plot");
  
        svg.append("g")
            .call(this.xAxis);
        
        svg.append("g")
            .call(this.yAxis);
        
        svg.append("g")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("fill", "none")
          .selectAll("circle")
          .data(this.data)
          .enter().append("circle")
            .attr("cx", d => this.x(d.x))
            .attr("cy", d => this.y(d.y))
            .attr("r", 5);
        
        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
          .selectAll("text")
          .data(this.data)
          .enter().append("text")
            .attr("x", d => this.x(d.x))
            .attr("y", d => this.y(d.y))
            .text(d => d.name)
            .call(this.dodge);

        return (
            <svg className="scatter-plot" width={this.width} height={this.height}></svg>
        );
    }

}
