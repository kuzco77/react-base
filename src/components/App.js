import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import * as firebase from "firebase"


class Car extends Component {
  render(){
      return (<h1>Cars page</h1>);
  }
}

class App extends Component {
  

  constructor() {
    super()
    this.state = {
      speed: "",
      realtimeSpeed: 10,
    }
  }

  

  componentDidMount() {
    const rootRef = firebase.database().ref().child("ListTeacher")
    const speedRef = rootRef.child("DA").child("achievement")
    speedRef.on("value", snap => {
      this.setState({
        realtimeSpeed: snap.val(),
      })
    })

    
  }

  performChange() {
    const rootRef = firebase.database().ref().child("react")
    const speedRef = rootRef.child("speed")
    speedRef.set(this.state.speed)
  }

  handleSpeedChange(event) {
    const searchTerm = event.target.value
    this.setState({speed: event.target.value})
    this.history.push("home")
  }

  onImageChange(event) {
    if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({image: e.target.result});
        };
        reader.readAsDataURL(event.target.files[0]);
    }
}

  render() {
    return (
      <form className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React with speed: {this.state.realtimeSpeed}</h1>
          
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload. {this.state.speed}
          <Link to={"home"}>link to home</Link>
        </p>
        <a>Link to Home</a>
        <input placeholder="Enter something here" onChange={this.handleSpeedChange.bind(this)}/>
        <button onClick={this.performChange.bind(this)}>Change value</button>
        <input type="file" onChange={this.onImageChange.bind(this)} className="filetype" id="group_image"/>
        <img id="target" src={this.state.image}/>
      </form>
    );
  }
}

export default App;
