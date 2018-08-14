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
                console.log(newClassRoom);

                
                
                listClassRoomRef.parent.child(this.state.newClassRoomID).set(newClassRoom)
                listClassRoomRef.remove()
            } else {
                console.log("Không tồn tại class với id: " + this.state.oldClassRoomID);
                
            }


            
        })
    }

    render = () => {
        return(
            <div>
               <input id="oldClassRoomID" placeholder="Mã lớp học cũ" value={this.state.oldClassRoomID} onChange={this.onChangeTF} />
                <input id="newClassRoomID" placeholder="Mã lớp học mới" value={this.state.newClassRoomID} onChange={this.onChangeTF} />
                <Button bsStyle="success" onClick={this.changeClassRoomID}>Thay đổi</Button><br/> 
            </div>
        )
    }
}

export default ChangeClassIDView