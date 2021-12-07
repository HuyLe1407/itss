import React from 'react';
import SignUp from './component/signup';
import LogIn from './component/login';
import Dashboard from './component/dashboard';
import Home from './component/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotPassword from "./component/ForgotPassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LogIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/forgot' element={<ForgotPassword/>}/>
        <Route path='/' element={<LogIn/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
