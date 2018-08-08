import React, { Component } from 'react';
import firebase from "firebase"
import { Button } from "react-bootstrap"
import PropType from "prop-types"

class ChangeTeacherIDView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldTeacherID: "",
            newTeacherID: "",
        }
    }

    handleTextField = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    changeTeacherID = (event) => {
        const listTeacher = firebase.database().ref("ListTeacher")
        const teacherInListClass = firebase.database().ref("ListClass").orderByChild("teacher/idTeacher").equalTo(this.state.oldTeacherID)
        listTeacher.child(this.state.oldTeacherID).once("value", (snap) => {
            const newTeacher = Object.assign({}, snap.val(), { idTeacher: this.state.newTeacherID })

            // Thêm dữ liệu mới vào listTeacher
            console.log(newTeacher, this.changeAlias(newTeacher.name))
            listTeacher.set(newTeacher)
            // Xóa dữ liệu cũ ở listTeacher
            snap.ref.remove()

            // Thêm dữ liệu mới vào listClass
            teacherInListClass.set(newTeacher)
            snap.ref.remove

            // Xóa dữ liệu cũ ở listClass

            const teacherInListClassRef = firebase.database().ref().child("ListClass").orderByChild("teacher/idTeacher").equalTo(this.state.oldTeacherID)
            const teacherRefsThatNeedToChange = []
            teacherInListClassRef.once("value", (snaps) => {
                snaps.forEach((snap) => {
                    // teacherRefsThatNeedToChange.push(snap.ref.child("teacher"))
                    snap.ref.child("teacher").set(newTeacher, (error) => {
                        if (error) {
                            console.log("Co loi khi cap nhat thong tin giao vien")
                        } else {
                            console.log("Cap nhat thong tin giao vien thanh cong")
                        }
                    })
                })

            })


        })

        // const speedmotRef = firebase.database().ref("react/speedmot").orderByChild("id").equalTo("speed1")
        // speedmotRef.set({
        //     id: "speed1",
        //     name: "Da thay doi"
        // })


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
            <div>
                <input id="oldTeacherID" placeholder="Mã người dạy cũ" value={this.state.oldTeacherID} onChange={this.handleTextField} />
                <input id="newTeacherID" placeholder="Mã người dạy mới" value={this.state.newTeacherID} onChange={this.handleTextField} />
                <Button bsStyle="success" onClick={this.changeTeacherID}>Thay đổi</Button>
            </div>
        )
    }
}

export default ChangeTeacherIDView

// ChangeTeacherIDView.propTypes = {
//     oldTeacherID: PropType.string.isRequired,
//     newTeacherID: PropType.string.isRequired
// }