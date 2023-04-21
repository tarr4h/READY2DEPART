import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Login from "./Login";

function Home(){
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        fetch('/auth/isLogin')
        .then(res => {
            setIsLogin(res.ok);
            if(!res.ok) navigate('/login');
        });
    }, [isLogin]);

    function logout(){
        fetch('/auth/logout', {
            method: 'POST'
        }).then(res => {
            navigate('/login');
        });
    }

    return (
        <div>
            <h1>HOME</h1>
            <button onClick={logout}>logout</button>
        </div>
    )
}

export default Home;