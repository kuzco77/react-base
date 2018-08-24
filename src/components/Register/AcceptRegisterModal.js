import React, { Component } from 'react';
import { Button, Modal } from "react-bootstrap"
import * as firebase from "firebase"
import PropType from "prop-types"

class AcceptRegisterModel extends Component {

    onAcceptRegister = () => {
        var registerData = this.props.registerData
        var studentData = Object({}, this.props.registerData) 
        delete studentData.registerClass

        const studentINClassRef = firebase.database().ref("ListClass").child(registerData.registerClass.idClass).child("student")
        const listStudent = firebase.database().ref("ListStudent").child(registerData.idRegister)

        console.log("AcceptRegisterModel: idRegister ", registerData.idRegister)
        var updateStudentData = {}
        // updateStudentData["ListClass/"+registerData.registerClass.idClass+"/student"] = studentData
        updateStudentData["ListStudent/"+registerData.idRegister] = studentData
        
        firebase.database().ref().set(updateStudentData, (error) => {
            if (error) {
                console.log("Có lỗi xảy ra khi thêm thông tin học sinh vào listClass va ListStudent: " + error);
            } else {
                console.log("Them hoc sinh vao listClass va ListStudent thanh cong");
                
            }
        })

        this.props.onHide()
    }

    componentDidMount = () => {
        this.convertNameToRightID("Nguyen Duc Anh", (result) => {
            console.log(result);
            
        })
    }
    convertNameToRightID = (oldName, callback) => {
        this.convertWrongID2RightID(this.convertNameToID(oldName), (result) => {
            if (typeof callback === "function") callback(result)
        })
    }

    convertNameToID = (oldName) => {
        var aliasString = this.changeAlias(oldName)
        var hoVaTenArray = aliasString.split(" ")
        var ketqua = hoVaTenArray.pop()
        const hoVaTenDemArray = hoVaTenArray
        hoVaTenDemArray.forEach((word) => {
            ketqua += word.charAt(0)
        })
        return ketqua + "1"
    }

    convertWrongID2RightID = (wrongID, callback) => {
        const wrongIDTemp = wrongID.slice(0, -1)

        const studentRef = firebase.database().ref("ListStudent").orderByKey().startAt(wrongIDTemp).endAt(wrongIDTemp + '\uf8ff')
        studentRef.once("value", (snaps) => {
            if (!snaps.exists()) {
                if (typeof callback === "function") callback(wrongIDTemp + "1")
            } else {
                var allStudentIDNumber = []
                snaps.forEach((snap) => {
                    var lastIDStudent = snap.val().idTeacher
                    const number = Number(lastIDStudent.slice(wrongIDTemp.length, wrongIDTemp.length + 1))
                    allStudentIDNumber.push(number)

                    if (allStudentIDNumber.length >= snaps.numChildren()) {
                        const rightNumber = this.findSmallestMissingNumberFromSortedArray(allStudentIDNumber)
                        if (typeof callback === "function") callback(wrongIDTemp + String(rightNumber))
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

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Cảnh báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn chuẩn bị thêm học sinh này vào lớp trong CSDL. Một khi đã thêm, phiếu đăng ký này sẽ bị xóa khỏi list đăng ký
            </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>No</Button>
                    <Button bsStyle="danger" onClick={this.onAcceptRegister}>Yes</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
export default AcceptRegisterModel;

AcceptRegisterModel.propTypes = {
    show: PropType.bool.isRequired,
    onHide: PropType.func.isRequired,
    registerData: PropType.object.isRequired,
}