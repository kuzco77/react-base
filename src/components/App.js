import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import * as firebase from "firebase"
import { stat } from 'fs';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "react-bootstrap-table-next"
import BootstrapTable from 'react-bootstrap-table-next';



class App extends Component {


  constructor() {
    super()
    this.state = {
      speed: "",
      realtimeSpeed: 10,
      teacherAchievement: "",
      teacherID: "",
      oldTeacherID: "",
      newTeacherID: "",
    }

    this.state.products = [];
    this.state.columns = [{
      dataField: "idTeacher",
      text: "Teacher ID"
    }, {
      dataField: "name",
      text: "Ten giao vien"
    }];

    this.state.key = ["1","2"]
    
  }


  
  

  componentDidMount() {

    const rootRef = firebase.database().ref().child("ListTeacher").child("DA").child("achievement")
    const speedRef = rootRef
    speedRef.on("value", snap => {
      this.setState({
        realtimeSpeed: snap.val(),
      })
    })


  }



  handleChangeValueBtn() {
    const rootRef = firebase.database().ref().child("react")
    const speedRef = rootRef.child("speed")
    speedRef.set(this.state.speed)
    // this.props.history.push("home")
  }

  handleSpeedTF(event) {
    const boundObject = this
    boundObject.setState({ speed: event.target.value })

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

  handleAchiveTF(event) {

  }

  handleIDTF(event) {
    const searchTeacherID = event.target.value

    if (searchTeacherID !== undefined) {

      this.setState({ teacherID: searchTeacherID })
      const teacherRef = firebase.database().ref().child("ListTeacher").child(searchTeacherID || "hello")
      teacherRef.on("value", snap => {
        console.log(snap)
        this.setState({
          teacherAchievement: snap.child("achievement").val(),
          teacherLink: snap.child("linkAvatar").val(),
          teacherName: snap.child("name").val(),
          teacherSchool: snap.child("school").val(),
        })
      })
    }
  }

  handleLinkTF(event) {

  }

  handleNameTF(event) {
    const searchTeacherName = event.target.value

    if (searchTeacherName !== undefined) {

      this.setState({ teacherName: searchTeacherName })
      const teacherNameRef = firebase.database().ref().child("ListTeacher").orderByChild("idTeacher").startAt(searchTeacherName).endAt(searchTeacherName+"\uf8ff")
      teacherNameRef.on("value", snaps => {
        const newProducts = []
        snaps.forEach(snap => {
          newProducts.push(snap.val())
        })

        console.log(snaps.val())
        this.setState({ products: newProducts })
        
        
      })
    }
  }

  handleSchoolTF(event) {

  }

  handleSearchButton(event) {

  }

  changeIDTeacher(from, to) {
    const teacherRef = firebase.database().ref().child("ListTeacher").orderByChild("name")
  }

  render() {
    return (
      <form className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React with speed: {this.state.realtimeSpeed}</h1>

        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <Link to={"home"}>link to home</Link>
        </p>
        <input placeholder="Enter something here" onChange={this.handleSpeedTF.bind(this)} />
        <button onClick={this.handleChangeValueBtn.bind(this)}>Change value</button>
        <input type="file" onChange={this.onImageChange.bind(this)} className="filetype" id="group_image" />
        <img id="target" src={this.state.image} />
        <h3>Achievement</h3>  <input value={this.state.teacherAchievement || ""} placeholder="Enter something here" width="100" height="100" />
        <h3>ID</h3>  <input value={this.state.teacherID || ""} placeholder="Enter something here" onChange={this.handleIDTF.bind(this)} /> <button>Search</button>
        <h3>Link</h3>  <input value={this.state.teacherLink || ""} placeholder="Enter something here" /> <img src={this.state.teacherLink}/>
        <h3>Name</h3>  <input value={this.state.teacherName || ""} placeholder="Enter something here" onChange={this.handleNameTF.bind(this)} />
        <h3>School</h3>  <input value={this.state.teacherSchool || ""} placeholder="Enter something here" />
        <h2>Change teacher ID</h2>   <input value={this.state.teacherSchool || ""} placeholder="Enter something here" />
        <div>
          <p>From</p> <input value={this.state.oldTeacherID || ""} placeholder="Old Teacher ID"/>
          <p>To</p> <input value={this.state.newTeacherID || ""} placeholder="New Teacher ID"/>
          <button> Change </button>

          
        </div>

        <BootstrapTable keyField="idTeacher" data={ this.state.products } columns={ this.state.columns } />

      </form>
    );
  }
}

export default App;
