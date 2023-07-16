import {useInput} from "../hks/useInput";
import styles from "../css/Login.module.css";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import * as comn from "../comn/comnFunction";

function Login(){
    const userId = useInput("admin");
    const userPw = useInput("1234");
    const navigate = useNavigate();

    useEffect(() => {
        window.localStorage.removeItem('yOffset')
        comn.scrollToTop();
        fetch('/auth/isLogin')
        .then(res => res.json())
        .then(json => {
            if(json){
                navigate('/');
            }
        });
    }, []);

    function resetLoginForm(){
        userId.reset();
        userPw.reset();
    }

    async function doLogin(){
        let result = await processLogin();
        if(result){
            navigate('/', {replace:true});
        } else {
            alert('회원정보가 일치하지 않습니다.');
            resetLoginForm();
        }
    }

    function processLogin(){
        let param = {
            id : userId.val,
            pwd : userPw.val
        };

        let loginRslt = fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(param)
        });
        return loginRslt.then(res => res.json())
            .then(json => {
                return json;
            });
    }

    return(
        <div className={styles.wrapper}>
            <div className={styles.box}>
                <h1 className={styles.tit}>TRAVEL WEB</h1>
                <input
                    type="text"
                    value={userId.val}
                    placeholder="아이디를 입력하세요"
                    className={styles.input}
                    onChange={userId.onChange}
                />
                <input
                    type="password"
                    value={userPw.val}
                    placeholder="비밀번호를 입력하세요"
                    className={styles.input}
                    onChange={userPw.onChange}
                />
                <a className={styles.btn} onClick={doLogin}>LOGIN</a>
            </div>
        </div>
    );
}

export default Login;