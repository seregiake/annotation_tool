import React, { Component } from "react";
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Separator = () => <span> . </span>
class NavBar extends Component {
    render() {
        return (
            <Navbar style={{ backgroundColor:'rgb(25, 25, 112)', color:'white' }}>
                <Navbar.Brand href="#home" style={{ color:'white' }}>Navbar</Navbar.Brand>
                <Nav className="mr-auto" >
                    <Nav.Link href="/" style={{ color:'white' }}>Home</Nav.Link>
                    <Separator />
                    <Nav.Link href="/about" style={{ color:'white' }}>Informations</Nav.Link>
                    <Separator />
                    <Nav.Link href="/tasks" style={{ color:'white' }}>Tasks</Nav.Link>
                </Nav>
            </Navbar>
            
        )
    }
}
export default NavBar;
