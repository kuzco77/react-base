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
import DeleteClassRoomModal from './DeleteClassRoomModal';
import SelectTeacherForClassRoomModal from './SelectTeacherForClassRoomModal';

const tooltip = <Tooltip id="modal-tooltip">Thêm Lớp Học</Tooltip>;

class ClassRoomController extends Component {

  constructor() {
    super()
    this.state = {
      src: "http://braavos.me/images/posts/college-rock/the-smiths.png",
      selectedAvatarRow: null,
      isUploading: false,
      progress: 0,
      showAddClassModal: false,
      showDeleteClassModal: false,
      idClassDeleteClassModal: "",
      showChooseTeacherModal: false,
      idClassForChooseTeacherModal: "",
      products: [],
    }
  }


  handleChangeValueBtn() {
    const rootRef = firebase.database().ref().child("react")
    const speedRef = rootRef.child("speed")
    speedRef.set(this.state.speed)

  }

  componentDidMount() {
    document.title = "Người dạy"

    var classRef = firebase.database().ref().child("ListClass")

    classRef.on("value", snaps => {
      const newProducts = []
      snaps.forEach(snap => {
        newProducts.push(snap.val())
      })
      this.setState({ products: newProducts })
    }, (err) => {
      if (err) {
        console.log("Co loi xay ra khi lay du lieu giao vien: "+err.message);
        
      }
    })
  }

  handleIDTF = (event) => {
    this.setState({ searchTeacherID: "" })
  }

  handleAddClassBtn = (event) => {
    this.setState({ showAddClassModal: true, })
  }

  handleClose = (event) => {
    this.setState({ showAddClassModal: false })
  }

  handleSearchTeacher = (event) => {
    this.state.searchTeacherID = event.target.value
  }

  onDeleteClass = (idClass) => {
    this.setState({
      idClassDeleteClassModal: idClass,
      showDeleteClassModal: true,
    })

  }

  onHideDeleteClassModal = () => {
    this.setState({
      showDeleteClassModal: false,
      idClassDeleteClassModal: "",
    })
  }

  onChooseTeacher = (idClass) => {
    this.setState({
      idClassForChooseTeacherModal: idClass,
      showChooseTeacherModal: true,
    })
  }

  onHideListTeacher = () => {
    this.setState({
      showChooseTeacherModal: false,
      idClassForChooseTeacherModal: "",
    })
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
            <Button style={{ width: "100px" }} bsStyle="success" onClick={this.handleAddClassBtn}>+</Button>
          </OverlayTrigger>

          <AddClassRoomModal show={this.state.showAddClassModal} onHide={this.handleClose} />

          <ClassRoomTable
            onDeleteClass={this.onDeleteClass}
            onChooseTeacher={this.onChooseTeacher}
            isSignedIn={(firebase.auth().currentUser !== null)}
            products={this.state.products}
          />
          <DeleteClassRoomModal
            show={this.state.showDeleteClassModal}
            onHide={this.onHideDeleteClassModal}
            idClass={this.state.idClassDeleteClassModal}
          />
          <SelectTeacherForClassRoomModal
            show={this.state.showChooseTeacherModal}
            onHide={this.onHideListTeacher}
            idClass={this.state.idClassForChooseTeacherModal}
          />
        </form>
      </div>

    );
  }
}

export default ClassRoomController;
