
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import "./NewHeader.css"

class NewHeader extends Component {
  constructor(props) {
    super(props)
  }

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
          <li><Link to={`${process.env.PUBLIC_URL}/register`}>Register</Link></li>
          <li><Link to={`${process.env.PUBLIC_URL}/request`}>Request</Link></li>
          

        </ul>
      </div>
      )
   }
}
export default NewHeader;