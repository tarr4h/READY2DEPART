import {
    BrowserRouter as Router,
    Routes,
    Route, Navigate, useNavigate,
} from "react-router-dom";
import {useEffect, useState} from "react";
import './css/Comn.css';
import Login from "./pages/login/Login";
import Home from "./pages/Home";
import './css/Comn.css';
import ErrPage from "./pages/ErrPage";
import Modal from "./pages/comn/Modal";


function App(){

    function setScreenSize() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    useEffect(() => {
        setScreenSize();
    }, []);


    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/:pg" element={<Home/>}/>
                <Route path="/:pg/:extra" element={<Home/>}/>
                <Route path={'*'} element={<ErrPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;