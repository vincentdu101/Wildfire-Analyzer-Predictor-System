import * as React from "react";
import * as d3 from "d3";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { State } from "./State";
import "./Map.css";

export default class Map extends React.Component {

    width = 960;
    height = 500;

    constructor(props) {
        super(props);

        this.generateMap = this.generateMap.bind(this);
        this.generateState = this.generateState.bind(this);
        this.generateFocusedPoint = this.generateFocusedPoint.bind(this);
        this.generatePath = this.generatePath.bind(this);
        this.projection = this.projection.bind(this);
        this.circleOnClick = this.circleOnClick.bind(this);
        this.circleOnHover = this.circleOnHover.bind(this);
        this.circleOnHoverExit = this.circleOnHoverExit.bind(this);
        this.determineGPSLocation = this.determineGPSLocation.bind(this);
        
        this.state = {
            maps: null,
            circles: [],
            focusedPoint: null
        };
    }

    componentDidMount() {
        this.setState({maps: null, focusedPoint: null});
    }

    componentDidUpdate() {
    }

    determineGPSLocation() {
        console.log(d3.mouse(this));
    }

    circleOnClick(event) {
        let targetIndex = parseInt(event.target.dataset.index);
        this.props.circleOnClick(this.props.circles[targetIndex]);
    }

    circleOnHover(event) {
        let output = {
            x: event.pageX,
            y: event.pageY,
            target: event.target
        }
        this.props.circleOnHover(output);
    }

    circleOnHoverExit() {
        this.props.circleHoverExit();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.maps) {
            this.setState({maps: nextProps.maps});
        }

        if (nextProps.circles) {
            this.setState({circles: nextProps.circles});
        }
        
        if (nextProps.focusedPoint) {
            this.setState({focusedPoint: nextProps.focusedPoint});
        }
    }

    generateMap(path) {
        if (this.state.maps) {
            return this.generatePath(path, this.state.maps.features);
        } else {
            return (<div>test</div>);
        }
    }

    generateFocusedPoint() {
        if (this.state.maps && this.state.focusedPoint) {
            // https://d3indepth.com/geographic/
            // use invert method to reverse convert coordinates to gps locations

            const fill = "steelblue";
            const projection = this.projection();
            const locations = projection([this.state.focusedPoint[1], this.state.focusedPoint[0]]);
            console.log(this.state.focusedPoint);
            console.log(locations);
            return (
                <CSSTransition
                    key={"focused-1"}
                    classNames={`focused-state-transition`}
                    appear={true}
                    timeout={5000}>


                    <g className="circle-container">
                        <circle
                            className={`focused-states-circle raw focused-state-transition-circle-0`}
                            r={5}
                            data-index={"focused-states-1"}
                            id={"focused-id"}
                            fill={fill}
                            stroke="#000000"
                            strokeWidth={0.5}
                            cx={locations[0]}
                            cy={locations[1]}
                            opacity={0.75}
                            onClick={this.circleOnClick}
                            onMouseOver={this.circleOnHover}
                            onMouseOut={this.circleOnHoverExit}
                        />
                    </g>

                </CSSTransition>
            );
        } else {
            return (<div>test</div>);
        }        
    }

    generateCircles() {
        if (this.state.maps && this.props.circles) {
            // https://d3indepth.com/geographic/
            // use invert method to reverse convert coordinates to gps locations

            return this.props.circles.map((feature, i) => {
                const fill = "steelblue";
                const projection = this.projection();
                const locations = projection([feature.LONGITUDE, feature.LATITUDE]);
                
                return (
                    <CSSTransition
                        key={i}
                        classNames={`state-transition-${i}`}
                        appear={true}
                        timeout={5000}>


                        <g className="circle-container">
                            <circle
                                className={`states-circle raw state-transition-circle-${i}`}
                                r={5}
                                data-index={i}
                                id={feature.FOD_ID}
                                fill={fill}
                                stroke="#000000"
                                strokeWidth={0.5}
                                cx={locations[0]}
                                cy={locations[1]}
                                opacity={0.75}
                                onClick={this.circleOnClick}
                                onMouseOver={this.circleOnHover}
                                onMouseOut={this.circleOnHoverExit}
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
        data.map((feature, i) => {
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

    projection() {
        return d3.geoAlbersUsa().translate([ 960 / 2, 600 / 2 ]);
    }

    render() {
        const path = d3.geoPath().projection(this.projection());

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-8">
                        <div className="map-container">
                            <svg
                                className={`map US`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 960 600"
                                width={this.width}
                                height={this.height}
                            >
                                {this.generateMap(path)}
                                {this.generateCircles()}
                                {this.generateFocusedPoint()}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}