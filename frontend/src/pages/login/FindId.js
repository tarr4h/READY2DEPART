import {findAllByDisplayValue} from "@testing-library/react";
import {useState} from "react";
import {useInput} from "../../hks/useInput";
import axios from "axios";


function FindId() {

    const userPh = useInput('');
    const verifyNum = useInput('');
    const [sendVerify, setSendVerify] = useState(false);

    const requestSms = async () => {
        if(userPh.val.length < 11 || userPh.val.length > 11){
            alert('입력한 번호를 확인해주세요');
            return false;
        }
        const param = {
            ph : userPh.val
        }

        const result = await(await axios.post('/auth/sendVerifyPhRequest', param)).data;
        if(result.statusCode === '202'){
            alert('인증번호가 전송되었습니다.');
            setSendVerify(true);
        } else {
            alert('정상적으로 처리되지 않았습니다.\n다시 시도해주세요');
            return false;
        }
    }

    const verifyPh = async () => {
        if(verifyNum.val === ''){
            alert('인증번호를 입력해주세요');
            return false;
        }
        const result = await(await axios.post('/auth/verifyPh', {reqVerifyNum : verifyNum.val})).data;
        if(result){
            const userId = await(await axios.post('/auth/findId', {ph : userPh.val})).data;
            if(userId !== ''){
                alert('ID는 [' + userId + '] 입니다.');
            } else {
                alert('해당 번호로 가입된 계정이 없습니다.');
            }
        } else {
            alert('인증번호가 일치하지 않습니다.');
        }
        setSendVerify(false);
    }

    return (
        <div>
            <div className="titWrapper mt_1">
                <div className="orange">전화번호</div>
                <div>
                    <input type="text"
                           className="input wd_100 pl_3"
                           value={userPh.val}
                           onChange={userPh.onChange}
                    />
                </div>
                <span className="description pl_1">
                    가입 시 사용한 전화번호를 입력해주세요.
                </span>
                {
                    sendVerify ? null
                        : (<a className="btn orange mt_3"
                              onClick={requestSms}
                            >인증번호 발송</a>)
                }
            </div>
            {
                sendVerify ?
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
                            <a className="btn orange bd_orange mt_1"
                               onClick={verifyPh}
                            >인증</a>
                        </div>
                    )
                    : null
            }
        </div>
    )
}

export default FindId;