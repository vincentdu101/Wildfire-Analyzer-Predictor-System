/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class FireModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            fire: {}
        };

        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.setState({ modal: false, fire: {} });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.active && nextProps.fire) {
            this.setState({ modal: nextProps.active, fire: nextProps.fire });
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <div>
                <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Fire Name: {this.state.fire.FIPS_NAME}</ModalHeader>
                    <ModalBody>
                        <table className="table">
                            <tbody>
                                <tr><td>Fire Code: </td><td>{this.state.fire.FIPS_CODE}</td></tr>
                                <tr><td>Fire Class Size: </td><td>{this.state.fire.FIRE_SIZE_CLASS}</td></tr>
                                <tr><td>Fire Cause: </td><td>{this.state.fire.STAT_CAUSE_DESCR}</td></tr>
                                <tr><td>State: </td><td>{this.state.fire.STATE}</td></tr>
                                <tr><td>County: </td><td>{this.state.fire.COUNTY}</td></tr>
                            </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}