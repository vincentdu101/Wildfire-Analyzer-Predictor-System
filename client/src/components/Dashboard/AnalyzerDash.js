import React, { Component } from 'react';
import CircleTooltip from "../Tooltip/CircleTooltip";
import Map from "../Map/Map";
import FiresTable from "../Table/FiresTable";
import FiresByStateTable from "../Table/FiresByStateTable";
import FireModal from "../Modal/FireModal";
import PieChart from "../Charts/PieChart";
import ScatterPlot from "../Charts/ScatterPlot";
import BarChart from "../Charts/BarChart";
import CountiesCountTable from "../Table/CountiesCountTable";
import { MapService } from "../../services/MapService/MapService";
import { DateService } from "../../services/DateService/DateService";
import { FireDataService } from "../../services/FireDataService/FireDataService";
import * as JulianDate from "julian-date";
import * as julianParse from "julian";
import * as slideShow from "../../data/home-slideshow.json";
import "./AnalyzerDash.css";
import { ListGroup, ListGroupItem, Input } from "reactstrap";
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
  } from 'reactstrap';
import { StateDataService } from '../../services/StateDataService/StateDataService';

export default class AnalyzerDash extends Component {

    constructor() {
        super();

        window["julian"] = new JulianDate();
        window["julianParse"] = julianParse;

        this.fireSelected = this.fireSelected.bind(this);
        this.fireHovered = this.fireHovered.bind(this);
        this.fireHoverExit = this.fireHoverExit.bind(this);
        this.outputFireText = this.outputFireText.bind(this);
        this.convertCausesData = this.convertCausesData.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
        this.outputCarousel = this.outputCarousel.bind(this);
        this.outputOptionInput = this.outputOptionInput.bind(this);
        this.inputFieldChanged = this.inputFieldChanged.bind(this);
        this.getFiresSearch = this.getFiresSearch.bind(this);
        this.imgWidth = "600";
        this.imgHeight = "400";

        this.state = {
            activeIndex: 0,
            data: null,
            maps: null,
            fires: null,
            states: null,
            causes: null,
            causesList: [],
            firesByYear: null,
            fireModal: false,
            selectedFire: null,
            filterLoading: true,
            tooltipX: 0,
            tooltipY: 0,
            tooltipActive: false,
            tooltipText: "",
            fireParams: {},
            stateData: StateDataService.statesAndCounties
        };
    }

    componentDidMount() {
        StateDataService.injectStateCountyInfo().then((data) => {
            this.setState({stateData: data});
        });

        MapService.getMapData().then((mapData) => {
            this.setState({maps: mapData});
        });

        FireDataService.getFiresData().then((fireData) => {
            this.setState({fires: fireData.data.fires, filterLoading: false});
        });

        FireDataService.getStatesCountData().then((fireData) => {
            this.setState({states: fireData.data.states});
        });

        FireDataService.getCausesCountData().then((fireData) => {
            this.setState({causes: this.convertCausesData(fireData.data.causes)});
        });

        FireDataService.getWildfireByYears().then((fireData) => {
            this.setState({firesByYears: this.convertFiresByYears(fireData.data.years)});
        });

        FireDataService.getMostPronedCounties().then((fireData) => {
            this.setState({mostCounties: fireData.data.counties});
        });

        FireDataService.getLeastPronedCounties().then((fireData) => {
            this.setState({leastCounties: fireData.data.counties});
        });
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
        this.setState({});
    }

    fireSelected(fire) {
        this.setState({ fireModal: true, selectedFire: fire });
    }

    convertCausesData(causes) {
        return causes.map((cause) => {
            return {name: cause[1], value: cause[0]};
        });
    }

