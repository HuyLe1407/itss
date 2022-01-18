import React from 'react'
import { Nav, Navbar } from 'react-bootstrap';

const NavBar = () => {
    return (
        <div >
            <Navbar bg="myRed" variant="dark" sticky="top" expand="lg">
                <Navbar.Brand>
                    {/* <img src = {logo192}/> */}
                    ランダム
                </Navbar.Brand>

                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href="home">  ホーム</Nav.Link>
                        <Nav.Link href="products">  Product</Nav.Link>

                        <Nav.Link href="about"> 顧客報告</Nav.Link>
                        <Nav.Link href="contact">  商品報告</Nav.Link>
                        <Nav.Link href="suggestion">  おすすめ商品</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default NavBar
