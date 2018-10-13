import * as React from "react";
import * as d3 from "d3";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { State } from "./State";

export default class Map extends React.Component {

    constructor(props) {
        super(props);

        this.generateMap = this.generateMap.bind(this);
        this.generateState = this.generateState.bind(this);
        this.generatePath = this.generatePath.bind(this);
        this.projection = this.projection.bind(this);
        this.circleOnClick = this.circleOnClick.bind(this);
        
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

    circleOnClick(event) {
        let targetIndex = parseInt(event.target.dataset.index);
        this.props.circleOnClick(this.props.circles[targetIndex]);
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
        if (this.state.maps) {
            return this.generatePath(path, this.state.maps.features);
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
                console.log(feature);
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