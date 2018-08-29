import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Button, Image, ToggleButtonGroup, ToggleButton, DropdownButton, MenuItem } from "react-bootstrap"
import PropType from "prop-types"
import moment from 'moment';
import TimePicker from 'rc-time-picker';

function renderDropdownButton(weekday, index, idClass) {
    return (
        <DropdownButton
            title={weekday}
            key={"dd" + index + idClass}
            id={"dd" + index + idClass}
            onSelect={onSelectDropDown}
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

function onSelectDropDown(eventKey, event) {
    
}

class ClassRoomTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teacherID: "",
            isUploading: false,
            progress: 0,
            isLoading: false,
        }

        this.state.products = [];
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
                width: "7%",
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

    handleChangeBtn = (row) => (event) => {
        this.props.onChooseTeacher(row.idClass)
    }

    avatarFormater = (cell, row, rowIndex, formatExtraData) => {
        if (row) {
            const teacher = row.teacher
            const nameTeacher = teacher.name
            return <div>
                <Image id="target" src={cell} height={100} width={100} circle={true} /><br />
                <p>{nameTeacher}</p>
                <Button style={{ marginTop: "0px", marginBottom: "5px" }} bsStyle="info" onClick={this.handleChangeBtn(row)}>
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

    onAddDefaultTimeTable = (index, idClass) => () => {
        this.setState({ isLoading: true })
        firebase.database().ref("ListClass").child(idClass).child("timeTable").child("b" + index).update({
            start: "7:00",
            end: "9:00",
            room: 101,
            weekday: 2,
        }, (err) => {
            if (err) {
                console.log("Co loi xay ra khi them thoi khoa bieu mac dinh");
                console.log(err.message);
                this.setState({ isLoading: false })
            } else {
                console.log("Them thoi khoa bieu mac dinh thanh cong");
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

    onDeleteTimeTable = (index, idClass, cell) => (event) => {
        this.setState({ isLoading: true })
        var timeTableRef = firebase.database().ref("ListClass").child(idClass).child("timeTable")
        var lastIndex = this.getTheLastIndex(index, cell)

        console.log("the last index is: " + lastIndex);
        if (lastIndex === index) {
            timeTableRef.child("b" + lastIndex).remove((err) => {
                if (err) {
                    console.log("Co loi khi xoa TKB: " + err.message);
                } else {
                    console.log("Xoa TKB thanh cong");
                }
            })
        } else {
            timeTableRef.child("b" + lastIndex).once("value", (snap) => {
                timeTableRef.update({ ["b" + index]: snap.val() })
                snap.ref.remove((err) => {
                    if (err) {
                        console.log("Co loi khi xoa TKB: " + err.message);
                    } else {
                        console.log("Xoa TKB thanh cong");
                    }
                })
            })
        }
        this.setState({ isLoading: false })


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
                key={"start" + index + row.idClass}
                value={start}
                onChange={this.onCloseTimePicker("start", index, row.idClass)}
                style={{ maxWidth: "55px" }}
                showSecond={false}
                minuteStep={15}
                disabled={this.state.isLoading}
            />)
            timeJSX.push(<TimePicker
                key={"end" + index + row.idClass}
                value={end}
                onChange={this.onCloseTimePicker("end", index, row.idClass)}
                style={{ maxWidth: "55px" }}
                showSecond={false}
                minuteStep={15}
                disabled={this.state.isLoading}
            />)
            timeJSX.push(<Button bsSize="xs" key={"btn" + index + row.idClass} disabled={this.state.isLoading} onClick={this.onDeleteTimeTable(index, row.idClass, cell)} bsStyle="danger">X</Button>)
            timeJSX.push(renderDropdownButton(weekday, index, row.idClass))
            timeJSX.push(<br key={"br" + index + row.idClass} />)
            index++
        }

        return <div>
            {timeJSX}
            <Button bsStyle="success" onClick={this.onAddDefaultTimeTable(index, row.idClass)}>+</Button>
        </div>
    }

    levelFormatter = (cell, row, rowIndex, formatExtraData) => {
        if (row) {
            const level = cell
            return <div>

                <ToggleButtonGroup type="radio" name="options" defaultValue={Number(cell)}>
                    <ToggleButton onChange={this.onChangeToggleLevel(row)} disabled={this.state.isLoading} value={1}>Khá</ToggleButton>
                    <ToggleButton onChange={this.onChangeToggleLevel(row)} disabled={this.state.isLoading} value={2}>Trung Bình</ToggleButton>
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
                <Button bsStyle="danger" onClick={this.handleShowDeleteModal(row)}>Delete</Button>
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

    setAvatarLink = (row, url) => {
        console.log(url, row)
        const teacherIDRef = firebase.database().ref().child("ListTeacher").child(row["idTeacher"]).child("linkAvatar")
        teacherIDRef.set(url)
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
                data={this.props.products}
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
    onChooseTeacher: PropType.func.isRequired,
    isSignedIn: PropType.bool.isRequired,
    products: PropType.array.isRequired,
}