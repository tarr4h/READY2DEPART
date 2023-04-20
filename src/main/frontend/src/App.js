import {
    BrowserRouter as Router,
    Routes,
    Route, Navigate, useNavigate,
} from "react-router-dom";
import {useEffect, useState} from "react";
import './css/Comn.css';
import Login from "./pages/Login";
import Home from "./pages/Home";
import {useCookies} from "react-cookie";


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
            </Routes>
        </Router>
    );
}

export default App;