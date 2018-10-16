import * as React from "react";
import { Table } from "reactstrap";
 
export default class FiresTable extends React.Component {

    constructor(props) {
        super(props);

        this.outputFireRow = this.outputFireRow.bind(this);
        this.updateTableAndState = this.updateTableAndState.bind(this);

        this.state = {
            fires: []
        };
    }

    updateTableAndState(props) {
        if (props.fires) { 
            this.setState({fires: props.fires});
        }
    }

    componentDidMount() {
        this.setState({fires: []});
    }

    componentWillReceiveProps(nextProps) {
        this.updateTableAndState(nextProps);
    }

    generateColumnKey(attr, index, value) {
        return attr + index + value;
    }

    outputFireRow(fires) {
        return fires.map((row, index) => {
            // let origDateTime = DateService.printFormattedTime(row.origDateTime);
            // let destDateTime = DateService.printFormattedTime(row.destDateTime);
            console.log(row);
            return (
                <tr key={index + row.FIRE_CODE}>
                    <td key={this.generateColumnKey("code", index, row.FIRE_CODE)}>{row.FIRE_CODE || "No code"}</td>
                    <td key={this.generateColumnKey("name", index, row.FIPS_NAME)}>{row.FIPS_NAME}</td>
                    <td key={this.generateColumnKey("state", index, row.STATE)}>{row.STATE}</td>
                    <td key={this.generateColumnKey("county", index, row.COUNTY)}>{row.COUNTY}</td>
                    <td key={this.generateColumnKey("cause-code", index, row.STAT_CAUSE_CODE)}>{row.STAT_CAUSE_CODE}</td>
                    <td key={this.generateColumnKey("cause-desc", index, row.STAT_CAUSE_DESCR)}>{row.STAT_CAUSE_DESCR}</td>
                    <td key={this.generateColumnKey("dis", index, row.DISCOVERY_DATE)}>{row.DISCOVERY_DATE}</td>
                    <td key={this.generateColumnKey("con", index, row.CONT_DATE)}>{row.CONT_DATE}</td>
                    <td key={this.generateColumnKey("fire-class", index, row.FIRE_SIZE_CLASS)}>{row.FIRE_SIZE_CLASS}</td>
                    <td key={this.generateColumnKey("fire-size", index, row.FIRE_SIZE)}>{row.FIRE_SIZE}</td>
                </tr>
            );
        });
    }

    printRequestDateTime(schedule) {
        let date = this.state.fires.schedule ? this.state.fires.schedule.dateTime : "";

        if (date !== "") {
            let dateObj = new Date(date);
            return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
        }

        return date;
    }

    render() {
        return (
            <section className="fire-table">
                <Table className="table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Fire Code</th>
                            <th scope="col">Fire Name</th>
                            <th scope="col">State</th>
                            <th scope="col">County</th>
                            <th scope="col">Cause of Fire Code</th>
                            <th scope="col">Cause of Fire Reason</th>
                            <th scope="col">Discovery Date and Time</th>
                            <th scope="col">Contained Date and Time</th>
                            <th scope="col">Fire Size Class</th>
                            <th scope="col">Fire Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.outputFireRow(this.state.fires)}
                    </tbody>
                </Table>
            </section>
        );
    }

}
