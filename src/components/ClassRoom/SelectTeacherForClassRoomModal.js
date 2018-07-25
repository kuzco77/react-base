import React, { Component } from 'react';
import * as firebase from "firebase"
import BootstrapTable from "react-bootstrap-table-next"
import { Button, Image, Modal} from "react-bootstrap"
import PropType from "prop-types"

class SelectTeacherForClassRoomModal extends Component {
    constructor() {
        super()
        this.state = {
            teacherID: "",
            isUploading: false,
            progress: 0,
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
            dataField: "linkAvatar",
            text: "Avatar",
            formatter: this.avatarFormater,
            editable: false,
            headerStyle: {
                width: "12%",
                textAlign: "center",
            }
        }, {
            dataField: "select",
            text: "Select",
            formatter: this.selectFormatter,
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
        </div>
    }

    selectFormatter = (cell, row, rowIndex, formatExtraData) => {
        return <div>
            <Button style={{marginTop: "25px"}} bsStyle="primary" onClick={this.handleAddTeacher.bind(this, row)}>Select</Button>
        </div>
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

    handleAddTeacher = (row, event) => {
        
        const classRef = firebase.database().ref().child("ListClass").child(this.props.idClass).child("teacher")
        // classRef.once("value", (snap) => {
        //     console.log("teacher before change",snap.val())
        //     console.log("teacher after change", row)
        // })
        classRef.set(row)
        this.props.onHide()
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm Giảng Viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form className="App">
                <BootstrapTable
                keyField="idTeacher"
                data={this.state.products}
                columns={this.state.columns}
                striped
                hover
                condensed
            />
            </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
            
            
        )
    }
}

export default SelectTeacherForClassRoomModal

SelectTeacherForClassRoomModal.propTypes = {
    show: PropType.bool.isRequired,
    onHide: PropType.func.isRequired,
    idClass: PropType.string.isRequired,

}