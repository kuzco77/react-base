import React, { Component } from 'react';
import { Jumbotron, Button } from "react-bootstrap"
import firebase from "firebase"
import ChangeTeacherIDView from '../ChangeTeacherIDView';
import ChangeClassIDView from '../ChangeClassIDView';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

class HomeController extends Component {
    constructor() {
        super()
        this.state = {
            user: {},
        }
    }

    componentDidMount() {
        document.title = "Trang chủ"
        firebase.auth().onAuthStateChanged((user) => {

            if (user) {
                console.log("User is sign in")
                // User is signed in.
                this.setState({ user })
                // var displayName = user.displayName;
                // var email = user.email;
                // var emailVerified = user.emailVerified;
                // var photoURL = user.photoURL;
                // var isAnonymous = user.isAnonymous;
                // var uid = user.uid;
                // var providerData = user.providerData;
                // ...
            } else {
                console.log("User is signed out")
                this.setState({ user: {} })
            }
        });


    }

    signOutHandle = (event) => {
        firebase.auth().signOut().catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log("errorCode:", errorCode)
            console.log("errorMessage:", errorMessage)
        })
    }

    signInHandle = (event) => {
        console.log("Sign in handle")
        firebase.auth().signInWithEmailAndPassword("namanh.chu2103@gmail.com", "123456")
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...

                console.log(errorMessage)
            })
    }

    signInWithPopUp = (event) => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error Code: " + errorCode, "Error Message: " + errorMessage)
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    }

    changeTeacherID = (event) => {
        const teacherRef = firebase.database().ref("ListTeacher")
    }

    render() {
        var displayName = this.state.user.displayName
        var welcomeTitle = displayName ? ("Xin chao, " + displayName) : "Xin vui long dang nhap truoc khi su dung"
        return (
            <div className="App">
                {/* <NewHeader/> */}
                <Jumbotron style={{ marginTop: "12.5%" }} bsClass="body">
                    <h1>{welcomeTitle}</h1>
                    
                    <p>Trang web này dùng để quản lý người dạy và lớp học tại EDUMET</p>
                    <p><Button bsStyle="success" onClick={this.signInWithPopUp}>Sign In</Button></p>
                    <p><Button bsStyle="primary" onClick={this.signOutHandle}>Sign Out</Button></p>
                    <ChangeTeacherIDView isSignedIn={this.state.user !== null} isGod={this.state.user.email === "namanhchu2103@gmail.com"}/>
                    <ChangeClassIDView isSignedIn={this.state.user !== null} isGod={this.state.user.email === "namanhchu2103@gmail.com"}/>
                    
                </Jumbotron>
                <TimePicker defaultValue={moment()} showSecond={false} minuteStep={15}/>
            </div>
        )
    }
}

export default HomeController;