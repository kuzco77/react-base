import React, { Component } from 'react';
import { Jumbotron, Button } from "react-bootstrap"
import firebase from "firebase"

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
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    }

    render() {
        function onSignIn(googleUser) {
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        }
        

        return (
            <div className="App">
                {/* <NewHeader/> */}
                <Jumbotron style={{ marginTop: "12.5%" }} bsClass="body">
                    <h1>Xin chào,{this.state.user.email || ""} userID: {this.state.user.uid}</h1>
                    <p>Trang web này dùng để quản lý giảng viên và lớp học tại EDUMET</p>
                    <p><Button bsStyle="success" onClick={this.signInWithPopUp}>Sign In</Button></p>
                    <p><Button bsStyle="primary" onClick={this.signOutHandle}>Sign Out</Button></p>
                    <div className="g-signin2" data-onsuccess="onSignIn"></div>


                </Jumbotron>
            </div>


        )
    }
}
export default HomeController;