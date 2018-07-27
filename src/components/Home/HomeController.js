import React, { Component } from 'react';
import { Jumbotron, Button } from "react-bootstrap"
import NewHeader from "../Header/NewHeader"

class HomeController extends Component {
    componentDidMount() {
        document.title = "Trang chủ"
      }

    render() {
        return (

            <div className="App">
                {/* <NewHeader/> */}
                <Jumbotron style={{marginTop: "12.5%"}} bsClass = "body">
                <h1>Xin chào</h1>
                <p>Trang web này dùng để quản lý giảng viên và lớp học tại EDUMET</p>
                <p><Button bsStyle="primary">Learn more</Button></p>
                
            </Jumbotron>
            </div>

            
        )
    }
}
export default HomeController;