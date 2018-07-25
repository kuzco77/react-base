import React, { Component } from 'react';
import '../App.css';
import * as firebase from "firebase"
import "react-bootstrap-table-next"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import 'cropperjs/dist/cropper.css';
import AddTeacherModal from '../Teacher/AddTeacherModal';
import ClassRoomTable from './ClassRoomTable';
import AddClassRoomModal from './AddClassRoomModal';

const tooltip = <Tooltip id="modal-tooltip">Thêm Giảng Viên</Tooltip>;

class ClassRoomController extends Component {

  constructor() {
    super()
    this.state = {
      searchTeacherID: "",
      src: "http://braavos.me/images/posts/college-rock/the-smiths.png",
      selectedAvatarRow: null,
      isUploading: false,
      progress: 0,
      showAddClassModal: false,
    }
  }

  handleChangeValueBtn() {
    const rootRef = firebase.database().ref().child("react")
    const speedRef = rootRef.child("speed")
    speedRef.set(this.state.speed)

  }

  componentDidMount() {
    document.title = "Giảng viên"
  }

  handleIDTF = (event) => {
    this.setState({searchTeacherID: ""})
  }

  handleAddClassBtn = (event) => {
    this.setState({showAddClassModal: true,})
  }

  handleClose = (event) => {
    this.setState({showAddClassModal: false})
  }

  handleSearchTeacher = (event) => {
    this.state.searchTeacherID = event.target.value
  }

  render() {
    return (
      <div>
          
        <form className="App">

          <p className="App-intro">
            Tìm kiếm theo mã giảng viên
          </p>

          <input placeholder="Nhập ID giảng viên" value={this.state.teacherID || ""} onChange={this.handleIDTF} />
          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button bsStyle="success" onClick={this.handleAddClassBtn}>+</Button>
          </OverlayTrigger>

          <AddClassRoomModal show={this.state.showAddClassModal} onHide={this.handleClose} />

          <ClassRoomTable searchTeacherID={this.state.searchTeacherID}/>

        </form>
      </div>

    );
  }
}

export default ClassRoomController;
