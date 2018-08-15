import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { Button, Image, Well } from "react-bootstrap"
import FileUploader from "react-firebase-file-uploader";
import PropType from "prop-types"
import DeleteTeacherModal from './DeleteTeacherModal';

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
                textAlign: "center",
            }
        },{
            dataField: "linkAvatar",
            text: "Avatar",
            formatter: this.avatarFormater,
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

            Object.assign(value.headerStyle, {textAlign: "center"})
            value.push = {editable: !(index === 4 || index === 5) && this.props.isSignedIn} 

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

        const listClassRef = firebase.database().ref("ListClass")
        listClassRef.once("value", (snaps) => {
            var allClass = snaps.val()
            var index = 0 
            snaps.forEach((snap) => {
                var oldClass = snap.val()
                var oldTeacher = oldClass.teacher
                if (oldTeacher.idTeacher === row.idTeacher) {
                    oldClass.teacher = row
                    allClass[oldClass.idClass] = oldClass
                }

                if (index >= snaps.numChildren() - 1) {
                    console.log("Thay doi teacher trong list class")
                    listClassRef.set(allClass, (err) => {
                        if (err) {
                            console.log(err.message);
                            
                        }
                    })
                }
                
                index += 1
            })
        })
    

        // const teacherInListClassRef = firebase.database().ref().child("ListClass").orderByChild("teacher/idTeacher").equalTo(row.idTeacher)
        // const teacherRefsThatNeedToChange = []
        // teacherInListClassRef.once("value", (snaps) => {
        //     snaps.forEach((snap) => {
        //         // teacherRefsThatNeedToChange.push(snap.ref.child("teacher"))
        //         snap.ref.child("teacher").set(row, (error) => {
        //             if (error) {
        //                 console.log("Co loi khi cap nhat thong tin giao vien")
        //             } else {
        //                 console.log("Cap nhat thong tin giao vien thanh cong")
        //             }
        //         })
        //     })

        // })

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
    searchTeacherID: PropType.string,
    isSignedIn: PropType.bool.isRequired
}