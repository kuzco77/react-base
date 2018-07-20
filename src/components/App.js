import React, { Component } from 'react';
import './App.css';
import * as firebase from "firebase"
import "react-bootstrap-table-next"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import { Button, FormGroup, ControlLabel, FormControl, ListGroup, ListGroupItem, Image, Modal, OverlayTrigger, Popover, Tooltip } from "react-bootstrap"
import 'cropperjs/dist/cropper.css';
import IntroTitle from "./IntroTitle"
import AddTeacherModal from './Teacher/AddTeacherModal';
import TeacherTable from './Teacher/TeacherTable';
import NewHeader from "./Header/NewHeader"

const popover = (
  <Popover id="modal-popover" title="popover">
    very popover. such engagement
  </Popover>
);
const tooltip = <Tooltip id="modal-tooltip">Thêm Giảng Viên</Tooltip>;

class App extends Component {

  constructor() {
    super()
    this.state = {
      searchTeacherID: "",
      src: "http://braavos.me/images/posts/college-rock/the-smiths.png",
      selectedAvatarRow: null,
      isUploading: false,
      progress: 0,
      showAddTeacherModal: false,
    }
  }

  handleChangeValueBtn() {
    const rootRef = firebase.database().ref().child("react")
    const speedRef = rootRef.child("speed")
    speedRef.set(this.state.speed)

  }

  handleIDTF = (event) => {
    const searchTeacherID = event.target.value
    this.setState({searchTeacherID: ""})
    // if (searchTeacherID !== undefined) {

    //   this.setState({ searchTeacherID })
    //   // const teacherIDRef = firebase.database().ref().child("ListTeacher").orderByChild("idTeacher").startAt(searchTeacherID).endAt(searchTeacherID + "\uf8ff")
    //   // teacherIDRef.on("value", snaps => {
    //   //   const products = []
    //   //   snaps.forEach(snap => {
    //   //     products.push(snap.val())
    //   //   })

    //   //   // console.log(snaps.val())
    //   //   this.setState({ products })
    //   // })
    // } else {
    //   this.setState({searchTeacherID: ""})
    // }
  }

  handleAddTeacherBtn = (event) => {
    this.setState({showAddTeacherModal: true,})
  }

  handleClose = (event) => {
    this.setState({showAddTeacherModal: false})
  }

  handleSearchTeacher = (event) => {
    this.state.searchTeacherID = event.target.value
  }

  render() {
    return (
      <div>
        {/* <IntroTitle /> */}
        <NewHeader/>
        <form className="App">

          <p className="App-intro">
            Tìm kiếm theo mã giảng viên
          </p>

          <input placeholder="Nhập ID giảng viên" value={this.state.teacherID || ""} onChange={this.handleIDTF} />
          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button bsStyle="success" onClick={this.handleAddTeacherBtn}>+</Button>
          </OverlayTrigger>

          <AddTeacherModal show={this.state.showAddTeacherModal} onHide={this.handleClose} />

          <TeacherTable searchTeacherID={this.state.searchTeacherID}/>

        </form>
      </div>

    );
  }
}

export default App;
