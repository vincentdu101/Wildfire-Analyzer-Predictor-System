import React from "react";
import CircleTooltip from "../Tooltip/CircleTooltip";
import Map from "../Map/Map";
import FiresTable from "../Table/FiresTable";
import FiresByStateTable from "../Table/FiresByStateTable";
import FireModal from "../Modal/FireModal";
import { MapService } from "../../services/MapService/MapService";
import { FireDataService } from "../../services/FireDataService/FireDataService";

export default class AnalyzerDash extends React.Component {

    constructor() {
        super();

        this.fireSelected = this.fireSelected.bind(this);
        this.fireHovered = this.fireHovered.bind(this);
        this.fireHoverExit = this.fireHoverExit.bind(this);
        this.outputFireText = this.outputFireText.bind(this);

        this.state = {
            data: null,
            maps: null,
            fires: null,
            states: null,
            causes: null,
            firesByYear: null,
            fireModal: false,
            selectedFire: null,
            tooltipX: 0,
            tooltipY: 0,
            tooltipActive: false,
            tooltipText: ""
        };
    }

    componentDidMount() {
        MapService.getMapData().then((mapData) => {
            this.setState({maps: mapData});
        });

        FireDataService.getFiresData().then((fireData) => {
            this.setState({fires: fireData.data.fires});
        });

        FireDataService.getStatesCountData().then((fireData) => {
            this.setState({states: fireData.data.states});
        });

        FireDataService.getCausesCountData().then((fireData) => {
            this.setState({causes: fireData.data.causes});
        });

        FireDataService.getWildfireByYear().then((fireData) => {
            this.setState({firesByYear: fireData.data.fires});
        });
    }

    componentDidUpdate() {

    }

    fireSelected(fire) {
        this.setState({ fireModal: true, selectedFire: fire });
    }

    outputFireText(activeFire) {
        let text = "Fire Name:         " + activeFire.FIPS_NAME + " \n";
        text +=    "Fire Code:         " + activeFire.FIPS_CODE + " \n";
        text +=    "Fire Size Class:   " + activeFire.FIRE_SIZE_CLASS + " \n";
        text +=    "Fire Cause:        " + activeFire.STAT_CAUSE_DESCR + " \n";
        text +=    "State:             " + activeFire.STATE + " \n";
        text +=    "County:            " + activeFire.COUNTY + " \n";

        return text;
    }

    fireHovered(fire) {
        const activeFire = this.state.fires[fire.target.dataset.index];
        let text = this.outputFireText(activeFire);

        this.setState({
            tooltipX: fire.x,
            tooltipY: fire.y,
            tooltipActive: true,
            tooltipText: text
        });
    }

    fireHoverExit() {
        this.setState({
            tooltipActive: false
        });
    }

    render() {
        return (
            <div className="no-gutters">

                <div className="row col-xs-12">
                
                    <div className="card col-xs-12 col-xl-4">
                        <FiresByStateTable states={this.state.states} />
                    </div>

                </div>

                <div className="card col-xs-12">
                    <div className="card-body">
                        <section className="map-area">
                            <Map maps={this.state.maps} 
                                circles={this.state.fires}
                                circleOnClick={this.fireSelected}
                                circleOnHover={this.fireHovered}
                                circleHoverExit={this.fireHoverExit} />

                            <CircleTooltip  text={"test"} 
                                            x={this.state.tooltipX}
                                            y={this.state.tooltipY}
                                            active={this.state.tooltipActive}
                                            text={this.state.tooltipText} />                                
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

                <FireModal  active={this.state.fireModal}
                            fire={this.state.selectedFire} />

            </div>
        );
    }
    
}