
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
          <li><a href={`${process.env.PUBLIC_URL}/`}><span>Home </span></a></li>
          <li><a href={`${process.env.PUBLIC_URL}/app`}><span>Teacher</span></a></li>
          <li><a href={`${process.env.PUBLIC_URL}/classRoom`}><span>Class</span></a></li>
          <li><a href="/about"><span>About us</span></a></li>
          <li><a href="/contact"><span>Contact</span></a></li>
        </ul>
      </div>
      )
   }
}
export default NewHeader;