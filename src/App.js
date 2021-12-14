import React, {useEffect, useState} from 'react';
import SignUp from './component/signup';
import LogIn from './component/login';
import Dashboard from './component/dashboard';
import Home from './component/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotPassword from "./component/ForgotPassword";
import './App.css';
import {Button, Nav, Navbar} from 'react-bootstrap';
import SuggestProduct from './component/suggestion'
import Products from './component/products';
import {auth} from "./firebase";
import TotalProduct from "./component/TotalProduct";


function App() {
    const [check, setCheck] = useState(false);
    useEffect(()=>{
        //Check user is logined
        auth.onAuthStateChanged((user)=>{
            if(user!=null){
                setCheck(true)
            }
            else{
                setCheck(false)
            }
        })
    })
    const LogOut = async()=>{
        await auth.signOut();
    }
  return (
    <div className="App">
      <div>
          {check === true &&
              <div style={{position: "sticky",top: 0}}>
                  <Navbar bg ="myRed" variant="dark" sticky="top" expand="lg">
                      <Navbar.Brand style={{marginLeft:20}}>
                          {/* <img src = {logo192}/> */}
                          ランダム
                      </Navbar.Brand>
                      <Navbar.Toggle/>
                      <Navbar.Collapse>
                          <Nav >
                              <Nav.Link href="/home">  ホーム</Nav.Link>
                              <Nav.Link href ="/statistics">  統計</Nav.Link>
                              {/*<Nav.Link href ="/about"> 顧客報告</Nav.Link>*/}
                              {/*<Nav.Link href ="/contact">  商品報告</Nav.Link>*/}
                              {/*<Nav.Link href ="/suggestion">  おすすめ商品</Nav.Link>*/}
                              <Nav.Link href ="/totalProduct">  すべての製品</Nav.Link>
                          </Nav>
                      </Navbar.Collapse>
                      <Navbar.Collapse className="justify-content-end" style={{marginRight:20}}>
                          <Button onClick={LogOut}>ログアウト</Button>
                      </Navbar.Collapse>
                  </Navbar>
              </div>
          }
          {
              <BrowserRouter>
                  <Routes>
                      <Route path='/login' element={<LogIn/>}/>
                      <Route path="/signup" element={<SignUp/>}/>
                      <Route path='/dashboard' element={<Dashboard/>}/>
                      <Route path='/statistics' element={<Products/>}/>
                      <Route path='/forgot' element={<ForgotPassword/>}/>
                      <Route path='/home' element={<Home/>}/>
                      <Route path="/suggestion" element={<SuggestProduct/>}/>
                      <Route path="/totalProduct" element={<TotalProduct/>}/>
                      <Route path='/' element={<LogIn/>}/>
                  </Routes>
              </BrowserRouter>
          }
    </div>
   </div>
  )
}

export default App