    convertFiresByYears(years) {
        return years.map((values) => {
            return {year: values[0], count: values[1]};
        });
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

    parsedScatterPlotData(fires) {
        if (!fires) {
            return undefined;
        }

        return fires.map((fire) => {
            let containedDate = DateService.parseJulianDate(fire.CONT_DATE);
            let discoveredDate = DateService.parseJulianDate(fire.DISCOVERY_DATE);            
            let hours = 60 * 60 * 1000;

            return {
                name: fire.FIRE_CODE || fire.FIPS_NAME,
                x: discoveredDate,
                y: (containedDate - discoveredDate) / hours,
                z: fire.FIRE_SIZE_CLASS
            };
        });
    }

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === slideShow.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? slideShow.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    outputCarousel() {
        const { activeIndex } = this.state;

        const slides = slideShow.map((item) => {
          return (
            <CarouselItem
              onExiting={this.onExiting}
              onExited={this.onExited}
              key={item.src}
            >
              <img src={item.src} alt={item.altText} width={this.imgWidth} height={this.imgHeight} />
              <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
            </CarouselItem>
          );
        });
    
        return (
          <Carousel
            activeIndex={activeIndex}
            next={this.next}
            previous={this.previous}
          >
            <CarouselIndicators items={slideShow} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
          </Carousel>
        );
    }

    outputOptionInput(list) {
        return list.map((item, index) => {
            return (
                <option value={item} key={item+index}>{item}</option> 
            );
        });
    }

    inputFieldChanged(key, value) {
        let param = this.state.fireParams;
        if (value === "") { 
            delete param[key];
        } else {
            param[key] = value;
        }
        this.setState({fireParams: param});
    }

    getFiresSearch() {
        this.setState({filterLoading: true});
        FireDataService.getFiresData(this.state.fireParams).then((fireData) => {
            this.setState({fires: fireData.data.fires, filterLoading: false});
        }); 
    }

    render() {
        return (
            <div className="no-gutters">

                {this.outputCarousel()}

                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">Wildfire Analysis System</h1>
                        <p className="lead"
                            >Various statistics to visualize the various aspects of wildfires.
                        </p>
                    </div>
                </div>

                <div className="row col-xs-12">
                
                    <div className="card col-xs-12 col-sm-6 top-section-card">
                        <FiresByStateTable states={this.state.states} />
                    </div>

                    <div className="card col-xs-12 col-sm-6 top-section-card">
                        <h5 className="title-section">Fires By State</h5>

                        <div className="card-body">
                            This is a table showcasing the number of fires per state.

                            <ListGroup className="note-section">
                                <ListGroupItem>California, Georgia, North Carolina, and Texas had the most wildfires.</ListGroupItem>
                                <ListGroupItem>Washington DC, Delaware, Vermont, and Rhode Island had the lowest wildfires.</ListGroupItem>
                                <ListGroupItem>California had the most wildfires of any state.</ListGroupItem>
                            </ListGroup>
                        </div>
                    </div>

                </div>

                <div className="row col-xs-12">

                    <div className="card col-xs-12 col-sm-6 top-section-card">
                        <h5 className="title-section">Cause of Fires</h5>

                        <div className="card-body">
                            The pie chart showcases the different causes of fires and 
                            their number count.

                            <ListGroup className="note-section">
                                <ListGroupItem>Debris Burning was the largest cause of wildfires.</ListGroupItem>
                                <ListGroupItem>The structure burning accounted for the least cause.</ListGroupItem>
                                <ListGroupItem>Over 160,000 fires are still unknown as to their cause.</ListGroupItem>
                            </ListGroup>
                        </div>
                    </div>

                    <div className="card col-xs-12 col-sm-6 top-section-card">
                        <PieChart arcs={this.state.causes} />
                    </div>

                </div>

                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">Fire Mapping Search</h1>
                        <p className="lead">Filter based on the different categories to visualize the fires.</p>
                    </div>
                </div>         

                <div className="container fires-map-search-form">
                
                    <div className="row">
                        <div className="col-xs-12 col-sm-2">
                            <Input  type="select" 
                                    name="fire-size-class" 
                                    id="fire-size-class-select" 
                                    onChange={(event) => this.inputFieldChanged("year", event.target.value)}
                                    value={this.state.fireParams.year}>
                                <option value="">Select a Year</option>
                                {this.outputOptionInput(DateService.getWildfireYears())}
                            </Input>
                        </div>

                        <div className="col-xs-12 col-sm-2">
                            <Input  type="select" 
                                    name="fire-size-class" 
                                    id="fire-size-class-select" 
                                    onChange={(event) => this.inputFieldChanged("size", event.target.value)}
                                    value={this.state.fireParams.size}>
                                <option value="">Select a Size Class</option>
                                <option value={"A"}>A</option>
                                <option value={"B"}>B</option>
                                <option value={"C"}>C</option>
                                <option value={"D"}>D</option>
                                <option value={"E"}>E</option>
                                <option value={"F"}>F</option>
                                <option value={"G"}>G</option>
                            </Input>
                        </div>

                        <div className="col-xs-12 col-sm-2">
                            <Input  type="select" 
                                    name="fire-size-class" 
                                    id="fire-size-class-select" 
                                    onChange={(event) => this.inputFieldChanged("cause", event.target.value)}
                                    value={this.state.fireParams.cause}>
                                <option value="">Select a Fire Cause</option>
                                {this.outputOptionInput(FireDataService.getCausesList())}
                            </Input>
                        </div>

                        <div className="col-xs-12 col-sm-2">
                            <Input  type="select" 
                                    name="fire-size-class" 
                                    id="fire-size-class-select" 
                                    onChange={(event) => this.inputFieldChanged("state", event.target.value)}
                                    value={this.state.fireParams.state}>
                                <option value="">Select a State</option>
                                {StateDataService.outputStateValues(this.state.stateData)}
                            </Input>
                        </div>

                        <div className="col-xs-12 col-sm-2">
                            <button className="btn-primary" onClick={() => this.getFiresSearch()}>Filter</button>
                        </div>
                    </div>
                
                </div>       

                <div className="card col-xs-12">
                    <div className="card-body">
                        <section className="map-area">
                            <Map maps={this.state.maps} 
                                circles={this.state.fires}
                                circleOnClick={this.fireSelected}
                                circleOnHover={this.fireHovered}
                                circleHoverExit={this.fireHoverExit}
                                loader={this.state.filterLoading} />

                            <CircleTooltip  x={this.state.tooltipX}
                                            y={this.state.tooltipY}
                                            active={this.state.tooltipActive}
                                            text={this.state.tooltipText} />                                
                        </section>
                    </div>
                </div>

                <div className="card col-xs-12">
                    <div className="card-body">
                        <section className="fires-table">
                            <FiresTable fires={this.state.fires}
                                        loader={this.state.filterLoading} />
                        </section>
                    </div>
                </div>     

                <div className="card col-xs-12">
                    <div className="card-body">
                        <section className="fires-line-chart">
                            <ScatterPlot    points={this.parsedScatterPlotData(this.state.fires)}
                                            loader={this.state.filterLoading} />
                        </section>
                    </div>
                </div>

                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">Number of Fires Per Year</h1>
                        <p className="lead">Horizontal bar chart to showcase how many wildfires per each year.</p>
                    </div>
                </div>                 

                <div className="card col-xs-12">
                    <div className="card-body">
                        <section className="fires-line-chart">
                            <BarChart   data={this.state.firesByYears} 
                                        loader={this.state.filterLoading} />
                        </section>
                    </div>
                </div>

                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">Counties with Most/Least Fires</h1>
                        <p className="lead">Various statistics to visualize the various aspects of county wildfires.</p>
                    </div>
                </div> 

                <div className="row col-xs-12">

                    <div className="card col-xs-12 col-sm-6">
                        <CountiesCountTable counties={this.state.mostCounties} />
                    </div>

                    <div className="card col-xs-12 col-sm-6">
                        <CountiesCountTable counties={this.state.leastCounties} />
                    </div>
                
                </div>

                <FireModal  active={this.state.fireModal}
                            fire={this.state.selectedFire} />

            </div>
        );
    }
    
}