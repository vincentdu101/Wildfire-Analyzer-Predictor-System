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
        this.projection = this.projection.bind(this);
        
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

    generateMap(path) {
        console.log(this.state.maps);
        if (this.state.maps) {
            // const maps = this.state.maps;
            // const data = topojson.feature(maps, maps.features).features;
            return this.generatePath(path, this.state.maps.features);
        } else {
            return (<div>test</div>);
        }
    }

    generateCircles() {
        if (this.state.maps) {
            const data = [[-122.490402, 37.786453], [-122.389809, 37.72728], [-78.917377, 39.757239], [-81.307761, 33.468848]];

            // for doing county level mapping - too performant heavy for this version
            // const data = topojson.feature(maps, maps.objects.counties).features;

            // projection.scale(1000).center([-95.8, 37.9]);

            return data.map((feature, i) => {
                const fill = "steelblue";
                const projection = this.projection();
                const locations = projection(feature);

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
                                fill={fill}
                                stroke="#000000"
                                strokeWidth={0.5}
                                cx={locations[0]}
                                cy={locations[1]}
                                // transform={'translate(' + projection(feature) + ')'}
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

    projection() {
        return d3.geoAlbersUsa().translate([ 960 / 2, 600 / 2 ]);
    }

    render() {
        // https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
        const path = d3.geoPath().projection(this.projection());

        return (
            <div className="map-container">
                <svg
                    className={`map US`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 960 600"
                >
                    {this.generateMap(path)}
                    {this.generateCircles()}
                </svg>
            </div>
        );
    }
}