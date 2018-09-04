import React, { Component } from 'react';
import '../App.css';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Modal, Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, DropdownButton, MenuItem, Tabs, Tab } from "react-bootstrap"
import firebase from "firebase"
import PropType from "prop-types"
import TimePicker from 'rc-time-picker';
import { stat } from 'fs';

Object.defineProperty(String.prototype, 'intHour', {
    get: function () {
        var timeArray = this.split(":")
        if (timeArray.length === 2) {
            var intHour = parseInt(timeArray[0]) * 100
            intHour += parseInt(timeArray[1]) / 3 * 5
            return intHour
        } else {
            return ""
        }

    }
});

Object.defineProperty(Number.prototype, 'stringHour', {
    get: function () {

        var hour = Math.floor(this / 100)
        var minute = this - 100 * hour
        return hour.toString() + ":" + (minute / 5 * 3).toString()

    }
});


class AddTimeTableModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentHour: 2,
            currentMinute: 0,
            currentWeekday: 2,
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
            },
            listRooms: {},
            currentSelectTimeTable: "",
        }
    }

    handleTextField = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    onAddTimeTable = (event) => {
        var timeTable = this.state.currentSelectTimeTable
        var timeTableArray = timeTable.split("&")
        if (timeTableArray.length === 3) {
            const roomName = timeTableArray[0]
            const start = timeTableArray[1]
            const end = timeTableArray[2]
            const weekday = this.state.currentWeekday
            const idClass = this.props.idClass
            const index = this.props.index
            const listClassRef = firebase.database().ref("ListClass")
            var updatedTimeTable = {}
            updatedTimeTable["ListTimeTable/" + weekday + "/" + roomName + "/" + idClass + "b" + index] = {
                start: start,
                end: end,
                idClass: idClass,
            }
            updatedTimeTable["ListClass/" + idClass + "/timeTable/b" + index] = {
                start: start,
                end: end,
                room: parseInt(roomName),
                weekday: parseInt(this.state.currentWeekday),
            }
            firebase.database().ref().update(updatedTimeTable, (err) => {
                if (err) {
                    console.log(err.message)
                }
            })

            this.setState({
                currentHour: 2,
                currentMinute: 0,
                currentWeekday: 2,
                products: {},
                currentSelectTimeTable: "",
            })
        } else {
            console.log("Có lỗi xảy ra khi thêm TKB: timeTableArray sai cau truc");
        }


        this.props.onHide()
    }

    componentWillMount = () => {

    }

    componentDidMount = () => {
        var newProducts = {}
        var listRooms = {101: "Edumet", 201: "Eduspace"}
        firebase.database().ref("ListRooms").once("value", (snaps) => {
            // snaps.forEach((snap) => {
            //     listRooms[snap.key] = snap.val()
            // })

            Object.keys(listRooms).forEach((key, indexKey, array) => {
                firebase.database().ref("ListTimeTable").child(this.state.currentWeekday).child(key).once("value", (snapsBuoi) => {
                    
                    var busyTimeArray = this.createTimeArray()
                    var index = 1
                    if (snapsBuoi.exists()) {
                        snapsBuoi.forEach((snapBuoi) => {
                            this.fillBusyTimeArray(snapBuoi.child("start").val(), snapBuoi.child("end").val(), busyTimeArray)
                            if (snapsBuoi.numChildren() === index) {
                                newProducts[key] = this.checkAvailableTime(this.state.currentHour, this.state.currentMinute, busyTimeArray)
                                console.log(newProducts[key]);
                                
                            } else {
                                index++
                            }
                        })
                    } else {
                        newProducts[key] = this.checkAvailableTime(this.state.currentHour, this.state.currentMinute, busyTimeArray)
                    }
                    

                    if (indexKey === (array.length - 1)) {
                        console.log("New product = product");
                        this.setState({
                            products: newProducts,
                        })
                    }
                    
                }, (err) => {
                    console.log("Có lỗi xảy ra khi lấy dữ liệu TKB: ", err);
                })
                
            })


        })

    }

    checkVeryVeryHardQuestion = () => {
        var timeArray = [true, true, true, false, false, true, true, true, true, false, false, true, false]
        var resultArray = []
        var length = 2
        var buffer = 0
        timeArray.forEach((value, index) => {
            if (value === true) {
                buffer++
                if (buffer >= length) {
                    resultArray.push(index - (length - 1))
                }
            } else {
                buffer = 0
            }
        })
        console.log(resultArray)
    }

    checkAvailableTime = (lengthHour, lengthMinutes, timeArray) => {
        var resultArray = []
        var length = lengthHour * 4 + lengthMinutes
        var buffer = 0
        timeArray.forEach((value, index) => {
            if (value === true) {
                buffer++
                if (buffer >= length) {
                    var availableIndex = index - (length - 1)
                    var start = (availableIndex * 25 + 750).stringHour
                    var end = (start.intHour + length * 25).stringHour
                    resultArray.push({
                        start: start,
                        end: end,
                    })
                }
            } else {
                buffer = 0
            }
        })

        return resultArray
    }

    checkTKB = (start, end) => {
        if (end.intHour - start.intHour <= 0) {
            return false
        }
        var timeArray = this.createTimeArray()

        this.fillBusyTimeArray("7:30", "9:45", timeArray)
        this.fillBusyTimeArray("13:30", "15:45", timeArray)
        return this.checkTimeArray(start, end, timeArray)
    }

    getFreeTimes = (hourLength, minutesLength) => {
        var freeTimes = []
        var lengthTime = hourLength * 100 + minutesLength / 3 * 5

    }

    createTimeArray = () => {
        var timeArray = []
        for (let index = 0; index < 55; index++) {
            timeArray[index] = true
        }
        return timeArray
    }

    fillBusyTimeArray = (start, end, timeArray) => {
        var intStart = start.intHour
        var intLength = (end.intHour - intStart) / 25
        for (let index = (intStart - 750) / 25; index <= (intStart - 750) / 25 + intLength; index++) {
            timeArray[index] = false
        }
    }

    checkTimeArray = (start, end, timeArray) => {
        var intStart = start.intHour
        var intLength = (end.intHour - intStart) / 25
        for (let index = (intStart - 750) / 25 + 1; index < (intStart - 750) / 25 + intLength; index++) {
            if (timeArray[index] === false) {
                return false
            }
        }
        return true
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    onSelectHour = (eventKey, event) => {
        this.setState({
            currentHour: eventKey
        })
    }

    onSelectMinute = (eventKey, event) => {
        this.setState({
            currentMinute: eventKey
        })
    }

    onChangeWeekday = (value) => {
        this.setState({
            currentWeekday: value
        })
    }

    onClickTimeTable = (event) => {
        console.log(event.currentTarget.value);
        this.setState({
            currentSelectTimeTable: event.currentTarget.value
        })
    }


    renderTimeTables = (products) => {
        const listOfKey = Object.keys(products)
        var timeTableJSX = []
        listOfKey.forEach((roomName) => {
            timeTableJSX.push(<p key={"p" + roomName}>{roomName}</p>)
            products[roomName].forEach((availableTime) => {
                timeTableJSX.push(<Button onClick={this.onClickTimeTable} value={roomName + "&" + availableTime.start + "&" + availableTime.end} key={roomName + availableTime.start}>{availableTime.start + "->" + availableTime.end}</Button>)
            })
            timeTableJSX.push(<hr key={roomName} />)
        })

        return timeTableJSX
    }

    render() {

        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Lớp Học</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ButtonToolbar>
                        <ToggleButtonGroup type="radio" name="options" value={this.state.currentWeekday} onChange={this.onChangeWeekday}>
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
                    <DropdownButton bsSize="sm" title={this.state.currentHour + " giờ"} onSelect={this.onSelectHour} id="dropdown-size-medium">
                        <MenuItem eventKey={0}>0 giờ</MenuItem>
                        <MenuItem eventKey={1}>1 giờ</MenuItem>
                        <MenuItem eventKey={2}>2 giờ</MenuItem>
                        <MenuItem eventKey={3}>3 giờ</MenuItem>
                    </DropdownButton>
                    <DropdownButton bsSize="sm" title={this.state.currentMinute + " phút"} onSelect={this.onSelectMinute} id="dropdown-size-medium">
                        <MenuItem eventKey={0}>0 phút</MenuItem>
                        <MenuItem eventKey={15}>15 phút</MenuItem>
                        <MenuItem eventKey={30}>30 phút</MenuItem>
                        <MenuItem eventKey={45}>45 phút</MenuItem>
                    </DropdownButton>
                </Modal.Body>
                {this.renderTimeTables(this.state.products)}

                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                    <Button bsStyle="success" onClick={this.onAddTimeTable}>Thêm TKB</Button>
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
    index: PropType.number.isRequired,
}