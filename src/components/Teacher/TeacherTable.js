import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { Button, Image, Well } from "react-bootstrap"
import FileUploader from "react-firebase-file-uploader";
import PropType from "prop-types"
import DeleteTeacherModal from './DeleteTeacherModal';

class TeacherTable extends Component {
    constructor() {
        super()
        this.state = {
            teacherID: "",
            isUploading: false,
            progress: 0,
            showDeleteTeacherModal: false,
        }

        this.state.products = [];
        const columns = [{
            dataField: "idTeacher",
            text: "Mã Giáo Viên",
            headerStyle: {
                width: "5%",
                textAlign: "center",
            }
        }, {
            dataField: "name",
            text: "Tên Giáo Viên",
            headerStyle: {
                width: "7%",
                textAlign: "center",
            }
        }, {
            dataField: "school",
            text: "Trường",
            headerStyle: {
                width: "10%",
                textAlign: "center",
            }
        }, {
            dataField: "achievement",
            text: "Thành Tựu",
            headerStyle: {
                textAlign: "center",
            },
            editor: {
                type: "textarea",

            },
            editorStyle: {
                height: "120px"
            },
            formatter: this.achievementFormatter
        }, {
            dataField: "linkAvatar",
            text: "Avatar",
            formatter: this.avatarFormater,
            editable: false,
            headerStyle: {
                width: "12%",
                textAlign: "center",
            }
        }, {
            dataField: "Action",
            text: "Action",
            formatter: this.actionFormater,
            editable: false,
            headerStyle: {
                width: "7%",
                textAlign: "center",
            },
        }];

        columns.forEach((value, index) => {

            value.editor = {
                type: "textarea",
            }
        })

        this.state.columns = columns
    }

    avatarFormater = (cell, row, rowIndex, formatExtraData) => {
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
                    onUploadSuccess={this.handleUploadSuccess.bind(this, row)}
                    onProgress={this.handleProgress}
                    maxHeight={400}
                    maxWidth={400}
                />
            </label>
        </div>
    }

    actionFormater = (cell, row, rowIndex, formatExtraData) => {
        return <div style={{ margin: "auto auto" }}>
            <Button style={{marginTop: "50%"}} bsStyle="danger" onClick={this.handleShowDeleteModal.bind(this, row)}>Delete</Button>
            <DeleteTeacherModal
                show={this.state.showDeleteTeacherModal}
                onHide={this.onHideDeleteTeacherModal}
                idTeacher={this.state.idTeacherOfDeleteModal}
            />
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
    handleUploadSuccess = (row, filename) => {
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

    componentDidMount() {

        var teacherIDRef = firebase.database().ref().child("ListTeacher")
        if (this.state.searchTeacherID !== "") {
            teacherIDRef = teacherIDRef.orderByChild("idTeacher").startAt(this.state.searchTeacherID).endAt(this.state.searchTeacherID + "\uf8ff")
        }


        teacherIDRef.on("value", snaps => {
            const newProducts = []
            snaps.forEach(snap => {
                newProducts.push(snap.val())
            })
            this.setState({ products: newProducts })
        })

        // const teacherInListClassRef = firebase.database().ref().child("ListClass").orderByChild("phoneNumber").equalTo("01696182359")

        // teacherInListClassRef.once("value", (snaps) => {

        //     console.log("Snapsu la",snaps.val())
        //     var TT = {}
        //     snaps.forEach((snap) => {
        //         console.log("Snap/teacher la", snap.child("teacher").val())
        //         TT = snap.child("teacher").val()
        //     })

        //     firebase.database().ref().child("ListTeacher").child("TT").set(TT)

        // })

    }

    onHideDeleteTeacherModal = (event) => {
        this.setState({ showDeleteTeacherModal: false })
    }




    handleShowDeleteModal = (row, event) => {
        this.setState({ showDeleteTeacherModal: true,
            idTeacherOfDeleteModal: row.idTeacher })
    }

    afterSaveCell(oldValue, newValue, row, column) {
        const teacherIDRef = firebase.database().ref().child("ListTeacher").child(row["idTeacher"])
        teacherIDRef.set(row)

        const teacherInListClassRef = firebase.database().ref().child("ListClass").orderByChild("teacher/idTeacher").equalTo(row.idTeacher)
        const teacherRefsThatNeedToChange = []
        teacherInListClassRef.once("value", (snaps) => {
            snaps.forEach((snap) => {
                // teacherRefsThatNeedToChange.push(snap.ref.child("teacher"))
                snap.ref.child("teacher").set(row, (error) => {
                    if (error) {
                        console.log("Co loi khi cap nhat thong tin giao vien")
                    } else {
                        console.log("Cap nhat thong tin giao vien thanh cong")
                    }
                })
            })

        })

    }

    render() {
        return (
            <BootstrapTable
                keyField="idTeacher"
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
export default TeacherTable;

TeacherTable.propTypes = {
    searchTeacherID: PropType.string
}