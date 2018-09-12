import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Button, Image, ToggleButtonGroup, ToggleButton, DropdownButton, MenuItem } from "react-bootstrap"
import PropType from "prop-types"
import moment from 'moment';
import TimePicker from 'rc-time-picker';

class ClassRoomTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teacherID: "",
            isUploading: false,
            progress: 0,
            isLoading: false,
        }

        this.state.listClasses = [];
        const columns = [{
            dataField: "idClass",
            text: "Mã Lớp Học",
            headerStyle: {
                width: "7%",
            }
        }, {
            dataField: "grade",
            text: "Lớp",
            headerStyle: {
                width: "5%",
            }
        }, {
            dataField: "subject",
            text: "Môn học",
            headerStyle: {
                width: "7%",
            }
        }, {
            dataField: "timeTable",
            text: "Thời gian",
            headerStyle: {
                width: "10%",
            },
            formatter: this.timeFormatter,
        }, {
            dataField: "major",
            text: "Chuyên đề",
            headerStyle: {
                width: "7%",
            }
        }, {
            dataField: "level",
            text: "Trình độ",
            headerStyle: {
                width: "90px",
            },
            formatter: this.levelFormatter,
        }, {
            dataField: "introClass1",
            text: "Giới thiệu 1",
            headerStyle: {
                width: "20%",
            },

        }, {
            dataField: "introClass2",
            text: "Giới thiệu 2",
            headerStyle: {
            },
            editorStyle: {
                height: "120px"
            },

        }, {
            dataField: "teacher.linkAvatar",
            text: "Người dạy",
            formatter: this.avatarFormater,
            editable: false,
            headerStyle: {
                width: "12%",
            }
        }, {
            dataField: "phoneNumber",
            text: "Số điện thoại",
            headerStyle: {
                width: "10%",
            },
        }, {
            dataField: "Action",
            text: "Action",
            formatter: this.actionFormater,
            editable: false,
            headerStyle: {
                width: "7%",
            },
        }];

        columns.forEach((value, index) => {

            value.editor = {
                type: "textarea",
            }
            Object.assign(value.headerStyle, { textAlign: "center" })

            value.editable = !(value.dataField === "Action" ||
                value.dataField === "teacher.linkAvatar" ||
                value.dataField === "level" ||
                value.dataField === "timeTable") && this.props.isSignedIn

        })

        this.state.columns = columns
    }

    avatarFormater = (cell, row, rowIndex, formatExtraData) => {
        if (row) {
            const teacher = row.teacher
            const nameTeacher = teacher.name
            return <div>
                <Image id="target" src={cell} height={100} width={100} circle={true} /><br />
                <p>{nameTeacher}</p>
                <Button style={{ marginTop: "0px", marginBottom: "5px" }} bsSize="small" bsStyle="info" onClick={this.props.openChooseTeacher(row.idClass)}>
                    Thay doi
            </Button>
            </div>
        } else {
            return <div>No data</div>
        }
    }

    onCloseTimePicker = (type, index, idClass) => (value) => {
        console.log(value.format("hh:mm"))
        console.log(value.format("hh:mm"), type + index + idClass)
        // this.setState({ [type + index + idClass]: value })
        this.setState({ isLoading: true })
        firebase.database().ref("ListClass").child(idClass).child("timeTable").child("b" + index).update({ [type]: value.format("hh:mm") }, (err) => {
            if (err) {
                console.log("Co loi xay ra khi cap nhat thoi khoa bieu");
                this.setState({ isLoading: false })
            } else {
                console.log("Cap nhat thoi khoa bieu thanh cong");
                this.setState({ isLoading: false })
            }

        })
    }

    getTheLastIndex = (index, cell) => {
        var lastIndex = index
        while (cell["b" + lastIndex] !== undefined) {
            lastIndex++
        }
        return (lastIndex - 1)
    }

    onDeleteTimeTable = (index, idClass, cell, weekday, room) => (event) => {
        this.setState({ isLoading: true })
        var timeTableRef = firebase.database().ref("ListClass").child(idClass).child("timeTable")
        var listTimeTablesRef = firebase.database().ref("ListTimeTables").child(weekday).child(room).child(idClass + "b" + (room - 1))
        var lastIndex = this.getTheLastIndex(index, cell)

        console.log("the last index is: " + lastIndex);
        if (lastIndex === index) {
            timeTableRef.child("b" + lastIndex).remove(this.checkError)
            listTimeTablesRef.remove()
        } else {
            timeTableRef.child("b" + lastIndex).once("value", (snap) => {
                timeTableRef.update({ ["b" + index]: snap.val() })
                snap.ref.remove(this.checkError)
            })
            listTimeTablesRef.remove(this.checkError)
        }
        this.setState({ isLoading: false })

    }

    checkError = (err) => {
        if (err) {
            console.log("Co loi khi xoa TKB: " + err.message);
        } else {
            console.log("Xoa TKB thanh cong");
        }
    }

    renderDropdownWeekday = (weekday, index, idClass) => {
        var weekdayPlus = ""
        switch (weekday) {
            case 1:
                weekdayPlus = "CN"
                break;
            case 2:
                weekdayPlus = "T2"
                break;
            case 3:
                weekdayPlus = "T3"
                break;
            case 4:
                weekdayPlus = "T4"
                break;
            case 5:
                weekdayPlus = "T5"
                break;
            case 6:
                weekdayPlus = "T6"
                break;
            case 7:
                weekdayPlus = "T7"
                break;

            default:
                break;
        }
        return (
            <DropdownButton
                bsSize="xsmall"
                title={weekdayPlus}
                key={"dd" + index + idClass}
                id={"dd" + index + idClass}
                onSelect={this.onSelectDropDownWeekday(index, idClass)}
                disabled={this.state.isLoading}
            >
                <MenuItem eventKey="1" active={weekday === 1}>CN</MenuItem>
                <MenuItem eventKey="2" active={weekday === 2}>T2</MenuItem>
                <MenuItem eventKey="3" active={weekday === 3}>T3</MenuItem>
                <MenuItem eventKey="4" active={weekday === 4}>T4</MenuItem>
                <MenuItem eventKey="5" active={weekday === 5}>T5</MenuItem>
                <MenuItem eventKey="6" active={weekday === 6}>T6</MenuItem>
                <MenuItem eventKey="7" active={weekday === 7}>T7</MenuItem>
            </DropdownButton>
        );
    }

    onSelectDropDownWeekday = (index, idClass) => (eventKey, event) => {
        this.setState({ isLoading: true })
        firebase.database().ref("ListClass").child(idClass).child("timeTable").child("b" + index).update({ weekday: parseInt(eventKey) }, (err) => {
            if (err) {
                console.log("Co loi khi cap nhat TKB: " + err);
            } else {
                console.log("Thay doi TKB thanh cong");
            }
            this.setState({ isLoading: false })
        })
    }

    renderDropdownRoom = (room, index, idClass) => {
        var roomPlus = ""
        switch (room) {
            case 101:
                roomPlus = "Edumet"
                break;
            case 201:
                roomPlus = "Eduspace"
                break;
            default:
                break;
        }
        return (
            <DropdownButton
                disabled={true}
                bsSize="xsmall"
                title={roomPlus}
                key={"room" + index + idClass}
                id={"room" + index + idClass}
                onSelect={this.onSelectRoom(index, idClass)}
                disabled={this.state.isLoading}
            >
                <MenuItem eventKey="101" active={room === 101}>Edumet</MenuItem>
                <MenuItem eventKey="201" active={room === 201}>Eduspace</MenuItem>

            </DropdownButton>
        );
    }

    onSelectRoom = (index, idClass) => (eventKey, event) => {
        this.setState({ isLoading: true })
        firebase.database().ref("ListClass").child(idClass).child("timeTable").child("b" + index).update({ room: parseInt(eventKey) }, (err) => {
            if (err) {
                console.log("Co loi khi cap nhat TKB: " + err);
            } else {
                console.log("Thay doi TKB thanh cong");
            }
            this.setState({ isLoading: false })
        })

    }

    timeFormatter = (cell, row, rowIndex, formatExtraData) => {
            var timeJSX = []
            var index = 1
            var courses = Object.assign({}, cell)
            while (courses["b" + index] !== undefined) {
                const course = courses["b" + index]
                var start = moment(course.start, "hh:mm")
                var end = moment(course.end, "hh:mm")
                var room = course.room
                var weekday = course.weekday
                // console.log(start.format("hh:mm"))
                timeJSX.push(<TimePicker
                    disabled={true}
                    key={"start" + index + row.idClass}
                    value={start}
                    onChange={this.onCloseTimePicker("start", index, row.idClass)}
                    style={{ maxWidth: "55px" }}
                    showSecond={false}
                    minuteStep={15}
                    disabled={this.state.isLoading}
                />)
                timeJSX.push(<TimePicker
                    disabled={true}
                    key={"end" + index + row.idClass}
                    value={end}
                    onChange={this.onCloseTimePicker("end", index, row.idClass)}
                    style={{ maxWidth: "55px" }}
                    showSecond={false}
                    minuteStep={15}
                    disabled={this.state.isLoading}
                />)
                timeJSX.push(<br key={"br" + index + row.idClass} />)
                timeJSX.push(this.renderDropdownWeekday(weekday, index, row.idClass))
                timeJSX.push(this.renderDropdownRoom(room, index, row.idClass))
                timeJSX.push(<Button bsSize="xs" key={"btn" + index + row.idClass} disabled={this.state.isLoading} onClick={this.onDeleteTimeTable(index, row.idClass, cell, weekday, room)} bsStyle="danger">Xóa</Button>)
                timeJSX.push(<hr key={"hr" + index + row.idClass} style={{ height: "1px", border: "0 none", color: "#A9A9A9", backgroundColor: "#A9A9A9" }} />)
                index++
            }

            return <div>
                {timeJSX}
                <Button bsSize="small" bsStyle="success" onClick={this.props.openAddTimeTable(row.idClass, index)}>Thêm buổi</Button>
            </div>
         

        return <div></div>

    }

    levelFormatter = (cell, row, rowIndex, formatExtraData) => {
        if (row) {
            const level = cell
            return <div>
                <ToggleButtonGroup type="radio" name="options" defaultValue={Number(cell)}>
                    <ToggleButton style={{ width: "80px" }} bsSize="small" onChange={this.onChangeToggleLevel(row)} disabled={this.state.isLoading} value={1}>Khá</ToggleButton>
                    <ToggleButton style={{ width: "80px" }} bsSize="small" onChange={this.onChangeToggleLevel(row)} disabled={this.state.isLoading} value={2}>Trung Bình</ToggleButton>
                </ToggleButtonGroup>
            </div>
        } else {
            return <div>No data</div>
        }

    }

    onChangeToggleLevel = (row) => (event) => {
        console.log(event.target.value)
        this.setState({ isLoading: true })
        firebase.database().ref("ListClass").child(row.idClass).update({ level: parseInt(event.target.value, 10) }, (err) => {
            this.setState({ isLoading: false })
            if (err) {
                console.log(err.message)
            }
        })
    }

    onHideSelectTeacherModal = (event) => {
        this.setState({ showSelectTeacherModal: false })
    }

    actionFormater = (cell, row, rowIndex, formatExtraData) => {
        if (row) {
            return <div style={{ marginTop: "50px" }}>
                <Button bsStyle="danger" onClick={this.handleShowDeleteModal(row)}>Xóa</Button>
            </div>
        } else {
            return <div>No data</div>
        }

    }

    achievementFormatter = (cell, row, rowIndex, formatExtraData) => {
        if (row) {
            return <div style={{ margin: "auto auto" }}>
                <p style={{ whiteSpace: "pre-line", textAlign: "left", borderLeft: "10px" }}>{row.achievement}</p>
            </div>
        } else {
            return <div>No data</div>
        }

    }

    onHideDeleteTeacherModal = (event) => {
        this.setState({ showDeleteTeacherModal: false })
    }

    handleShowDeleteModal = (row) => (event) => {
        this.props.onDeleteClass(row.idClass)
    }

    afterSaveCell(oldValue, newValue, row, column) {
        if (oldValue !== newValue) {
            const classIDRef = firebase.database().ref().child("ListClass").child(row.idClass)
            classIDRef.update(row)
        }

    }

    render() {
        return (
            <BootstrapTable
                keyField="idClass"
                data={this.props.listClasses}
                columns={this.state.columns}
                striped
                hover
                condensed
                cellEdit={cellEditFactory({
                    mode: 'dbclick',
                    afterSaveCell: this.afterSaveCell,
                    blurToSave: true
                })}
            />
        )
    }
}
export default ClassRoomTable;

ClassRoomTable.propTypes = {
    onDeleteClass: PropType.func.isRequired,
    openChooseTeacher: PropType.func.isRequired,
    openAddTimeTable: PropType.func.isRequired,
    isSignedIn: PropType.bool.isRequired,
    listClasses: PropType.array.isRequired,
}