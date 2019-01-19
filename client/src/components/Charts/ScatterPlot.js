import * as React from "react";
import * as d3 from "d3";
import "./ScatterPlot.css";
import CircleTooltip from "../Tooltip/CircleTooltip";
import Loader from "react-loader-spinner";

export default class ScatterPlot extends React.Component {
    
    width = 960;
    height = 600;
    margin = {
        top: 20, right: 30, bottom: 30, left: 40
    };

    constructor(props) {
        super(props);

        this.tooltipVisible = this.tooltipVisible.bind(this);
        this.getXScaleLinear = this.getXScaleLinear.bind(this);
        this.getYScaleLinear = this.getYScaleLinear.bind(this);
        this.getRadiusByFireSize = this.getRadiusByFireSize.bind(this);
        this.setupCircles = this.setupCircles.bind(this);
        this.dodge = this.dodge.bind(this);
        this.onInteractionHandler = this.onInteractionHandler.bind(this);
        this.setupXGridlines = this.setupXGridlines.bind(this);
        this.createScatterPlot = this.createScatterPlot.bind(this);
        this.outputPlot = this.outputPlot.bind(this);

        this.state = {
            points: [],
            tooltipActive: false,
            tooltipText: "",
            tooltipX: 0,
            tooltipY: 0,
            loader: true
        };
    }

    componentDidMount() {
        this.setState({ points: [], tooltipActive: false, tooltipText: "" });
    }
    

    componentWillReceiveProps(nextProps) {
        if (nextProps.loader) {
            this.setState({ loader: nextProps.loader });
        }

        if (nextProps.points) {
            this.setState({ points: nextProps.points, loader: false });
        }
    }

    getXScaleLinear() {
        return d3.scaleLinear()
                .domain(d3.extent(this.data, d => d.x)).nice()
                .range([this.margin.left, this.width - this.margin.right]);
    }

    getYScaleLinear() {
        return d3.scaleLinear()
                .domain(d3.extent(this.data, d => d.y)).nice()
                .range([this.height - this.margin.bottom, this.margin.top]);
    }

    getRadiusByFireSize(size) {
        switch(size) {
            case "A":
                return 3;
            case "B": 
                return 4;
            case "C":
                return 5;
            case "D":
                return 6;
            case "E": 
                return 7;
            case "F":
                return 8;
            default:
                return 9;           
        }
    }

    getXAxisHeight() {
        return `translate(0,${this.height - this.margin.bottom})`;
    }

    onInteractionHandler(event) {
        let text = "Fire Code or Name: \n " + event.name + " \n ";
        text += "Discovered Date: \n " + event.x.toLocaleDateString() + " \n ";
        text += "Hours Until Contained: \n " + event.y + " \n ";
        text += "Fire Size Class: \n " + event.z;

        this.setState({
            tooltipActive: true,
            tooltipText: text,
            tooltipX: this.x(event.x),
            tooltipY: this.y(event.y)
        });
    }

    tooltipVisible() {
        return this.state.tooltipActive ? "active" : "";
    }

    setupCircles(svg) {
        svg.append("g")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("fill", "yellow")
            .selectAll("circle")
            .data(this.state.points)
            .enter().append("circle")
                .attr("cx", d => this.x(d.x))
                .attr("cy", d => this.y(d.y))
                .attr("r", d => this.getRadiusByFireSize(d.z))
                .on("mouseover", (event) => {
                    this.onInteractionHandler(event);
                })
                .on("mouseout", () => {
                    this.setState({
                        tooltipActive: false
                    });
                });
    }

    setupXGridlines(svg) {
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", this.getXAxisHeight())
            .call(d3.axisBottom(this.x).tickFormat(""));
    }

    setupYGridlines(svg) {
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(this.y).tickFormat(""));
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

    createScatterPlot() {
        const svg = d3.select(".scatter-plot");

        this.data = this.state.points;
        this.x = this.getXScaleLinear();
        this.y = this.getYScaleLinear();
  
        this.xAxis = (g) => g
            .attr("transform", this.getXAxisHeight())
            .call(d3.axisBottom(this.x).tickFormat(d => {
                return new Date(d).toLocaleDateString();
            }))
            .call(g => g.select(".domain").remove());
    
        this.yAxis = (g) => g
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(this.y))
            .call(g => g.select(".domain").remove());

        svg.append("g").call(this.xAxis);
        svg.append("g").call(this.yAxis);
        this.setupCircles(svg);
        this.setupXGridlines(svg);
        this.setupYGridlines(svg);

        return (
            <section className="scatter-plot-section">
                <svg    className="scatter-plot" 
                        width={this.width} 
                        height={this.height}>
                </svg>

                <CircleTooltip  text={"test"} 
                                x={this.state.tooltipX}
                                y={this.state.tooltipY}
                                active={this.state.tooltipActive}
                                text={this.state.tooltipText} /> 
            </section>
        );
    }

    outputPlot() {
        if (this.state.loader) {
            return (
                <Loader type="ThreeDots" color="#00BFFF" height="500" width="500" />
            );
        } else {
            return this.createScatterPlot();
        }
    }

    render() {
        return (
            <div className="scatter-plot-view">
                {this.outputPlot()}
            </div>
        );
    }

}
