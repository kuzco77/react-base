import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { Button, Image, Modal } from "react-bootstrap"
import FileUploader from "react-firebase-file-uploader";
import PropType from "prop-types"
import DeleteTeacherModal from './DeleteTeacherModal';
import NewHeader from "../Header/NewHeader"

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
        this.state.columns = [{
            dataField: "idTeacher",
            text: "Mã Giáo Viên",
            headerStyle: {
                width: "100px",
                textAlign: "center",
            }
        }, {
            dataField: "name",
            text: "Tên Giáo Viên",
            headerStyle: {
                width: "120px",
                textAlign: "center",
            }
        }, {
            dataField: "school",
            text: "Trường",
            headerStyle: {
                width: "120px",
                textAlign: "center",
            }
        }, {
            dataField: "achievement",
            text: "Thành Tựu",
            headerStyle: {
                textAlign: "center",
            }

        }, {
            dataField: "linkAvatar",
            text: "Avatar",
            formatter: this.imageFormatter,
            editable: false,
            headerStyle: {
                width: "120px",
                textAlign: "center",
            }
        }, {
            dataField: "Action",
            text: "Action",
            formatter: this.deleteFormater,
            editable: false,
            headerStyle: {
                width: "100px",
                textAlign: "center",
            }
        }];
    }

    imageFormatter = (cell, row, rowIndex, formatExtraData) => {
        return <div>
            <Image id="target" src={cell} height={100} width={100} circle={true} /><br />
            <label style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor' }}>
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

            console.log(snaps.val())
            this.setState({ products: newProducts })
        })
    }

    onHideDeleteTeacherModal = (event) => {
        this.setState({ showDeleteTeacherModal: false })
    }


    deleteFormater = (cell, row, rowIndex, formatExtraData) => {
        return <div style={{ margin: "auto auto" }}>
            <Button bsStyle="danger" onClick={this.handleShowDeleteModal.bind(this, row)}>Delete</Button>
            <DeleteTeacherModal
                show={this.state.showDeleteTeacherModal}
                onHide={this.onHideDeleteTeacherModal} 
                idTeacher={row["idTeacher"]} 
            />
        </div>
    }

    handleShowDeleteModal = (row, event) => {
        this.setState({ showDeleteTeacherModal: true })
    }

    afterSaveCell(oldValue, newValue, row, column) {
        const teacherIDRef = firebase.database().ref().child("ListTeacher").child(row["idTeacher"])
        teacherIDRef.set(row)

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
                    afterSaveCell: this.afterSaveCell
                })}
            />
        )
    }
}
export default TeacherTable;

TeacherTable.propTypes = {
    searchTeacherID: PropType.string
}