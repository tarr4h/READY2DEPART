import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import View from "./View";

function Home(){
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const {pg, extra} = useParams();
    const [hideFooterList] = useState(['register']);

    useEffect(() => {
        fetch('/auth/isLogin')
        .then(res => res.json())
        .then(json => {
            setIsLogin(json);
            if(!json) {
                alert('세션이 만료되었습니다.\n로그인 페이지로 이동합니다.');
                navigate('/login');
            }
        });

    }, [navigate]);

    function definePage(){
        let page = pg;
        if(extra != null) page = extra;
        if(pg == null && isLogin){
            page = 'home';
        } else if(pg == null && !isLogin){
            page = 'login';
        }
        return page;
    }

    function fiexedFooter(){
        let bool = true;
        hideFooterList.forEach((page) => {
            if(definePage() === page){
                bool = false;
                return false;
            }
        });
        return bool;
    }

    return (
        <div>
            <div id="blockUI">
                <div>잠시만 기다려주세요.</div>
            </div>
            <Header/>
            <div className="mainFrame"
                 style={!fiexedFooter() ? {paddingBottom : 0}: null}
            >
                <View page={definePage()}/>
                <Footer/>
            </div>
        </div>
    )
}

export default Home;