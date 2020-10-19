import * as React from "react";
import { Table } from "reactstrap";
import "./FiresByStateTable.css";
import Loader from "react-loader-spinner";

export default class FiresByStateTable extends React.Component {

    constructor(props) {
        super(props);

        this.outputTable = this.outputTable.bind(this);

        this.state = {
            states: [],
            loader: true
        };
    }

    componentDidMount() {
        this.setState({states: []});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.states) {
            this.setState({states: nextProps.states, loader: false});
        }
    }

    outputStateRow(states) {
        return states.map((row, index) => {
            // let origDateTime = DateService.printFormattedTime(row.origDateTime);
            // let destDateTime = DateService.printFormattedTime(row.destDateTime);
            return (
                <tr key={index + row[1]}>
                    <td key={row[1] + "-name"}>{row[1]}</td>
                    <td key={row[0] + "-fires"}>{row[0]}</td>
                </tr>
            );
        });
    }

    outputTable() {
        if (this.state.loader) {
            return (
                <Loader type="ThreeDots" color="#00BFFF" height="200" width="200" />
            );
        } else {
            return (
                <Table className="table-bordered table-fixed">
                    <thead class>
                        <tr>
                            <th scope="col">State</th>
                            <th scope="col">Number of Fires</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.outputStateRow(this.state.states)}
                    </tbody>
                </Table>
            );
        }
    }

    render() {
        return (
            <section>
                {this.outputTable()}
            </section>
        );
    }



}