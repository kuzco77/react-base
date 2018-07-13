import React, { Component } from 'react';
import IntroTitle from "./IntroTitle"
import { Button, HelpBlock, FormGroup, ControlLabel, FormControl, ListGroup, ListGroupItem, Image } from "react-bootstrap"
import * as firebase from "firebase"
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

class AddTeacher extends Component {
    constructor() {
        super()
        this.state = {
            idTeacher: "",
            name: "",
            school: "",
            achievement: ""
        }
    }

    render() {
        return (
            <div >
                <IntroTitle />
                <form style={{
                    width: "75%",
                    maxWidth: "700px",
                    margin: "0 auto",
                    top: "-10px"
                }}>
                    <FieldGroup
                        value={this.state.idTeacher}
                        id="idTeacher"
                        help="Chu Nam Anh => anhcn, Nguyễn Như Tuấn Mạnh => manhntn"
                        label="Mã Giáo Viên"
                        placeholder="Nhập vào đây"
                    />


                    <FieldGroup
                        value={this.state.name}
                        id="name"
                        help="Chu Nam Anh => anhcn, Nguyễn Như Tuấn Mạnh => manhntn"
                        label="Tên Giáo Viên"
                        placeholder="Nhập vào đây"
                    />

                    <FieldGroup
                    value={this.state.school}
                        id="school"
                        help="Đại học Bách Khoa Hà Nội"
                        label="Trường đại học"
                        placeholder="Nhập vào đây"
                    />

                    <FieldGroup
                    value={this.state.achievement}
                        id="achievement"
                        help="Viết thành gạch đầu dòng (- Thủ khoa Đại học Bách Khoa Hà Nội)"
                        label="Mã Giáo Viên"
                        placeholder="Nhập vào đây"
                    />

                    <Button style={{margin: "0 auto"}} bsStyle="success">Thêm giáo viên</Button>
                    <p>(Hình ảnh thêm sẽ thêm vào sau)</p>
                </form>


            </div>
        )
    }
}
export default AddTeacher;