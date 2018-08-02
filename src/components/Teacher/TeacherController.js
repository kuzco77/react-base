import React, { Component } from 'react';
import '../App.css';
import * as firebase from "firebase"
import "react-bootstrap-table-next"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap"
import 'cropperjs/dist/cropper.css';
import AddTeacherModal from './AddTeacherModal';
import TeacherTable from './TeacherTable';
import NewHeader from "../Header/NewHeader"

const tooltip = <Tooltip id="modal-tooltip">Thêm Giảng Viên</Tooltip>;

class TeacherController extends Component {

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

  componentDidMount() {
    document.title = "Giảng viên"

    firebase.auth().onAuthStateChanged((user) => {

      if (user) {
          console.log("User is sign in")
          // User is signed in.
          this.setState({user})
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // ...
      } else {
          console.log("User is signed out")
          this.setState({user: {}})
      }
  });
  }

  handleIDTF = (event) => {
    const searchTeacherID = event.target.value
    this.setState({searchTeacherID: ""})
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
        {/* <NewHeader/> */}
        <form className="App">

          <p className="App-intro">
            Nhấp đúp vào ô muốn chỉnh sửa . Is signedIn {this.state.user != 0}
          </p>

          
          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button style={{width: "100px", marginRight: "10px"}} bsStyle="success" onClick={this.handleAddTeacherBtn}>+</Button>
          </OverlayTrigger>

          <AddTeacherModal show={this.state.showAddTeacherModal} onHide={this.handleClose} />

          <TeacherTable searchTeacherID={this.state.searchTeacherID} isSignedIn={(this.state.user != null)}/>

        </form>
      </div>

    );
  }
}

export default TeacherController;
