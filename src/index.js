import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from "firebase"
import { BrowserRouter, Route } from "react-router-dom"
import NewHeader from "./components/Header/NewHeader"
import ClassRoomController from "./components/ClassRoom/ClassRoomController"
import TeacherController from './components/Teacher/TeacherController';
import HomeController from "./components/Home/HomeController"

// Initialize Firebase (react-base)
var config = {
  apiKey: "AIzaSyDJYMcEDn7nh-zEl9J0_zSes8vMmyllGbM",
  authDomain: "react-base-6ef41.firebaseapp.com",
  databaseURL: "https://react-base-6ef41.firebaseio.com",
  projectId: "react-base-6ef41",
  storageBucket: "react-base-6ef41.appspot.com",
  messagingSenderId: "534609096757"
}

// Initialize Firebase (Edumet)

// var config = {
//   apiKey: "AIzaSyBj1zc5aHUxutkkpikP1ZgZ-Ha1KSxeSzk",
//   authDomain: "edumet-e5186.firebaseapp.com",
//   databaseURL: "https://edumet-e5186.firebaseio.com",
//   projectId: "edumet-e5186",
//   storageBucket: "edumet-e5186.appspot.com",
//   messagingSenderId: "617048274868"
// }


firebase.initializeApp(config);


ReactDOM.render(
  <BrowserRouter >
    <div>
      <NewHeader />
      <Route exact path={`${process.env.PUBLIC_URL}/`} component={HomeController} />
      <Route path={`${process.env.PUBLIC_URL}/teacher`} component={TeacherController} />
      <Route path={`${process.env.PUBLIC_URL}/classRoom`} component={ClassRoomController} />
    </div>
  </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();
