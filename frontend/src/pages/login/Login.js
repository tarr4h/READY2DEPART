import {useInput} from "../../hks/useInput";
import styles from "../../css/Login.module.css";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import * as comn from "../../comn/comnFunction";
import Modal from "../comn/Modal";
import JoinModal from "./JoinModal";
import FindModal from "./FindModal";
import axios from "axios";

function Login(){
    const userId = useInput("");
    const userPw = useInput("");
    const navigate = useNavigate();

    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showFindMine, setShowFindMine] = useState(false);
    const [showFindModal, setShowFindModal] = useState(false);

    useEffect(() => {
        const savedId = window.localStorage.getItem('userId');
        const savedPw = window.localStorage.getItem('userPw');
        if(savedId !== ''){
            userId.setVal(savedId);
        }
        if(savedPw !== ''){
            userPw.setVal(savedPw);
        }

        window.localStorage.removeItem('yOffset');
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
            window.localStorage.setItem("userId", userId.val);
            window.localStorage.setItem("userPw", userPw.val);
            navigate('/', {replace:true});
        } else {
            alert('회원정보가 일치하지 않습니다.');
            setShowFindMine(true);
            // resetLoginForm();
        }
    }

    const pwdKeyup = (event) => {
        const keycode = event.keyCode;
        if(keycode === 13){
            void doLogin();
        }
    }

    const join = () => {
        setShowJoinModal(true);
    }

    const find = () => {
        setShowFindModal(true);
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

    const closeJoinModal = () => {
        comn.scrollToTop();
        resetLoginForm();
        setShowJoinModal(false);
    }

    const closeFindModal = () => {
        comn.scrollToTop();
        resetLoginForm();
        setShowFindModal(false);
    }

    return(
        <div className={styles.wrapper}>
            <Modal title={"회원가입"}
                   content={<JoinModal callback={closeJoinModal}/>}
                   isOpen={showJoinModal}
                   setIsOpen={setShowJoinModal}
            />
            <Modal title={"ID/PW 찾기"}
                   content={<FindModal callback={closeFindModal}/>}
                   isOpen={showFindModal}
                   setIsOpen={setShowFindModal}
            />
            <div className={styles.box}>
                <h1 className={styles.tit}>READY2DEPART</h1>
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
                    onKeyUp={pwdKeyup}
                />
                <a className={styles.btn} onClick={doLogin}>LOGIN</a>
                <a className={styles.join} onClick={join}>JOIN!</a>
                {
                    showFindMine ? (<a className={styles.join + ' mt_1'} onClick={find}>FIND ID/PW</a>) : null
                }
            </div>
        </div>
    );
}

export default Login;