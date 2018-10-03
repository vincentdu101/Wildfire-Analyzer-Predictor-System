import * as React from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { State } from "./State";
import * as stateIds from "../../data/us-states-ids.json";

export default class Map extends React.Component {

    constructor(props) {
        super(props);

        this.generateMap = this.generateMap.bind(this);
        this.generateState = this.generateState.bind(this);
        this.generatePath = this.generatePath.bind(this);
        console.log(stateIds);
        this.state = {
            maps: null,
            circles: []
        };
    }

    componentDidMount() {
        this.setState({maps: null});
    }

    componentDidUpdate() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.maps) {
            this.setState({maps: nextProps.maps});
        }

        if (nextProps.circles) {
            this.setState({circles: nextProps.circles});
        }
    }

    generateMap() {
        if (this.state.maps) {
            console.log(this.state.maps);
            const maps = this.state.maps;
            const data = topojson.feature(maps, maps.objects.states).features;
            return this.generatePath(d3.geoPath(), data);
        } else {
            return (<div>test</div>);
        }
    }

    generateCircles() {
        if (this.state.maps) {
            const maps = this.state.maps;
            console.log(maps);
            const data = topojson.feature(maps, maps.objects.counties).features;
            return data.map((feature, i) => {
                const fill = "#FFFFFF";
                const path = d3.geoPath().centroid(feature);

                return (
                    <CSSTransition
                        key={i}
                        classNames={`state-transition-${i}`}
                        appear={true}
                        timeout={5000}>

                        <g className="circle-container">
                            <circle
                                className={`states-circle raw state-transition-circle-${i}`}
                                r={1}
                                fill={fill}
                                stroke="#000000"
                                strokeWidth={0.5}
                                transform={'translate(' + path + ')'}
                                opacity={0.75}
                            />
                        </g>

                    </CSSTransition>
                );
            });
        } else {
            return (<div>test</div>);
        }
    }

    generateState(data, geoPath, mapType) {
        console.log(data);
        data.map((feature, i) => {
            // const breaks = this.getChoroplethBreaks();
            const fill = "#0de298";
            const path = geoPath(feature);

            return (
                <CSSTransition
                    key={i}
                    classNames={`state-transition-${i}`}
                    appear={true}
                    timeout={5000}
                >
                    <State
                        mapType={mapType}
                        stateName={feature.properties.stateName}
                        path={path}
                        feature={feature}
                        i={i}
                        fill={fill}
                        radius={20}
                    />
                </CSSTransition>
            );
        });
    }

    generatePath(geoPath, data) {
        const mapType = "US";

        return (
            <TransitionGroup component={null}>
                {data.map((feature, i) => {
                    // const breaks = this.getChoroplethBreaks();
                    const fill = "#F3F7F6";
                    const path = geoPath(feature);

                    return (
                        <CSSTransition
                            key={i}
                            classNames={`state-transition-${i}`}
                            appear={true}
                            timeout={5000}
                        >
                            <State
                                mapType={mapType}
                                stateName={feature.properties.stateName}
                                path={path}
                                feature={feature}
                                i={i}
                                fill={fill}
                                radius={20}
                            />
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        );
    }

    render() {
        return (
            <div className="map-container">
                <svg
                    className={`map US`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 960 600"
                >
                    {this.generateMap()}
                    {this.generateCircles()}
                </svg>
            </div>
        );
    }
}