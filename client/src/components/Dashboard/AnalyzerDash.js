import React from "react";
import CircleTooltip from "../Tooltip/CircleTooltip";
import Map from "../Map/Map";
import FiresTable from "../Table/FiresTable";
import { MapService } from "../../services/MapService/MapService";
import { FireDataService } from "../../services/FireDataService/FireDataService";

export default class AnalyzerDash extends React.Component {

    constructor() {
        super();

        this.fireSelected = this.fireSelected.bind(this);
        this.fireHovered = this.fireHovered.bind(this);

        this.state = {
            data: null,
            maps: null,
            fires: null,
            tooltipX: 0,
            tooltipY: 0,
            tooltipActive: true
        };
    }

    componentDidMount() {
        MapService.getMapData().then((mapData) => {
            this.setState({maps: mapData});
        });

        FireDataService.getFiresData().then((fireData) => {
            this.setState({fires: fireData.data.fires});
        });
    }

    componentDidUpdate() {

    }

    fireSelected(fire) {
        debugger;
    }

    fireHovered(fire) {
        this.setState({
            tooltipX: fire.x,
            tooltipY: fire.y,
            tooltipActive: true
        });
    }

    render() {
        return (
            <div className="no-gutters">

                <div className="card col-xs-12">
                    <div className="card-body">
                        <section className="map-area">
                            <Map maps={this.state.maps} 
                                circles={this.state.fires}
                                circleOnClick={this.fireSelected}
                                circleOnHover={this.fireHovered} />

                            <CircleTooltip  text={"test"} 
                                            x={this.state.tooltipX}
                                            y={this.state.tooltipY}
                                            tooltipActive={true} />                                
                        </section>
                    </div>
                </div>

                <div className="card col-xs-12">
                    <div className="card-body">
                        <section className="fires-table">
                            <FiresTable fires={this.state.fires} />
                        </section>
                    </div>
                </div>
            </div>
        );
    }
    
}