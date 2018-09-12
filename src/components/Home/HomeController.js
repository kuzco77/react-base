import React, { Component } from 'react';
import { Jumbotron, Button } from "react-bootstrap"
import firebase from "firebase"
import ChangeTeacherIDView from '../ChangeTeacherIDView';
import ChangeClassIDView from '../ChangeClassIDView';
import firebaseui from 'firebaseui'
import moment from 'moment';

class HomeController extends Component {
    constructor() {
        super()
        this.state = {
            signedWithFB: false,
            signedWithGoogle: false,
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
                console.log(user.providerData.providerID);
                if (user.providerData.providerID === "facebook.com") {
                    this.setState({ signedWithFB: true })
                } else {
                    this.setState({ signedWithFB: true })
                }

            } else {
                console.log("User is signed out")
                this.setState({ user: {} })
            }
        });

        // Initialize the FirebaseUI Widget using Firebase.
        var uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return true;
                },
                  uiShown: function() {
                    // The widget is rendered.
                    // Hide the loader.
                    document.getElementById('loader').style.display = 'none';
                  }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'popup',
            signInSuccessUrl: `${process.env.PUBLIC_URL}/`,
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            ],
            // Terms of service url.
            tosUrl: '<your-tos-url>',
            // Privacy policy url.
            privacyPolicyUrl: '<your-privacy-policy-url>'
        };

        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', uiConfig);

        this.checkTKB("7:15", "9:45")
        this.checkVeryVeryHardQuestion()
    }

    updateLoggedInState = () => {
        console.log("fb Log in")
    }

    updateLoggedOutState = () => {
        console.log("fb log out");

    }

    checkVeryVeryHardQuestion = () => {
        var timeArray = [true, true, true, false, false, true, true, true, true, false, false, true, false]
        var resultArray = []
        var length = 2
        var buffer = 0
        timeArray.forEach((value, index) => {
            if (value === true) {
                buffer++
                if (buffer >= length) {
                    resultArray.push(index - (length - 1))
                }
            } else {
                buffer = 0
            }
        })
        console.log(resultArray)
    }



    checkTKB = (start, end) => {
        if (end.intHour - start.intHour <= 0) {
            return false
        }
        var timeArray = this.createTimeArray()

        this.fillTimeArray("7:30", "9:45", timeArray)
        this.fillTimeArray("13:30", "15:45", timeArray)
        return this.checkTimeArray(start, end, timeArray)
    }

    getFreeTimes = (hourLength, minutesLength) => {
        var freeTimes = []
        var lengthTime = hourLength * 100 + minutesLength / 3 * 5

    }

    createTimeArray = () => {
        var timeArray = []
        for (let index = 0; index < 55; index++) {
            timeArray[index] = true
        }
        return timeArray
    }

    fillTimeArray = (start, end, timeArray) => {
        var intStart = start.intHour
        var intLength = (end.intHour - intStart) / 25
        for (let index = (intStart - 750) / 25; index <= (intStart - 750) / 25 + intLength; index++) {
            timeArray[index] = false
        }
    }

    checkTimeArray = (start, end, timeArray) => {
        var intStart = start.intHour
        var intLength = (end.intHour - intStart) / 25
        for (let index = (intStart - 750) / 25 + 1; index < (intStart - 750) / 25 + intLength; index++) {
            if (timeArray[index] === false) {
                return false
            }
        }
        return true
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

    signInGoogleWithPopUp = (event) => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function (error) {
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

    signInFacebookWithPopUp = (event) => {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            this.setState({ signedWithFB: true })
            // ...
        }).catch(function (error) {
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

    changeTable2Tables = () => {
        firebase.database().ref("ListTimeTable").once("value", (snaps) => {
            snaps.ref.parent.child("ListTimeTables").set(snaps.val(), (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Success");
                    
                }
            })
        }, (err) => {
            console.log(err)
        })
    }

    render() {
        var displayName = this.state.user.displayName
        var welcomeTitle = displayName ? ("Xin chao, " + displayName) : "Xin vui long dang nhap truoc khi su dung"
        var timeCreate = moment().format("YYYYMMDDHHmmssSS")
        return (
            <div>
                <div className="App">

                    <Jumbotron style={{ marginTop: "12.5%" }} bsClass="body">
                        <h1>{welcomeTitle}</h1>
                        <p>Trang web này dùng để quản lý người dạy và lớp học tại EDUMET</p>
                        <p><Button bsStyle="success" onClick={this.signInGoogleWithPopUp}>Sign In With Google</Button></p>
                        <p><Button bsStyle="success" onClick={this.signInFacebookWithPopUp}>Sign In With Facebook</Button></p>
                        <p><Button bsStyle="primary" onClick={this.signOutHandle}>Sign Out</Button></p>
                        <p><Button bsStyle="primary" onClick={this.changeTable2Tables}>Table => Tables</Button></p>
                        <ChangeTeacherIDView isSignedIn={this.state.user !== null} isGod={this.state.user.email === "namanhchu2103@gmail.com"} />
                        <ChangeClassIDView isSignedIn={this.state.user !== null} isGod={this.state.user.email === "namanhchu2103@gmail.com"} />
                        <p><div id="firebaseui-auth-container"></div></p>
                        <p><div id="loader">Loading...</div></p>

                        <p>{timeCreate}</p>
                    </Jumbotron>
                </div>

            </div>

        )
    }
}

export default HomeController;