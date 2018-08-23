import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { Button, Image, Well } from "react-bootstrap"
import FileUploader from "react-firebase-file-uploader";
import PropType from "prop-types"

class TeacherTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teacherID: "",
            isUploading: false,
            progress: 0,
            showDeleteTeacherModal: false,
            idTeacherOfDeleteModal: ""
        }

        this.state.products = [];
        const columns = [{
            dataField: "idTeacher",
            text: "Mã Giáo Viên",
            headerStyle: {
                width: "5%",
            },
        }, {
            dataField: "name",
            text: "Tên Giáo Viên",
            headerStyle: {
                width: "7%",
            }
        }, {
            dataField: "school",
            text: "Trường",
            headerStyle: {
                width: "10%",
            }
        }, {
            dataField: "achievement",
            text: "Thành Tựu",
            headerStyle: {},
            editor: {
                type: "textarea",

            },
            editorStyle: {
                height: "120px"
            },
            formatter: this.achievementFormatter
        }, {
            dataField: "phoneNumber",
            text: "Số Điện Thoại",
            headerStyle: {
                width: "10%",
            }
        }, {
            dataField: "gmail",
            text: "Gmail",
            headerStyle: {
                width: "10%",
            },
            formatter: this.gmailFormatter
        }, {
            dataField: "linkAvatar",
            text: "Avatar",
            formatter: this.linkAvatarFormatter,
            headerStyle: {
                width: "12%",
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

    gmailFormatter = (cell, row, rowIndex, formatExtraData) => {
        var gmailArray = cell.split("@", 2)

        
        if (gmailArray[1] === "gmail.com") {
            return <div>
            <p>{gmailArray[0]}</p>
        </div>
        } else {
            return <div>
            <p>Gmail khong dung dinh dang</p>
        </div>
        }
        
    }

    linkAvatarFormatter = (cell, row, rowIndex, formatExtraData) => {
        return <div>
            <Image id="target" src={cell} height={100} width={100} circle={true} /><br />
            <label style={{
                backgroundColor: 'steelblue',
                color: 'white',
                padding: 10,
                borderRadius: 4,
                pointer: 'cursor',
                marginTop: "5px",
                marginBottom: "5px"
            }}>
                Edit
            <FileUploader
                    hidden
                    accept="image/*"
                    storageRef={firebase.storage().ref('images')}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess(row)}
                    onProgress={this.handleProgress}
                    maxHeight={400}
                    maxWidth={400}
                />
            </label>
        </div>
    }

    actionFormater = (cell, row, rowIndex, formatExtraData) => {
        return <div style={{ margin: "auto auto" }}>
            <Button style={{ marginTop: "50%" }} bsStyle="danger" onClick={this.props.onDeleteTeacher(row)}>Delete</Button>
        </div>
    }

    achievementFormatter = (cell, row, rowIndex, formatExtraData) => {
        return <div style={{ margin: "auto auto" }}>
            <p style={{ whiteSpace: "pre-line", textAlign: "left", borderLeft: "10px" }}>{row.achievement}</p>
        </div>
    }


    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };
    handleUploadSuccess = (row) => (filename) => {
        this.setState({ avatar: filename, progress: 100, isUploading: false });
        firebase
            .storage()
            .ref("images")
            .child(filename)
            .getDownloadURL()
            .then(this.setAvatarLink.bind(this, row));
    };

    setAvatarLink = (row, url) => {
        console.log(url, row)
        const teacherIDRef = firebase.database().ref().child("ListTeacher").child(row["idTeacher"]).child("linkAvatar")
        teacherIDRef.set(url)
    }

    onHideDeleteTeacherModal = (event) => {
        this.setState({ showDeleteTeacherModal: false })
    }

    handleShowDeleteModal = (row) => (event) => {
        this.setState({
            showDeleteTeacherModal: true,
            idTeacherOfDeleteModal: row.idTeacher
        })
    }

    afterSaveCell(oldValue, newValue, row, column) {
        if (oldValue !== newValue) {
            const teacherIDRef = firebase.database().ref().child("ListTeacher").child(row["idTeacher"])
            teacherIDRef.update(row)
            const teacherInListClassRef = firebase.database().ref().child("ListClass").orderByChild("teacher/idTeacher").equalTo(row.idTeacher)
            teacherInListClassRef.once("value", (snaps) => {
                snaps.forEach((snap) => {
                    // teacherRefsThatNeedToChange.push(snap.ref.child("teacher"))
                    snap.ref.child("teacher").update(row, (error) => {
                        if (error) {
                            console.log("Co loi khi cap nhat thong tin giao vien")
                        } else {
                            console.log("Cap nhat thong tin giao vien thanh cong")
                        }
                    })
                })

            })
        }


    }

    render() {
        return (
            <BootstrapTable
                keyField="idTeacher"
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
export default TeacherTable;

TeacherTable.propTypes = {
    isSignedIn: PropType.bool.isRequired,
    onDeleteTeacher: PropType.func.isRequired,
    products: PropType.array.isRequired,
}