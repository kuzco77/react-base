import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Home from "./components/Home"
import Profile from "./components/Profile"
import registerServiceWorker from './registerServiceWorker';
import * as firebase from "firebase"
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"
import NewHeader from "./components/Header/NewHeader"
import TeacherTable from './components/Teacher/TeacherTable';
import ClassRoomController from "./components/ClassRoom/ClassRoomController"
import AddClassRoomModal from "./components/ClassRoom/AddClassRoomModal"


// Initialize Firebase
var config = {
  apiKey: "AIzaSyDJYMcEDn7nh-zEl9J0_zSes8vMmyllGbM",
  authDomain: "react-base-6ef41.firebaseapp.com",
  databaseURL: "https://react-base-6ef41.firebaseio.com",
  projectId: "react-base-6ef41",
  storageBucket: "react-base-6ef41.appspot.com",
  messagingSenderId: "534609096757"
};
firebase.initializeApp(config);


ReactDOM.render(
  <BrowserRouter >
    <div>
      <NewHeader/>
      <Route exact path="/" component={Home} />
      <Route path="/app" component={App} />
      <Route path="/classRoom" component={ClassRoomController} />
      <Route path="/about" component={AddClassRoomModal} />
    </div>
  </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();
