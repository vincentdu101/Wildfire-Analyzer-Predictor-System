import * as React from "react";
import { Table } from "reactstrap";
import "./FiresByStateTable.css";
import Loader from "react-loader-spinner";

export default class CountiesCountTable extends React.Component {

    constructor(props) {
        super(props);

        this.outputTable = this.outputTable.bind(this);

        this.state = {
            counties: [],
            loader: true
        };
    }

    componentDidMount() {
        this.setState({counties: []});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.counties) {
            this.setState({counties: nextProps.counties, loader: false});
        }
    }

    outputCountyRow(counties) {
        return counties.map((row, index) => {
            let county = !row[0] ? "No Name" : row[0];
            return (
                <tr key={index + county}>
                    <td key={county + "-state"}>{county}</td>
                    <td key={row[1] + "-state"}>{row[1]}</td>
                    <td key={row[2] + "-fires"}>{row[2]}</td>
                </tr>
            );
        });
    }

    outputTable() {
        if (this.state.loader) {
            return (
                <Loader type="ThreeDots" color="#00BFFF" height="100" width="100" />
            );
        } else {
            return (
                <Table className="table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">County Name</th>
                            <th scope="col">State</th>
                            <th scope="col">Number of Fires</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.outputCountyRow(this.state.counties)}
                    </tbody>
                </Table>
            );
        }
    }

    render() {
        return (
            <section className="fire-table">
                {this.outputTable()}
            </section>
        );
    }



}