import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { Button, Image, Well } from "react-bootstrap"
import FileUploader from "react-firebase-file-uploader";
import PropType from "prop-types"

class RegisterTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teacherID: "",
        }
        const columns = [{
            dataField: "name",
            text: "Tên học sinh",
            headerStyle: {
                width: "7%",
            }
        }, {
            dataField: "classSchool",
            text: "Trường",
            headerStyle: {
                width: "10%",
            }
        }, {
            dataField: "goal",
            text: "Mục tiêu",
            headerStyle: {
                width: "10%",
            }
        }, {
            dataField: "studyForce",
            text: "Học lực",
            headerStyle: {
                width: "10%",
            }
        }, {
            dataField: "phoneNumber",
            text: "Số Điện Thoại",
            headerStyle: {
                width: "7%",
            }
        }, {
            dataField: "parentPhone",
            text: "Phụ huynh",
            headerStyle: {
                width: "7%",
            }
        }, {
            dataField: "email",
            text: "Email",
            headerStyle: {
                width: "10%",
            },
            formatter: this.emailFormatter,
        }, {
            dataField: "registerClass.idClass",
            text: "Lớp đăng ký",
            headerStyle: {
                width: "5%",
            },
        }, {
            dataField: "registerClass.teacher.linkAvatar",
            text: "Giáo viên",
            formatter: this.linkAvatarFormatter,
            headerStyle: {
                width: "12%",
            }
        }, {
            dataField: "timeSend",
            text: "Thời gian gửi",
            headerStyle: {
                width: "10%",
            }
        }, {
            dataField: "Action",
            text: "Action",
            formatter: this.actionFormater,
            headerStyle: {
                width: "7%",
            },
        }];

        columns.forEach((value, index) => {

            value.editor = {
                type: "textarea",
            }

            Object.assign(value.headerStyle, { textAlign: "center" })
            value.editable = !(value.dataField === "linkAvatar" || value.dataField === "Action") && this.props.isSignedIn

        })

        this.state.columns = columns
    }

    linkAvatarFormatter = (cell, row, rowIndex, formatExtraData) => {
        return <div>
            <Image id="target" src={cell} height={100} width={100} circle={true} /><br/>
            <p>{row.registerClass.teacher.name}</p>
        </div>
    }

    actionFormater = (cell, row, rowIndex, formatExtraData) => {
        const registerData = row
        return <div style={{ margin: "auto auto" }}>
            <Button style={{ marginTop: "25%" }} bsStyle="danger" onClick={this.props.onDeleteRegister(row.idRegister)}>Delete</Button>
            <Button bsStyle="success" onClick={this.props.onAcceptRegister(registerData)}>Accept</Button>
        </div>
    }

    afterSaveCell = (oldValue, newValue, row, column) => {
        if (oldValue !== newValue) {
            const teacherIDRef = firebase.database().ref().child("ListRegisterClass").child(row.idRegister)
            teacherIDRef.update(row)
        }


    }

    emailFormatter = (cell, row, rowIndex, formatExtraData) => {
        var gmailArray = cell.split("@", 2)
            return <div>
            <p>{gmailArray[0]}</p><br/>
            <p>@{gmailArray[1]}</p>
        </div>
        
    }

    render() {
        return (
            <BootstrapTable
                keyField="idRegister"
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
export default RegisterTable;

RegisterTable.propTypes = {
    isSignedIn: PropType.bool.isRequired,
    onDeleteRegister: PropType.func.isRequired,
    onAcceptRegister: PropType.func.isRequired,
    products: PropType.array.isRequired,
}