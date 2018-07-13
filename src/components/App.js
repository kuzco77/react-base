import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import * as firebase from "firebase"
import "react-bootstrap-table-next"
import BootstrapTable from 'react-bootstrap-table-next';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import { Button, FormGroup, ControlLabel, FormControl, ListGroup, ListGroupItem, Image } from "react-bootstrap"
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import FileUploader from "react-firebase-file-uploader";
import Home from "./Home"
import IntroTitle from "./IntroTitle"



const selectRow = {
  mode: 'checkbox',
  clickToSelect: true
};

class App extends Component {

  constructor() {
    super()
    this.state = {
      teacherID: "",
      src: "http://braavos.me/images/posts/college-rock/the-smiths.png",
      selectedAvatarRow: null,
      isUploading: false,
      progress: 0,
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
      editable: false,

    }];



  }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = (row, filename) => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(this.setAvatarLink.bind(this, row));
  };

  setAvatarLink = (row, url) => {
    console.log(url, row)
    const teacherIDRef = firebase.database().ref().child("ListTeacher").child(row["idTeacher"]).child("linkAvatar")
    teacherIDRef.set(url)
  }


  imageFormatter = (cell, row, rowIndex, formatExtraData) => {
    // <Button color="light-blue">Light blue</Button>

    return <div>
      <Image id="target" src={cell} height={100} width={100} circle={true} /><br />
      <label style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor' }}>
        Edit
        <FileUploader
          hidden
          accept="image/*"
          storageRef={firebase.storage().ref('images')}
          onUploadStart={this.handleUploadStart}
          onUploadError={this.handleUploadError}
          onUploadSuccess={this.handleUploadSuccess.bind(this, row)}
          onProgress={this.handleProgress}
          maxHeight={400}
          maxWidth={400}
        />
      </label>
    </div>
  }

  editAvatar = (row) => {
    console.log("Change Ava", row)

  }


  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () =>
          this.setState({
            src: reader.result
          }),
        false
      );
      reader.readAsDataURL(e.target.files[0]);
    }
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

  // onImageChange = (event) => {
  //   if (event.target.files && event.target.files[0]) {
  //     let reader = new FileReader();
  //     reader.onload = (e) => {
  //       this.setState({ image: e.target.result });
  //     };
  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  // }



  handleIDTF = (event) => {
    const searchTeacherID = event.target.value

    if (searchTeacherID !== undefined) {

      this.setState({ teacherID: searchTeacherID })
      const teacherIDRef = firebase.database().ref().child("ListTeacher").orderByChild("idTeacher").startAt(searchTeacherID).endAt(searchTeacherID + "\uf8ff")
      teacherIDRef.on("value", snaps => {
        const products = []
        snaps.forEach(snap => {
          products.push(snap.val())
        })

        // console.log(snaps.val())
        this.setState({ products })
      })
    }
  }

  afterSaveCell(oldValue, newValue, row, column) {
    const teacherIDRef = firebase.database().ref().child("ListTeacher").child(row["idTeacher"])
    teacherIDRef.set(row)

  }

  editCellStyle(cell, row, rowIndex, colIndex) {
    // it is suppose to return an object
    console.log("Edit cell style")
  }

  _crop() {
    // image in dataUrl
    console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
  }

  handleEditAvatar = (somethingKool) => {
    console.log("The real change to avatar")
    console.log(somethingKool)
  }

  render() {
    return (
      <form className="App">
        <IntroTitle/>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <Link to={"home"}>link to home</Link>
        </p>

        <input placeholder="Nhập ID giảng viên" value={this.state.teacherID || ""} onChange={this.handleIDTF} />
        {/* <input type="file" onChange={this.onImageChange} className="filetype" id="group_image" /> */}
        <Button bsStyle="success">+</Button>

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
