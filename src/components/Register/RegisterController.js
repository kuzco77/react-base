import React, { Component } from 'react';
import { Jumbotron, Button } from "react-bootstrap"
import firebase from "firebase"

class RegisterController extends Component {
    constructor() {
        super()
        this.state = {
            user: {},
        }
    }

    componentDidMount() {
        document.title = "Đăng ký lớp"
    }




    render() {
        return (
            <div className="App">
                <p>Hello</p>
            </div>
        )
    }
}

export default RegisterController;