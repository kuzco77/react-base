import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Button, Image, ToggleButtonGroup, ToggleButton } from "react-bootstrap"
import PropType from "prop-types"
import moment from 'moment';
import TimePicker from 'rc-time-picker';
// import 'rc-time-picker/assets/index.css'

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

            value.editable = !(value.dataField === "Action" || value.dataField === "teacher.linkAvatar" || value.dataField === "level") && this.props.isSignedIn

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

    onCloseTimePicker = (type,index,idClass) => (value) => {
        console.log(value.format("hh:mm"))
        // console.log(value, type + index + idClass)
        // this.setState({ [type + index + idClass]: value })

        firebase.database().ref("ListClass").child(idClass).child("timeTable").child("b"+index).child("type").update(String.valueOf(value.format("hh:mm")))
    }

    timeFormatter = (cell, row, rowIndex, formatExtraData) => {
        var timeJSX = []
        var index = 1
        var courses = Object.assign({}, cell)
        // console.log("start" + index + row.idClass);
        

        while (courses["b" + index] !== undefined) {
            const course = courses["b" + index]
            var start = moment(course.start, "hh:mm") 
            var end = moment(course.end, "hh:mm")
            var room = course.room
            var weekday = course.weekday
            // console.log(start.format("hh:mm"))
            timeJSX.push(<TimePicker
                key={"start" + index + row.idClass}
                defaultValue={start}
                onChange={this.onCloseTimePicker("start",index,row.idClass)}
                style={{ maxWidth: "55px" }}
                showSecond={false}
                minuteStep={15}
                disabled={this.state.isLoading}
            />)
            timeJSX.push(<TimePicker
                key={"end" + index + row.idClass}
                defaultValue={end}
                onChange={this.onCloseTimePicker("end",index,row.idClass)}
                style={{ maxWidth: "55px" }}
                showSecond={false}
                minuteStep={15}
                disabled={this.state.isLoading}
            />)
            timeJSX.push(<br key={"br"+index+row.idClass}/>)
            index++
        }
        // var timeArray = cell.split("&")

        // timeArray.forEach((time, index) => {
        //     var hourAndWeekday = time.split("*")
        //     var startAndEndHour = hourAndWeekday[0].split("-")
        //     var startTime = moment(startAndEndHour[0], "hh:mm")
        //     var endTime = moment(startAndEndHour[1], "hh:mm")
        //     console.log("Start time: "+startTime.format("hh:mm")+", End time: "+endTime.format("hh:mm"))

        //     timeJSX.push(<TimePicker 
        //         key={"end"+index+row.idClass} 
        //         value={this.state["end"+index+row.idClass]}
        //         defaultValue={endTime} 
        //         onChange={this.onCloseTimePicker("end"+index+row.idClass)} 
        //         style={{maxWidth: "55px"}} 
        //         defaultValue={endTime} 
        //         showSecond={false} 
        //         minuteStep={15}
        //         />)
        //     timeJSX.push(<br key={"br"+index+cell.idClass}/>)
        // })
        return <div>
            {timeJSX}
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