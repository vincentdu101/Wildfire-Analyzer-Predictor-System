// inspiration:
// https://beta.observablehq.com/@mbostock/d3-pie-chart

import * as React from "react";
import * as d3 from "d3";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./PieChart.css";

export default class PieChart extends React.Component {

    width = 480;
    height = 300;

    constructor(props) {
        super(props);

        this.pie = this.pie.bind(this);
        this.defineColorRange = this.defineColorRange.bind(this);
        this.generateArcs = this.generateArcs.bind(this);
        this.tooltipVisible = this.tooltipVisible.bind(this);

        this.state = {
            arcs: [],
            tooltipActive: false,
            tooltipText: ""
        };
    }

    componentDidMount() {
        this.setState({ args: [], tooltipActive: false, tooltipText: "" });
    }
    

    componentWillReceiveProps(nextProps) {
        if (nextProps.arcs) {
            this.setState({ arcs: nextProps.arcs });
        }
    }

    defineColorRange(data) {
        return d3.scaleOrdinal()
            .domain(data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
            .reverse());
    }

    pie() {
        return d3.pie()
            .sort(null)
            .value(d => d.value);
    }

    arcBoundaries() {
        return d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(this.width, this.height) / 2 - 1);
    }

    onInteractionHandler(arc) {
        let text = "Cause of Fire:      \n" + arc.name + " \n\n";
        text +=    "Number of Fires:    \n" + arc.value + " \n";
        this.setState({ tooltipActive: true, tooltipText: text });
    }

    generateArcs() {
        if (this.state.arcs.length > 0) {
            const pie = this.pie();
            const colors = this.defineColorRange(this.state.arcs);
            const arcs = pie(this.state.arcs);
            const arcBoundary = this.arcBoundaries();

            return arcs.map((arc, i) => {
                const fill = colors(arc.data.name);

                return (
                    <CSSTransition
                        key={i}
                        classNames={`state-transition-${i}`}
                        appear={true}
                        timeout={5000}>

                        <g className="arc-container">
                            <path
                                className={`causes cause-transition-${i}`}
                                d={arcBoundary(arc)}
                                fill={fill}
                                stroke="#151616"
                                strokeWidth={0.25}
                                onMouseOver={() => this.onInteractionHandler(arc.data)}
                                onMouseOut={() => this.setState({tooltipActive: false})}
                                data-arc={arc.data}
                            >
                            </path>   
                        </g>    
                        
                    </CSSTransition>
                );
            });

        }
    }

    tooltipVisible() {
        return this.state.tooltipActive ? "active" : "";
    }

    render() {
        return (
            <section className="pie-chart-section">
                <svg
                    className={`map US`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-250 -250 480 400"
                    width={this.width}
                    height={this.height}
                >
                    {this.generateArcs()}
                </svg>

                <div className={"pie-tooltip " + this.tooltipVisible()}>
                    {this.state.tooltipText}
                </div>
            </section>
        );
    }

}
