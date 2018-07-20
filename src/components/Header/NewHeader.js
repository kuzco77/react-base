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
          <li><a href="/app"><span>Home</span></a></li>
          <li><a href="/"><span>Tutorials</span></a></li>
          <li><a href="/"><span>Articles</span></a></li>
          <li><a href="/"><span>About me</span></a></li>
          <li><a href="/"><span>Contact</span></a></li>
        </ul>
      </div>
      )
   }
}
export default NewHeader;