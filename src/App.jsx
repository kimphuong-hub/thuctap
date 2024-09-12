import React from "react";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from "./Components/Layout/Header";
import Footer from "./Components/Layout/Footer";
import Main from "./Components/Layout/Main";
import './App.css'


function App() {
  return(
    <>
    <Router>
      <Header/>
        <Routes>
          <Route path='/' element={<Main/>}/>
        </Routes>
      <Footer/>
    </Router>
    </>
  )
}


export default App;
