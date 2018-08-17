import React, { Component } from 'react';
import firebase from "firebase"
import { Button } from "react-bootstrap"
import PropType from "prop-types"

class ChangeClassIDView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldClassRoomID: "",
            newClassRoomID: "",

        }
    }

    onChangeTF = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    changeClassRoomID = (event) => {
        const listClassRoomRef = firebase.database().ref("ListClass").child(this.state.oldClassRoomID)
        listClassRoomRef.once("value", (snap) => {
            if (snap.exists()) {
                console.log("Có tồn tại class với id: " + this.state.oldClassRoomID);
                var newClassRoom = snap.val()
                newClassRoom.idClass = this.state.newClassRoomID             
                listClassRoomRef.parent.child(this.state.newClassRoomID).set(newClassRoom)
                listClassRoomRef.remove()
            } else {
                console.log("Không tồn tại class với id: " + this.state.oldClassRoomID);
                
            }
        })
    }

    convertFromWrongID2RightID = (oldID) => {
        
    }

    changeAllSubjectName = () => {
        const listClass = firebase.database().ref("ListClass")
        listClass.once("value", (snaps) => {
            
            var allClass = snaps.val()
            var index = 0
            snaps.forEach((snap) => {
                console.log("Vao list class, voi ten mon hoc: ", snap.child("subject").val())

                const oldClass = snap.val()
                const oldSubject = snap.child("subject").val()
                if (oldSubject === "Môn Hóa") {
                    oldClass.subject = "chemistry"
                    allClass[oldClass.idClass] = oldClass
                } else if (oldSubject === "Môn Lý") {
                    oldClass.subject = "physics"
                    allClass[oldClass.idClass] = oldClass
                } else if (oldSubject === "Môn Toán") {
                    oldClass.subject = "math"
                    allClass[oldClass.idClass] = oldClass
                } else if (oldSubject === "Môn Văn") {
                    oldClass.subject = "literature"
                    allClass[oldClass.idClass] = oldClass
                }

                if (index >= (snaps.numChildren() - 1)) {
                    console.log("Co vao day ko");
                    
                    snaps.ref.update(allClass)
                }

                index += 1
            })
        })
    }

    addMajorToAllClass = () => {
        const listClass = firebase.database().ref("ListClass")
        listClass.once("value", (snaps) => {
            
            var allClass = snaps.val()
            var index = 0
            snaps.forEach((snap) => {
                const oldClass = snap.val()
                oldClass.major = "Tổng hợp"
                allClass[oldClass.idClass] = oldClass

                if (index >= (snaps.numChildren() - 1)) {
                    console.log("Co vao day ko");
                    
                    snaps.ref.update(allClass)
                }

                index += 1
            })
        })
    }

    addLevelToAllClass = () => {
        const listClass = firebase.database().ref("ListClass")
        listClass.once("value", (snaps) => {
            
            var allClass = snaps.val()
            var index = 0
            snaps.forEach((snap) => {
                const oldClass = snap.val()
                oldClass.level = "1"
                allClass[oldClass.idClass] = oldClass

                if (index >= (snaps.numChildren() - 1)) {
                    console.log("Co vao day ko")
                    snaps.ref.update(allClass)
                }

                index += 1
            })
        })
    }


    render = () => {
        if (this.props.isSignedIn && this.props.isGod) {
            return(
                <div>
                   <input id="oldClassRoomID" placeholder="Mã lớp học cũ" value={this.state.oldClassRoomID} onChange={this.onChangeTF} />
                    <input id="newClassRoomID" placeholder="Mã lớp học mới" value={this.state.newClassRoomID} onChange={this.onChangeTF} />
                    <Button bsStyle="danger" onClick={this.changeClassRoomID}>Thay đổi</Button><br/> 
                    <Button bsStyle="danger" onClick={this.changeAllSubjectName}>Thay đổi tên môn học sang EN (Thử nghiệm)</Button><br/> 
                    <Button bsStyle="danger" onClick={this.addMajorToAllClass}>Thêm chuyên đề cho lớp học(Thử nghiệm)</Button><br/>
                    <Button bsStyle="danger" onClick={this.addLevelToAllClass}>Thêm trình độ cho lớp học(Thử nghiệm)</Button><br/>
                </div>
            )
        } else {
            return(<div></div>)
        }

        
    }
}

export default ChangeClassIDView

ChangeClassIDView.propTypes = {
    // oldTeacherID: PropType.string.isRequired,
    // newTeacherID: PropType.string.isRequired
    isSignedIn: PropType.bool.isRequired,
    isGod: PropType.bool.isRequired,
}