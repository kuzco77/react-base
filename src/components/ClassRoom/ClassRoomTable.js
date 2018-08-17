import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { Button, Image, Well } from "react-bootstrap"
import PropType from "prop-types"
import DeleteClassRoomModal from "./DeleteClassRoomModal"
import SelectTeacherForClassRoomModal from "./SelectTeacherForClassRoomModal"

class ClassRoomTable extends Component {
    constructor() {
        super()
        this.state = {
            teacherID: "",
            isUploading: false,
            progress: 0,
            showAddClassRoomModal: false,
            showSelectTeacherModal: false,
            showDeleteTeacherModal: false,
            idClassOfSelectedTeacherModal: "",
        }

        this.state.products = [];
        const columns = [{
            dataField: "idClass",
            text: "Mã Lớp Học",
            headerStyle: {
                width: "10%",
                
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
        },{
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
            Object.assign(value.headerStyle, {textAlign: "center"})
        })

        this.state.columns = columns
    }

    handleChangeBtn = (row, event) => {
        console.log("Neu yeu thuong nguoi sau, thi xin em cx dung quen ten anh")
        this.setState({
            showSelectTeacherModal: true,
            idClassOfSelectedTeacherModal: row.idClass
        })
    }

    avatarFormater = (cell, row, rowIndex, formatExtraData) => {
        const teacher = row.teacher
        const nameTeacher = teacher.name
        return <div>
            <Image id="target" src={cell} height={100} width={100} circle={true} /><br />
            <p>{nameTeacher}</p>
            <Button style={{marginTop: "0px", marginBottom: "5px"}} bsStyle="info" onClick={this.handleChangeBtn.bind(this, row)}>
            Thay doi
            </Button>
            <SelectTeacherForClassRoomModal
                show={this.state.showSelectTeacherModal}
                onHide={this.onHideSelectTeacherModal}
                idClass={this.state.idClassOfSelectedTeacherModal}
            />
        </div>
    }

    onHideSelectTeacherModal = (event) => {
        this.setState({showSelectTeacherModal: false})
    }

    actionFormater = (cell, row, rowIndex, formatExtraData) => {
        return <div style={{ margin: "auto auto" }}>
            <Button bsStyle="danger" onClick={this.handleShowDeleteModal.bind(this, row)}>Delete</Button>
            <DeleteClassRoomModal
                show={this.state.showDeleteTeacherModal}
                onHide={this.onHideDeleteTeacherModal}
                idClass={row.idClass}
            />
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

    componentDidMount() {

        var classRef = firebase.database().ref().child("ListClass")

        classRef.on("value", snaps => {
            const newProducts = []
            snaps.forEach(snap => {
                newProducts.push(snap.val())
            })
            this.setState({ products: newProducts })
        })

    }

    onHideDeleteTeacherModal = (event) => {
        this.setState({ showDeleteTeacherModal: false })
    }

    handleShowDeleteModal = (row, event) => {
        this.setState({ showDeleteTeacherModal: true })
    }

    afterSaveCell(oldValue, newValue, row, column) {
        const classIDRef = firebase.database().ref().child("ListClass").child(row.idClass)
        classIDRef.update(row)
    }

    render() {
        return (
            <BootstrapTable
                keyField="idClass"
                data={this.state.products}
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
    searchTeacherID: PropType.string
}