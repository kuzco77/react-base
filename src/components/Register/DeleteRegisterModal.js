import React, { Component } from 'react';
import { Button, Modal } from "react-bootstrap"
import * as firebase from "firebase"
import PropType from "prop-types"

class DeleteRegisterModal extends Component {

    onDeleteRegister = () => {
        const listTeacher = firebase.database().ref("ListRegisterClass")
        console.log("DeleteRegisterModel: idTeacher ", this.props.idRegister)
        listTeacher.child(this.props.idRegister).remove()
        this.props.onHide()
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header closeButton>
              <Modal.Title>Cảnh báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bạn chuẩn bị xóa đăng ký này khỏi CSDL. Một khi đã xóa sẽ không khôi phục lại được. Bạn có chắc chắn muốn xóa
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.onHide}>No</Button>
              <Button bsStyle="danger" onClick={this.onDeleteRegister}>Yes</Button>
            </Modal.Footer>
          </Modal>
        )
    }
}
export default DeleteRegisterModal;

DeleteRegisterModal.propTypes = {
    show: PropType.bool.isRequired,
    onHide: PropType.func.isRequired,
    idRegister: PropType.string.isRequired,
}