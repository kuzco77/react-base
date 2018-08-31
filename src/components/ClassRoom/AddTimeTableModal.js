import React, { Component } from 'react';
import '../App.css';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Modal, Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, DropdownButton, MenuItem, Tabs, Tab } from "react-bootstrap"
import firebase from "firebase"
import PropType from "prop-types"
import TimePicker from 'rc-time-picker';
import { stat } from 'fs';

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl bsSize={"small"} componentClass="textarea" {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

class AddTimeTableModal extends Component {
    constructor() {
        super()
        this.state = {
            defaultHour: 2,
            defaultMinute: 0,
            defaultWeekday: 2,
            products: {},
        }
    }

    handleTextField = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    onAddTimeTable = event => {
        const listClassRef = firebase.database().ref("ListClass")
        listClassRef.child(this.state.idClass).set({
            idClass: this.state.idClass,
            grade: this.state.grade,
            major: this.state.major,
            level: this.state.level,
            introClass1: this.state.introClass1,
            introClass2: this.state.introClass2,
            phoneNumber: this.state.phoneNumber,
            subject: this.state.subject,
            time: this.state.time,
            timeCreate: firebase.database.ServerValue.TIMESTAMP,
            teacher: this.defaultTeacher
        }, (err) => {
            if (err) {
                console.log(err.message)
            }
        })

        this.setState({
            idClass: "",
            grade: "",
            introClass1: "",
            introClass2: ""
        })

        this.props.onHide()
    }

    componentDidMount = () => {
        this.setState({
            products: {
                101: [
                    { start: "7:30", end: "9:30" },
                    { start: "7:45", end: "9:45" },
                    { start: "8:00", end: "10:00" },
                    { start: "8:15", end: "10:15" },
                ],
                201: [
                    { start: "17:30", end: "19:30" },
                    { start: "17:45", end: "19:45" },
                    { start: "18:00", end: "20:00" },
                    { start: "18:15", end: "20:15" },
                ]
            }

        })
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    onSelectHour = (eventKey, event) => {
        this.setState({
            defaultHour: eventKey
        })
    }

    onSelectMinute = (eventKey, event) => {
        this.setState({
            defaultMinute: eventKey
        })
    }

    onChangeWeekday = (value) => {
        this.setState({
            defaultWeekday: value
        })
    }

    renderTimeTables = (products) => {
        const listOfKey = this.state.products.keys()
        console.log(products)
    }

    render() {

        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Lớp Học</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ButtonToolbar>
                        <ToggleButtonGroup type="radio" name="options" value={this.state.defaultWeekday} onChange={this.onChangeWeekday}>
                            <ToggleButton bsSize="sm" style={{ width: "1/8" }} value={2}>Thứ 2</ToggleButton>
                            <ToggleButton bsSize="sm" style={{ width: "1/8" }} value={3}>Thứ 3</ToggleButton>
                            <ToggleButton bsSize="sm" style={{ width: "1/8" }} value={4}>Thứ 4</ToggleButton>
                            <ToggleButton bsSize="sm" style={{ width: "1/8" }} value={5}>Thứ 5</ToggleButton>
                            <ToggleButton bsSize="sm" style={{ width: "1/8" }} value={6}>Thứ 6</ToggleButton>
                            <ToggleButton bsSize="sm" style={{ width: "1/8" }} value={7}>Thứ 7</ToggleButton>
                            <ToggleButton bsSize="sm" style={{ width: "1/8" }} value={1}>Chủ Nhật</ToggleButton>
                        </ToggleButtonGroup>
                    </ButtonToolbar>
                    <br />
                    <p>Thời lượng</p>
                    <DropdownButton bsSize="sm" title={this.state.defaultHour + " giờ"} onSelect={this.onSelectHour} id="dropdown-size-medium">
                        <MenuItem eventKey={0}>0 giờ</MenuItem>
                        <MenuItem eventKey={1}>1 giờ</MenuItem>
                        <MenuItem eventKey={2}>2 giờ</MenuItem>
                        <MenuItem eventKey={3}>3 giờ</MenuItem>
                    </DropdownButton>
                    <DropdownButton bsSize="sm" title={this.state.defaultMinute + " phút"} onSelect={this.onSelectMinute} id="dropdown-size-medium">
                        <MenuItem eventKey={0}>0 phút</MenuItem>
                        <MenuItem eventKey={15}>15 phút</MenuItem>
                        <MenuItem eventKey={30}>30 phút</MenuItem>
                        <MenuItem eventKey={45}>45 phút</MenuItem>
                    </DropdownButton>
                </Modal.Body>
                {this.renderTimeTables(this.state.products)}
                {/* <hr />
                {this.state.products["101"].forEach()}
                <hr />
                {this.state.products["201"].forEach()} */}

                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                    <Button bsStyle="success" onClick={this.onAddTimeTable}>Thêm lớp học</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default AddTimeTableModal

AddTimeTableModal.propTypes = {
    show: PropType.bool.isRequired,
    onHide: PropType.func.isRequired,
    idClass: PropType.string.isRequired,
}