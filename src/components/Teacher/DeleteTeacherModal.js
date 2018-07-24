import React, { Component } from 'react';
import { Button, HelpBlock, FormGroup, ControlLabel, FormControl, Modal } from "react-bootstrap"
import * as firebase from "firebase"
import PropType from "prop-types"

class DeleteTeacherModal extends Component {
    // componentWillUnmount() {
    //     this.isCancelled = true;
    // }

    handleDeleteTeacher = (row, event) => {
        const listTeacher = firebase.database().ref("ListTeacher")
        listTeacher.child(this.props.idTeacher).remove()
        this.props.onHide()
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header closeButton>
              <Modal.Title>Cảnh báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bạn chuẩn bị xóa giảng viên này khỏi CSDL. Một khi đã xóa sẽ không khôi phục lại được. Bạn có chắc chắn muốn xóa
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.onHide}>No</Button>
              <Button bsStyle="danger" onClick={this.handleDeleteTeacher}>Yes</Button>
            </Modal.Footer>
          </Modal>
        )
    }
}
export default DeleteTeacherModal;

DeleteTeacherModal.propTypes = {
    show: PropType.bool.isRequired,
    onHide: PropType.func.isRequired,
    idTeacher: PropType.string.isRequired,
}