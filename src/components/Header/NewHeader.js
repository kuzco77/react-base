
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
          <li><Link to={`${process.env.PUBLIC_URL}/`}>Home</Link></li>
          <li><Link to={`${process.env.PUBLIC_URL}/teacher`}>Teacher</Link></li>
          <li><Link to={`${process.env.PUBLIC_URL}/classRoom`}>Class</Link></li>
          <li><Link to={`${process.env.PUBLIC_URL}/about`}>About us</Link></li>
          <li><Link to={`${process.env.PUBLIC_URL}/contact`}>Contact</Link></li>
          

        </ul>
      </div>
      )
   }
}
export default NewHeader;