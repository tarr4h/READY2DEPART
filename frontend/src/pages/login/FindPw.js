import {useInput} from "../../hks/useInput";
import {useState} from "react";
import axios from "axios";


function FindPw({callback}) {

    const userId = useInput('');
    const userPh = useInput('')
    const verifyNum = useInput('');
    const chngPwd = useInput('');
    const validtPwd = useInput('');
    const [possPwd, setPossPwd] = useState(0);
    const [corrPwd, setCorrPwd] = useState(0);
    const [sendVerify, setSendVerify] = useState(1);

    const requestVerify = async () => {
        if(userPh.val.length < 11 || userPh.val.length > 11){
            alert('입력한 번호를 확인해주세요');
            return false;
        } else if(userId.val === ''){
            alert('ID가 입력되지 않았습니다.');
            return false;
        }

        const param = {
            id : userId.val,
            ph : userPh.val
        }
        const result = await(await axios.post('/auth/pwFindVerifyRequest', param)).data;
        if(!result){
            alert('해당 정보로 가입된 계정이 존재하지 않습니다.');
        } else {
            alert('인증번호가 발송되었습니다.');
            setSendVerify(2);
        }
    }

    const verifyPh = async () => {
        if(verifyNum.val === ''){
            alert('인증번호를 입력해주세요');
            return false;
        }
        const result = await(await axios.post('/auth/verifyPh', {reqVerifyNum : verifyNum.val})).data;
        if(result){
            alert('인증되었습니다.\n변경할 비밀번호를 입력해주세요');
            setSendVerify(3);
        } else {
            alert('인증번호가 일치하지 않습니다.');
        }
    }

    const chkPwd = (event) => {
        const val = event.target.value;

        const pwd = chngPwd.val;
        if(pwd.length === 0){
            setPossPwd(0);
            return;
        }

        const regex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/]).{8,}$/;
        if(regex.test(val)){
            setPossPwd(1);
        } else {
            setPossPwd(2);
        }
    }

    const comparePwd = (event) => {
        const val = event.target.value;

        const valitPwd = validtPwd.val;
        if(valitPwd.length === 0 || possPwd !== 1){
            setCorrPwd(0);
            return;
        }

        const pwd = chngPwd.val;
        val === pwd ? setCorrPwd(1) : setCorrPwd(2) ;
    }

    const requestChngPwd = async () => {
        if(!(corrPwd === 1 && possPwd === 1)){
            return false;
        }
        const param = {
            id : userId.val,
            password : chngPwd.val
        }

        const result = await(await axios.post('/auth/chngPwd', param)).data;
        if(result > 0){
            alert('변경되었습니다.\n변경한 비밀번호로 로그인해주세요');
            callback();
        }

    }

    return (
        <div>
            <div className="titWrapper mt_1">
                <div className="gray">ID</div>
                <div>
                    <input type="text"
                           className="input wd_100 pl_3"
                           value={userId.val}
                           onChange={userId.onChange}
                           disabled={sendVerify !== 1}
                    />
                </div>
            </div>
            <div className="titWrapper mt_1">
                <div className="gray">전화번호</div>
                <div>
                    <input type="text"
                           className="input wd_100 pl_3"
                           value={userPh.val}
                           onChange={userPh.onChange}
                           disabled={sendVerify !== 1}
                    />
                </div>
                <span className="description pl_1">
                    가입 시 사용한 전화번호를 입력해주세요.
                </span>
                {
                    sendVerify === 1 ?
                        (<a className="btn orange mt_3"
                            onClick={requestVerify}
                            >인증번호 발송</a>)
                        : null
                }
            </div>
            {
                sendVerify === 2 ?
                    (
                        <div className="titWrapper mt_1">
                            <div className="orange">인증번호 입력</div>
                            <div>
                                <input type="text"
                                       className="text input wd_100 pl_3"
                                       value={verifyNum.val}
                                       onChange={verifyNum.onChange}
                                />
                            </div>
                            <a className="btn orange bd_orange mt_3"
                               onClick={verifyPh}
                            >인증</a>
                        </div>
                    ) : null
            }
            {
                sendVerify === 3 ?
                    (
                        <div>
                            <div className="titWrapper mt_1">
                                <div className="orange">비밀번호 변경</div>
                                <div>
                                    <input type="password"
                                           className="text input wd_100 pl_3"
                                           value={chngPwd.val}
                                           onChange={chngPwd.onChange}
                                           onKeyUp={chkPwd}
                                    />
                                </div>
                                {possPwd === 0 ? '' : possPwd === 1 ? (<span className="description poss pt_1">사용가능합니다</span>) : (<span className="description imposs pt_1">최소 1개의 특수문자를 포함한 8자리 이상이어야 합니다.</span>)}
                            </div>
                            <div className="titWrapper mt_1">
                                <div className="orange">비밀번호 확인</div>
                                <div>
                                    <input type="password"
                                           className="text input wd_100 pl_3"
                                           value={validtPwd.val}
                                           onChange={validtPwd.onChange}
                                           onKeyUp={comparePwd}
                                    />
                                </div>
                                {corrPwd === 0 || possPwd !== 1 ?
                                    ''
                                    :
                                    corrPwd === 1 && possPwd === 1 ?
                                        (
                                            <div>
                                                <span className="description poss pt_1">일치합니다</span>
                                                <a className="btn orange bd_orange mt_3"
                                                   onClick={requestChngPwd}
                                                >변경</a>
                                            </div>
                                        )
                                        :
                                        (<span className="description imposs pt_1">일치하지 않습니다</span>)}
                            </div>
                        </div>
                    ) : null
            }
        </div>
    )
}

export default FindPw;