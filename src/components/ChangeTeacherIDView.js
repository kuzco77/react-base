import React, { Component } from 'react';
import firebase from "firebase"
import { Button } from "react-bootstrap"
import PropType from "prop-types"
import { isNull } from 'util';

class ChangeTeacherIDView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldTeacherID: "",
            newTeacherID: "",
            nameBeforeChange: "",
            nameAfterChange: "",
        }
    }

    findSmallestMissingNumberFromSortedArray = (array) => {
        var index = 1
        while (index === array.shift()) {
            index += 1
        }
        return index
    }

    // 2 Hàm bên dưới phải đi cùng nhau
    changeAllToRightID = () => {
        // Đổi tên trước khi dùng hàm này
        const listTeacher = firebase.database().ref("ListTeacher")

        listTeacher.once("value", (snaps) => {
            snaps.forEach((snap) => {

                const idTeacher = snap.child("idTeacher").val()
                this.changeIDTeacherToTheRightID(idTeacher)
            })
        })
    }

    changeIDTeacherToTheRightID = (oldID) => {
        const listTeacher = firebase.database().ref("ListTeacher")
        const teacherInListClass = firebase.database().ref("ListClass").orderByChild("teacher/idTeacher").equalTo(oldID)
        listTeacher.child(oldID).once("value", (snap) => {

            this.convertNameToID(snap.child("name").val(), (result) => {
                const newTeacher = Object.assign({}, snap.val(), { idTeacher: result })

                // Thêm dữ liệu mới vào listTeacher
                console.log(newTeacher, this.changeAlias(newTeacher.name))
                listTeacher.child(newTeacher.idTeacher).set(newTeacher)
                // Xóa dữ liệu cũ ở listTeacher
                snap.ref.remove()

                // Update dữ liệu mới vào listClass
                teacherInListClass.once("value", (snaps) => {
                    snaps.forEach((snap) => {
                        snap.ref.child("teacher").set(newTeacher)
                    })
                })
            })



        })
    }

    onChangeTF = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    changeTeacherID = (event) => {
        const listTeacher = firebase.database().ref("ListTeacher")
        const teacherInListClass = firebase.database().ref("ListClass").orderByChild("teacher/idTeacher").equalTo(this.state.oldTeacherID)
        listTeacher.child(this.state.oldTeacherID).once("value", (snap) => {

            this.convertNameToID(snap.child("name").val(), (result) => {
                const newTeacher = Object.assign({}, snap.val(), { idTeacher: result })

                // Thêm dữ liệu mới vào listTeacher
                console.log(newTeacher, this.changeAlias(newTeacher.name))
                listTeacher.child(newTeacher.idTeacher).set(newTeacher)
                // Xóa dữ liệu cũ ở listTeacher
                snap.ref.remove()

                // Update dữ liệu mới vào listClass
                teacherInListClass.once("value", (snaps) => {
                    snaps.forEach((snap) => {
                        snap.ref.child("teacher").set(newTeacher)
                    })
                })
            })



        })

    }

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

    handleConvertButton = (event) => {
        this.convertNameToID(this.state.nameBeforeChange, (result) => {
            this.setState({ nameAfterChange: result })
        })
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

    render = () => {
        return (
            <div>
                <input id="oldTeacherID" placeholder="Mã người dạy cũ" value={this.state.oldTeacherID} onChange={this.onChangeTF} />
                <input id="newTeacherID" placeholder="Mã người dạy mới" value={this.state.newTeacherID} onChange={this.onChangeTF} />
                <Button bsStyle="success" onClick={this.changeTeacherID}>Thay đổi</Button><br />
                <input id="nameBeforeChange" placeholder="Tên người dạy" value={this.state.nameBeforeChange} onChange={this.onChangeTF} />
                <Button bsStyle="success" onClick={this.handleConvertButton}>Convert</Button><br/>
                <Button bsStyle="success" onClick={this.changeAllToRightID}>Change All To Right ID</Button>
                <p>{this.state.nameAfterChange}</p>
            </div>
        )
    }
}

export default ChangeTeacherIDView

// ChangeTeacherIDView.propTypes = {
//     oldTeacherID: PropType.string.isRequired,
//     newTeacherID: PropType.string.isRequired
// }