import * as React from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { State } from "./State";
import { MapService } from "../../services/MapService/MapService";

export default class Map extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            maps: {}
        };
    }

    componentDidMount() {
        this.setState({maps: {}});
        MapService.getMapData().then((data) => {
            this.setState({maps: data});
        });
    }

    componentDidUpdate() {
        // MapService.getMapData().then((data) => {
        //     this.setState({maps: data});
        // });
    }

    generatePath(geoPath, data) {
        const { mapType } = this.props;

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
        if (this.state.maps && this.state.maps.geoPath) {
            const { mapType } = this.props;
            console.log(this.state.maps);
            const data = topojson.feature(this.state.maps.geoPath, this.state.maps.geoData.objects.states);
            const map = this.generatePath(d3.geoPath(), data);
    
            return (
                <div className="map-container">
                    <svg
                        className={`map ${mapType}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 960 600"
                    >
                        {map}
                    </svg>
                </div>
            );
        } else {
            return (<div>test</div>);
        }
    }
}