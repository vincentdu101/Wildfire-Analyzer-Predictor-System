import * as React from "react";
import { Table } from "reactstrap";

export default class FiresByStateTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            states: []
        };
    }

    componentDidMount() {
        this.setState({states: []});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.states) {
            this.setState({states: nextProps.states});
        }
    }

    outputStateRow(states) {
        console.log(states);
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

    render() {
        return (
            <section className="fire-table">
                <Table className="table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">State</th>
                            <th scope="col">Number of Fires</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.outputStateRow(this.state.states)}
                    </tbody>
                </Table>
            </section>
        );
    }



}