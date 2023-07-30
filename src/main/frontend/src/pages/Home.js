import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import View from "./View";

function Home(){
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const {pg, extra} = useParams();

    useEffect(() => {
        // comn.scrollToTop();
    })

    function defilePage(){
        let page = pg;
        if(extra != null) page = extra;
        if(pg == null) page = 'home';
        return page;
    }

    useEffect(() => {
        fetch('/auth/isLogin')
        .then(res => res.json())
        .then(json => {
            setIsLogin(json);
            if(!json) navigate('/login');
        });

    }, [isLogin]);

    return (
        <div>
            <Header/>
            <View page={defilePage()}/>
            <Footer/>
        </div>
    )
}

export default Home;