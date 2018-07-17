import React, { Component } from 'react';
import { Button, HelpBlock, FormGroup, ControlLabel, FormControl, Modal } from "react-bootstrap"
import * as firebase from "firebase"
import PropType from "prop-types"

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl bsSize={"small"} componentClass="textarea" {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

class AddTeacherModal extends Component {
    constructor() {
        super()
        this.state = {
            idTeacher: "",
            name: "",
            school: "",
            achievement: ""
        }
    }

    handleTextField = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    defaultLinkAvatar = "https://firebasestorage.googleapis.com/v0/b/react-base-6ef41.appspot.com/o/images%2Ftekken7fr-lucky-chloe-chibi-art.jpg?alt=media&token=cdbe9ad4-7259-47c7-8795-36d40f834985"

    handleAddTeacherBtn = event => {
        const listTeacherRef = firebase.database().ref("ListTeacher")
        listTeacherRef.child(this.state.idTeacher).set({
            idTeacher: this.state.idTeacher,
            name: this.state.name,
            school: this.state.school,
            achievement: this.state.achievement,
            linkAvatar: this.defaultLinkAvatar,
        })

        this.setState({
            idTeacher: "",
            name: "",
            school: "",
            achievement: ""
        })

        this.props.onHide()
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm Giảng Viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div >
                <form style={{
                    width: "75%",
                    maxWidth: "700px",
                    margin: "0 auto",
                    top: "-10px",
                    paddingTop: "20px",
                }}>
                    <FieldGroup
                        value={this.state.idTeacher}
                        id="idTeacher"
                        help="Chu Nam Anh => anhcn, Nguyễn Như Tuấn Mạnh => manhntn"
                        label="Mã Giáo Viên"
                        placeholder="Nhập vào đây"
                        onChange={this.handleTextField}
                    />

                    <FieldGroup
                        value={this.state.name}
                        id="name"
                        help="Chu Nam Anh => anhcn, Nguyễn Như Tuấn Mạnh => manhntn"
                        label="Tên Giáo Viên"
                        placeholder="Nhập vào đây"
                        onChange={this.handleTextField}
                    />

                    <FieldGroup
                    value={this.state.school}
                        id="school"
                        help="Đại học Bách Khoa Hà Nội"
                        label="Trường đại học"
                        placeholder="Nhập vào đây"
                        onChange={this.handleTextField}
                    />

                    <FieldGroup
                    value={this.state.achievement}
                        id="achievement"
                        help="Viết thành gạch đầu dòng (- Thủ khoa Đại học Bách Khoa Hà Nội)"
                        label="Thành Tựu"
                        placeholder="Nhập vào đây"
                        onChange={this.handleTextField}
                    />

                    
                    <p>(Hình ảnh thêm sẽ thêm vào sau)</p>
                </form>


            </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.onHide}>Close</Button>
              <Button bsStyle="success" onClick={this.handleAddTeacherBtn}>Thêm giáo viên</Button>
            </Modal.Footer>
          </Modal>

            
        )
    }
}
export default AddTeacherModal;

AddTeacherModal.propTypes = {
    show: PropType.bool.isRequired,
    onHide: PropType.func.isRequired
    
}