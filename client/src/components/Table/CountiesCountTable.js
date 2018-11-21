import * as React from "react";
import { Table } from "reactstrap";
import "./FiresByStateTable.css";

export default class CountiesCountTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            counties: []
        };
    }

    componentDidMount() {
        this.setState({counties: []});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.counties) {
            this.setState({counties: nextProps.counties});
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

    render() {
        return (
            <section className="fire-table">
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
            </section>
        );
    }



}