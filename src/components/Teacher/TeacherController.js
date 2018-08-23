import React, { Component } from 'react';
import '../App.css';
import * as firebase from "firebase"
import "react-bootstrap-table-next"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap"
import 'cropperjs/dist/cropper.css';
import AddTeacherModal from './AddTeacherModal';
import TeacherTable from './TeacherTable';
import DeleteTeacherModal from './DeleteTeacherModal';

const tooltip = <Tooltip id="modal-tooltip">Thêm Giảng Viên</Tooltip>;

class TeacherController extends Component {

  constructor() {
    super()
    this.state = {
      src: "http://braavos.me/images/posts/college-rock/the-smiths.png",
      selectedAvatarRow: null,
      isUploading: false,
      progress: 0,
      showAddTeacherModal: false,
      showDeleteTeacherModal: false,
      idTeacherDeleteModal: "",
      products: [],
    }
  }

  handleChangeValueBtn() {
    const rootRef = firebase.database().ref().child("react")
    const speedRef = rootRef.child("speed")
    speedRef.set(this.state.speed)

  }

  componentDidMount() {
    document.title = "Giảng viên"

    var teacherIDRef = firebase.database().ref().child("ListTeacher")
    var currentTeacherIDRef = firebase.database().ref().child("ListTeacher").child("anhnd1")

    teacherIDRef.on("value", (snaps) => {
      const newProducts = []
      snaps.forEach(snap => {
        newProducts.push(snap.val())
      })
      this.setState({ products: newProducts })
      
    }, (err) => {
      if (err) {
        console.log("Co loi xay ra khi lay du lieu giao vien: "+err.message);
        if (firebase.auth().currentUser) {
          currentTeacherIDRef.on("value", (snap) => {
            const newProducts = []
            newProducts.push(snap.val())
            this.setState({ products: newProducts})
          })
        }
        

      }
    })    
    
  }

  handleIDTF = (event) => {
    const searchTeacherID = event.target.value
    this.setState({ searchTeacherID: "" })
  }

  handleAddTeacherBtn = (event) => {
    this.setState({ showAddTeacherModal: true, })
  }

  onHideAddTeacherModal = (event) => {
    this.setState({ showAddTeacherModal: false })
  }

  handleSearchTeacher = (event) => {
    this.state.searchTeacherID = event.target.value
  }

  onDeleteTeacher = (idTeacher) => () => {
    this.setState({
      idTeacherDeleteModal: idTeacher,
      showDeleteTeacherModal: true,
    })
  }

  onHideDeleteTeacherModal = () => {
    this.setState({
      showDeleteTeacherModal: false,
      idTeacherDeleteModal: "",
    })
  }

  render() {
    return (
      <div>
        {/* <NewHeader/> */}
        <form className="App">

          <p className="App-intro">
            Nhấp đúp vào ô muốn chỉnh sửa . Is signedIn
          </p>


          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button style={{ width: "100px", marginRight: "10px" }} bsStyle="success" onClick={this.handleAddTeacherBtn}>+</Button>
          </OverlayTrigger>

          <AddTeacherModal
            show={this.state.showAddTeacherModal}
            onHide={this.onHideAddTeacherModal} />
          <TeacherTable
            isSignedIn={(firebase.auth().currentUser !== null)}
            onDeleteTeacher={this.onDeleteTeacher}
            products= {this.state.products}
          />
          <DeleteTeacherModal
            show={this.state.showDeleteTeacherModal}
            onHide={this.onHideDeleteTeacherModal}
            idTeacher={this.state.idTeacherDeleteModal}
          />
        </form>
      </div>

    );
  }
}

export default TeacherController;
