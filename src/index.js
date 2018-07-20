import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Home from "./components/Home"
import Profile from "./components/Profile"
import registerServiceWorker from './registerServiceWorker';
import * as firebase from "firebase"
import {BrowserRouter, Route, Redirect} from "react-router-dom"



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
    <Route path="/" component={App}/>
    <Route path="/home" component={Home}/>
    <Route path="/profile" component={Profile}/>
    {/* <Redirect from="/" to="app" /> */}
    </div>
  </BrowserRouter>,
 document.getElementById('root'));
registerServiceWorker();
