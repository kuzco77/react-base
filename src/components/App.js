import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import * as firebase from "firebase"
import { stat } from 'fs';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "react-bootstrap-table-next"
import BootstrapTable from 'react-bootstrap-table-next';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import { Button, FormGroup, ControlLabel, FormControl, ListGroup, ListGroupItem, Image } from "react-bootstrap"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';


const selectRow = {
  mode: 'checkbox',
  clickToSelect: true
};

class App extends Component {

  constructor() {
    super()
    this.state = {
      speed: "",
      realtimeSpeed: 10,
      teacherAchievement: "",
      teacherID: "",
    }

    this.state.products = [];
    this.state.columns = [{
      dataField: "idTeacher",
      text: "Mã Giáo Viên",
    }, {
      dataField: "name",
      text: "Tên Giáo Viên",
    }, {
      dataField: "school",
      text: "Trường",

    }, {
      dataField: "achievement",
      text: "Thành Tựu",

    }, {
      dataField: "linkAvatar",
      text: "Avatar",
      formatter: this.imageFormatter,
      editCellStyle: this.editCellStyle
    }, {
      dataField: 'done',
      text: 'Done',
    }];



  }

  imageFormatter(cell, row, rowIndex, formatExtraData) {
    // return <Image href={row} id={row} src={cell} responsive width={100} height={100} circle/> 
    return <Image id="target" src={cell} height={100} width={100} circle={true} />
    // return <h1>Hello, world!</h1>
  }



  componentDidMount() {

    const teacherIDRef = firebase.database().ref().child("ListTeacher")
    teacherIDRef.on("value", snaps => {
      const newProducts = []
      snaps.forEach(snap => {
        newProducts.push(snap.val())
      })

      console.log(snaps.val())
      this.setState({ products: newProducts })
    })
  }
  handleChangeValueBtn() {
    const rootRef = firebase.database().ref().child("react")
    const speedRef = rootRef.child("speed")
    speedRef.set(this.state.speed)
    // this.props.history.push("home")
  }

  onImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }



  handleIDTF(event) {
    const searchTeacherID = event.target.value

    if (searchTeacherID !== undefined) {

      this.setState({ teacherID: searchTeacherID })
      const teacherIDRef = firebase.database().ref().child("ListTeacher").orderByChild("idTeacher").startAt(searchTeacherID).endAt(searchTeacherID + "\uf8ff")
      teacherIDRef.on("value", snaps => {
        const newProducts = []
        snaps.forEach(snap => {
          newProducts.push(snap.val())
        })

        // console.log(snaps.val())
        this.setState({ products: newProducts })
      })
    }
  }


  handleSearchBtn(event) {

  }

  afterSaveCell(oldValue, newValue, row, column) {
    const teacherIDRef = firebase.database().ref().child("ListTeacher").child(row["idTeacher"])
    teacherIDRef.set(row)

  }

  editCellStyle(cell, row, rowIndex, colIndex) {
    // it is suppose to return an object
    console.log("Edit cell style")
  }

  _crop(){
    // image in dataUrl
    console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
  }

  render() {
    return (
      <form className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Trang quản lý EDUMET</h1>

        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <Link to={"home"}>link to home</Link>
        </p>

        <input placeholder="Nhập ID giảng viên" value={this.state.teacherID || ""} onChange={this.handleIDTF.bind(this)} />
        <Button value="Search" bsStyle="success" onClick={this.handleSearchBtn.bind(this)}> Search </Button>

        <input type="file" onChange={this.onImageChange.bind(this)} className="filetype" id="group_image" />
        <div
          id="target"
          className="avatar"
        //  style="background: url('https://www.dropbox.com/s/r7imoxdrochvt5a/19850879_1472361676144032_1126486230_o.jpg?dl=1')"
        ></div>

        {/* <Cropper
          ref='cropper'
          src={"https://www.dropbox.com/s/r7imoxdrochvt5a/19850879_1472361676144032_1126486230_o.jpg?dl=1"}
          aspectRatio={16 / 9}
        /> */}

        <Cropper
        ref='cropper'
        src='https://www.dropbox.com/s/r7imoxdrochvt5a/19850879_1472361676144032_1126486230_o.jpg?dl=1'
        style={{height: 400, width: '100%'}}
        // Cropper.js options
        aspectRatio={16 / 9}
        guides={false}
        crop={this._crop.bind(this)} />


        {/* <div style="height: 100px; width: 100px; background: url('https://www.dropbox.com/s/r7imoxdrochvt5a/19850879_1472361676144032_1126486230_o.jpg?dl=1') center center; background-size: cover; border-radius: 999px;"></div> */}
        <BootstrapTable
          keyField="idTeacher"
          data={this.state.products}
          columns={this.state.columns}
          striped
          hover
          condensed
          cellEdit={cellEditFactory({
            mode: 'dbclick',
            afterSaveCell: this.afterSaveCell
          })}

        />

      </form>
    );
  }
}

export default App;
