import React, { Component } from 'react';
import '../App.css';
import * as firebase from "firebase"
import "react-bootstrap-table-next"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import 'cropperjs/dist/cropper.css';
import ClassRoomTable from './ClassRoomTable';
import AddClassRoomModal from './AddClassRoomModal';
import AddTimeTableModal from './AddTimeTableModal';
import DeleteClassRoomModal from './DeleteClassRoomModal';
import SelectTeacherForClassRoomModal from './SelectTeacherForClassRoomModal';

const tooltip = <Tooltip id="modal-tooltip">Thêm Lớp Học</Tooltip>;

class ClassRoomController extends Component {

  constructor() {
    super()
    this.state = {
      selectedAvatarRow: null,
      isUploading: false,
      progress: 0,
      showAddClassModal: false,

      showDeleteClassModal: false,
      idClassDeleteClassModal: "",

      showChooseTeacherModal: false,
      idClassForChooseTeacherModal: "",
      showAddTimeTableModal: false,

      idClassForAddTimeTable: "",

      listClasses: [],
      listRooms: {},
      listTimeTable: {},

      indexOfAddTimeTable: 1,
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
      this.setState({ listClasses: newProducts })
    }, (err) => {
      if (err) {
        console.log("Co loi xay ra khi lay du lieu lop hoc: "+err.message);
      }
    })

    firebase.database().ref("ListRooms").on("value", (snaps) => {
      this.setState({listRooms: snaps.val()})
    })

    firebase.database().ref("ListRooms").on("child_added", (snaps) => {
      snaps.forEach((snap) => {
        
      })
    })

    // firebase.database().ref("ListTimeTable").on
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

  openChooseTeacher = (idClass) => (event) => {
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

  openAddTimeTable = (idClass, index) => () => {
    this.setState({
      idClassForAddTimeTable: idClass,
      showAddTimeTableModal: true,
      indexOfAddTimeTable: index
    })
  }

  onHideAddTimeTable = () => {
    this.setState({
      showAddTimeTableModal: false,
      idClassForAddTimeTable: "idClass",
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
            <Button style={{ width: "100px" }} bsStyle="success" onClick={this.handleAddClassBtn}>Thêm lớp</Button>
          </OverlayTrigger>

          <AddClassRoomModal 
          show={this.state.showAddClassModal} 
          onHide={this.handleClose} />

          <AddTimeTableModal 
          show={this.state.showAddTimeTableModal} 
          onHide={this.onHideAddTimeTable} 
          idClass={this.state.idClassForAddTimeTable}
          index={this.state.indexOfAddTimeTable}
          listRooms={this.state.listRooms}/>

          <ClassRoomTable
            onDeleteClass={this.onDeleteClass}
            openChooseTeacher={this.openChooseTeacher}
            openAddTimeTable={this.openAddTimeTable}
            isSignedIn={(firebase.auth().currentUser !== null)}
            listClasses={this.state.listClasses}
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
