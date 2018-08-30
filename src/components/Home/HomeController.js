import React, { Component } from 'react';
import { Jumbotron, Button } from "react-bootstrap"
import firebase from "firebase"
import ChangeTeacherIDView from '../ChangeTeacherIDView';
import ChangeClassIDView from '../ChangeClassIDView';

Object.defineProperty( String.prototype, 'intHour', {
    get: function () {
        var timeArray = this.split(":")
        if (timeArray.length === 2) {
            var intHour = parseInt(timeArray[0])*100
            intHour += parseInt(timeArray[1])/3*5
            return intHour
        } else {
            return ""
        }
        
    }
});

Object.defineProperty( Number.prototype, 'stringHour', {
    get: function () {

        var hour = Math.floor(this/100) 
        var minute = this - 100*hour
        return hour.toString() + ":" + (minute/5*3).toString()
        
    }
});


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

        this.checkTKB("7:15", "9:45")
        this.checkVeryVeryHardQuestion()
    }

    checkVeryVeryHardQuestion = () => {
        var timeArray = [true, true, true, false, false , true, true ,true ,true , false ,false, true, false]
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

        this.fillTimeArray("7:30", "9:45",timeArray)
        this.fillTimeArray("13:30", "15:45",timeArray)
        return this.checkTimeArray(start, end, timeArray)
    }

    getFreeTimes = (hourLength, minutesLength) => {
        var freeTimes = []
        var lengthTime = hourLength*100 + minutesLength/3*5

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
        var intLength = (end.intHour - intStart)/25
        for (let index = (intStart - 750)/25; index <= (intStart - 750)/25 + intLength; index++) {
            timeArray[index] = false  
        }
    }

    checkTimeArray = (start, end, timeArray) => {
        var intStart = start.intHour
        var intLength = (end.intHour - intStart)/25
        for (let index = (intStart - 750)/25 + 1; index < (intStart - 750)/25 + intLength; index++) {
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
                <Jumbotron style={{ marginTop: "12.5%" }} bsClass="body">
                    <h1>{welcomeTitle}</h1>
                    
                    <p>Trang web này dùng để quản lý người dạy và lớp học tại EDUMET</p>
                    <p><Button bsStyle="success" onClick={this.signInWithPopUp}>Sign In</Button></p>
                    <p><Button bsStyle="primary" onClick={this.signOutHandle}>Sign Out</Button></p>
                    <ChangeTeacherIDView isSignedIn={this.state.user !== null} isGod={this.state.user.email === "namanhchu2103@gmail.com"}/>
                    <ChangeClassIDView isSignedIn={this.state.user !== null} isGod={this.state.user.email === "namanhchu2103@gmail.com"}/>
                    
                </Jumbotron>
                
            </div>
        )
    }
}

export default HomeController;