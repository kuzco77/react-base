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
import NewHeader from "../Header/NewHeader"

const tooltip = <Tooltip id="modal-tooltip">Thêm Lớp Học</Tooltip>;

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
      searchTeacherID: "",
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
          {/* <NewHeader/> */}
        <form className="App">

          <p className="App-intro">
            (Nhấp đúp vào ô muốn chỉnh sửa)
          </p>

          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button style={{width: "100px"}} bsStyle="success" onClick={this.handleAddClassBtn}>+</Button>
          </OverlayTrigger>

          <AddClassRoomModal show={this.state.showAddClassModal} onHide={this.handleClose} />

          <ClassRoomTable searchTeacherID={this.state.searchTeacherID}/>

        </form>
      </div>

    );
  }
}

export default ClassRoomController;
