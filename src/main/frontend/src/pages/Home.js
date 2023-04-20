import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Login from "./Login";

function Home(){
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        fetch('/auth/isLogin')
        .then(res => {
            if(res.status === 200){
                setIsLogin(true);
            } else {
                setIsLogin(false);
                navigate('/login');
            }
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