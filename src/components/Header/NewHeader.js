import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import { Link } from 'react-router-dom'
import "./NewHeader.css"

class NewHeader extends Component {
   render() {
      return (
        <div style={{margin: "auto"}} id="header">
        <div style={{textAlign: "center"}}>
          <a href="/" id="logo">Edumet</a>
        </div>
        
        <ul id="menu">
          <li><a href="/"><span>Homepage </span></a></li>
          <li><a href="/app"><span>Teacher</span></a></li>
          <li><a href="/profile"><span>Class</span></a></li>
          <li><a href="/"><span>Công ty</span></a></li>
          <li><a href="/"><span>Liên hệ</span></a></li>
        </ul>
      </div>
      )
   }
}
export default NewHeader;