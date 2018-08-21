import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Button, Image, ToggleButtonGroup, ToggleButton } from "react-bootstrap"
import PropType from "prop-types"

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
            dataField: "time",
            text: "Thời gian",
            headerStyle: {
                width: "7%",
            }
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

        const teacher = row.teacher
        const nameTeacher = teacher.name
        return <div>
            <Image id="target" src={cell} height={100} width={100} circle={true} /><br />
            <p>{nameTeacher}</p>
            <Button style={{ marginTop: "0px", marginBottom: "5px" }} bsStyle="info" onClick={this.handleChangeBtn(row)}>
                Thay doi
            </Button>
        </div>
    }

    levelFormatter = (cell, row, rowIndex, formatExtraData) => {
        const level = cell
        return <div>

            <ToggleButtonGroup type="radio" name="options" defaultValue={Number(cell)}>
                <ToggleButton onChange={this.onChangeToggleLevel(row)} disabled={this.state.isLoading} value={1}>Khá</ToggleButton>
                <ToggleButton onChange={this.onChangeToggleLevel(row)} disabled={this.state.isLoading} value={2}>Trung Bình</ToggleButton>
            </ToggleButtonGroup>
        </div>
    }

    onChangeToggleLevel = (row) => (event) => {
        console.log(event.target.value)
        this.setState({ isLoading: true })
        const classRef = firebase.database().ref("ListClass").child(row.idClass).update({ level: event.target.value }, (err) => {
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
        return <div style={{ marginTop: "50px" }}>
            <Button bsStyle="danger" onClick={this.handleShowDeleteModal(row)}>Delete</Button>
        </div>
    }

    achievementFormatter = (cell, row, rowIndex, formatExtraData) => {
        return <div style={{ margin: "auto auto" }}>
            <p style={{ whiteSpace: "pre-line", textAlign: "left", borderLeft: "10px" }}>{row.achievement}</p>
        </div>
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