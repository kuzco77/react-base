import React, { Component } from 'react';
import { Jumbotron, Button } from "react-bootstrap"
import firebase from "firebase"
import RegisterTable from './RegisterTable';
import DeleteRegisterModal from './DeleteRegisterModal';

class RegisterController extends Component {
    constructor() {
        super()
        this.state = {
            listRegister: [],
            idRegisterDelete: "",
            showDeleteRegisterModal: false,
            idRegisterAccept: "",
            showAcceptRegisterModal: false,
        }
    }

    componentDidMount() {
        document.title = "Đăng ký lớp"

        const listRegisterRef = firebase.database().ref("ListRegisterClass").limitToLast(20)
        listRegisterRef.on("value", (snaps) => {
            console.log(snaps.numChildren());

            const newListRegister = []
            snaps.forEach((snap) => {
                const newRegister = snap.val()
                newRegister.idRegister = snap.key
                newListRegister.push(newRegister)
            })
            this.setState({ listRegister: newListRegister })
        }, (err) => {
            if (err) {
                console.log("Có lỗi xảy ra khi lấy dữ liệu đăng ký");
                console.log(err.message);
                
            }
            
        })
        console.log(firebase.auth().currentUser !== null);
        
    }


    onDeleteRegister = (idRegister) => (event) => {
        this.setState({
            idRegisterDelete: idRegister,
            showDeleteRegisterModal: true,
        })
    }

    onAcceptRegister = (idRegister) => () => {
        this.setState({
            idRegisterAccept: idRegister,
            showAcceptRegisterModal: true,
        })
    }

    onHideDeleteModal = () => {
        this.setState({
            showDeleteRegisterModal: false,
            idRegisterDelete: "",
        })
    }

    onHideAcceptModal = () => {
        this.setState({
            showAcceptRegisterModal: false,
            idRegisterAccept: "",
        })
    }

    render() {
        return (
            <div className="App">
                <RegisterTable
                    isSignedIn={firebase.auth().currentUser !== null}
                    onDeleteRegister={this.onDeleteRegister}
                    products={this.state.listRegister}
                />
                <DeleteRegisterModal
                    show={this.state.showDeleteRegisterModal}
                    onHide={this.onHideDeleteModal}
                    idRegister={this.state.idRegisterDelete} 
                />
            </div>
        )
    }
}

export default RegisterController;