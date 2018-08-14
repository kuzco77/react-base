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


    convertNameToID = (oldName, callback) => {
        // Convert nhu binh thuong
        var aliasString = this.changeAlias(oldName)
        var hoVaTenArray = aliasString.split(" ")
        var ketqua = hoVaTenArray.pop()
        const hoVaTenDemArray = hoVaTenArray
        hoVaTenDemArray.forEach((word) => {
            ketqua += word.charAt(0)
        })

        console.log("Ket qua vua moi ra lo: " + ketqua)


        const teacherRef = firebase.database().ref("ListTeacher").orderByKey().startAt(ketqua).endAt(ketqua + '\uf8ff')
        teacherRef.once("value", (snaps) => {
            if (!snaps.exists()) {
                if (typeof callback === "function") callback(ketqua + "1")
            } else {
                var allTeacherIDNumber = []
                snaps.forEach((snap) => {
                    var lastIDTeacher = snap.val().idTeacher
                    const number = Number(lastIDTeacher.slice(ketqua.length, ketqua.length + 1))
                    allTeacherIDNumber.push(number)

                    if (allTeacherIDNumber.length >= snaps.numChildren()) {
                        const rightNumber = this.findSmallestMissingNumberFromSortedArray(allTeacherIDNumber)
                        if (typeof callback === "function") callback(ketqua + String(rightNumber))
                    }
                })
            }

        }

        )

    }

    findSmallestMissingNumberFromSortedArray = (array) => {
        var index = 1
        while (index === array.shift()) {
            index += 1
        }
        return index
    }

    changeAlias = (alias) => {
        var str = alias;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");
        str = str.trim();
        return str;
    }

    handleAddTeacherBtn = event => {

        this.convertNameToID(this.state.name, (result) => {
            const listTeacherRef = firebase.database().ref("ListTeacher")
            listTeacherRef.child(result).set({
                idTeacher: result,
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
        })


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
                                placeholder="Mã giáo viên sẽ tự sinh"
                                onChange={this.handleTextField}
                                disabled={true}
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