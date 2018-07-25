import React, { Component } from 'react';
import '../App.css';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Modal, Button } from "react-bootstrap"
import firebase from "firebase"
import { stat } from 'fs';

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl bsSize={"small"} componentClass="textarea" {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

class AddClassRoomModal extends Component {
    constructor() {
        super()
        this.state = {
            idClass: "",
            grade: "",
            introClass1: "",
            introClass2: "",
            phoneNumber: "",
            subject: "",
            time: "",
        }
    }

    handleTextField = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    defaultLinkAvatar = "https://firebasestorage.googleapis.com/v0/b/react-base-6ef41.appspot.com/o/images%2Ftekken7fr-lucky-chloe-chibi-art.jpg?alt=media&token=cdbe9ad4-7259-47c7-8795-36d40f834985"
    defaultTeacher = {
        idTeacher: "edumet",
        name: "EDUMET",
        school: "Đại học Bách khoa Hà Nội",
        achievement: "26 điểm đại học",
        linkAvatar: this.defaultLinkAvatar,
    }


    handleAddClassBtn = event => {
        const listClassRef = firebase.database().ref("ListClass")
        listClassRef.child(this.state.idClass).set({
            idClass: this.state.idClass,
            grade: this.state.grade,
            introClass1: this.state.introClass1,
            introClass2: this.state.introClass2,
            phoneNumber: this.state.phoneNumber,
            subject: this.state.subject,
            time: this.state.time,
            timeCreate: firebase.database.ServerValue.TIMESTAMP,
            teacher: this.defaultTeacher
        })

        this.setState({
            idClass: "",
            grade: "",
            introClass1: "",
            introClass2: ""
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
                    <Modal.Title>Thêm Lớp Học</Modal.Title>
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
                                value={this.state.idClass}
                                id="idClass"
                                help="Hóa => hoa cho lớp 10, thêm nữa thì hoa1"
                                label="Mã Lớp Học"
                                placeholder="Nhập vào đây"
                                onChange={this.handleTextField}
                            />

                            <FieldGroup
                                value={this.state.grade}
                                id="grade"
                                help="Chỉ ghi số => '12'"
                                label="Lớp"
                                placeholder="Nhập vào đây"
                                onChange={this.handleTextField}
                            />

                            <FieldGroup
                                value={this.state.introClass1}
                                id="introClass1"
                                help="VD: - Dành cho học sinh khá, giỏi"
                                label="Giới thiệu 1"
                                placeholder="Nhập vào đây"
                                onChange={this.handleTextField}
                            />

                            <FieldGroup
                                value={this.state.introClass2}
                                id="introClass2"
                                help="VD: - Số học sinh: 4"
                                label="Giới thiệu 2"
                                placeholder="Nhập vào đây"
                                onChange={this.handleTextField}
                            />

                            <FieldGroup
                                value={this.state.phoneNumber}
                                id="phoneNumber"
                                help="VD: - Số học sinh: 4"
                                label="Số điện thoại"
                                placeholder="Nhập vào đây"
                                onChange={this.handleTextField}
                            />

                            <FieldGroup
                                value={this.state.subject}
                                id="subject"
                                help="VD: - Môn Hóa"
                                label="Môn học"
                                placeholder="Nhập vào đây"
                                onChange={this.handleTextField}
                            />

                            <FieldGroup
                                value={this.state.time}
                                id="time"
                                help="VD: - 14h T2-T6"
                                label="Thời gian học"
                                placeholder="Nhập vào đây"
                                onChange={this.handleTextField}
                            />

                            <p>(Người dạy sẽ thêm vào sau)</p>
                        </form>


                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                    <Button bsStyle="success" onClick={this.handleAddClassBtn}>Thêm lớp học</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default AddClassRoomModal