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
import { Button, FormGroup, ControlLabel, FormControl, ListGroup, ListGroupItem } from "react-bootstrap"
import cellEditFactory from 'react-bootstrap-table2-editor';

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true
};

class App extends Component {

  imageFormatter(cell, row) {
    console.log(cell);
    console.log(row);
    return "<img src='" + cell + "'/>";
  }

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
      dataSort: true
    }, {
      dataField: "name",
      text: "Tên Giáo Viên"
    }, {
      dataField: "achievement",
      text: "Thành Tựu"
    }, {
      dataField: "linkAvatar",
      text: "Avatar",
      dataFormat: this.imageFormatter
    }];



  }





  componentDidMount() {

    const teacherIDRef = firebase.database().ref().child("ListTeacher")
    teacherIDRef.on("value", snaps => {
      const newProducts = []
      snaps.forEach(snap => {
        newProducts.push(snap.val())
      })

      // console.log(snaps.val())
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
    console.log(row)

    const teacherIDRef = firebase.database().ref().child("ListTeacher").child(row["idTeacher"])
    teacherIDRef.set(row)
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

        <input
          placeholder="Nhập ID giảng viên"
          value={this.state.teacherID || ""}
          onChange={this.handleIDTF.bind(this)}
        />

        {/* <Button bsStyle="success" onClick={this.handleSearchBtn.bind(this)}> Search </Button> */}
        <input type="file" onChange={this.onImageChange.bind(this)} className="filetype" id="group_image" />
        <img id="target" src={this.state.image} />



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
