import React, { Component } from 'react';
import { Jumbotron, Button } from "react-bootstrap"
import NewHeader from "../Header/NewHeader"
import firebase from "firebase"
import { stat } from 'fs';

class HomeController extends Component {
    constructor() {
        super()
        this.state = {
            user: {},
        }
    }

    componentDidMount() {
        document.title = "Trang chủ"

        // firebase.auth().createUserWithEmailAndPassword("namanh.chu2103@gmail.com", "123456").catch(function(error) {
        //     // Handle Errors here.
        //     var errorCode = error.code;
        //     var errorMessage = error.message;

        //     console.log(errorMessage)
        //     // ...
        //   })



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

    render() {
        return (
            <div className="App">
                {/* <NewHeader/> */}
                <Jumbotron style={{ marginTop: "12.5%" }} bsClass="body">
                    <h1>Xin chào,{this.state.user.email || ""} userID: {this.state.user.uid}</h1>
                    <p>Trang web này dùng để quản lý giảng viên và lớp học tại EDUMET</p>
                    <p><Button bsStyle="success" onClick={this.signInHandle}>Sign In</Button></p>
                    <p><Button bsStyle="primary" onClick={this.signOutHandle}>Sign Out</Button></p>

                </Jumbotron>
            </div>


        )
    }
}
export default HomeController;