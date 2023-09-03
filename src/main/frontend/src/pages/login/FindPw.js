import {useInput} from "../../hks/useInput";
import {useState} from "react";


function FindPw() {

    const userId = useInput('');
    const userPh = useInput('')
    const verifyNum = useInput('');
    const chngPwd = useInput('');
    const [sendVerify, setSendVerify] = useState(1);

    return (
        <div>
            <div className="titWrapper mt_1">
                <div className="orange">ID</div>
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
                <div className="orange">전화번호</div>
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
                    sendVerify === 1 ? (<a className="btn orange mt_1"
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
                            <a className="btn orange bd_orange mt_1"
                            >인증</a>
                        </div>
                    ) : null
            }
            {
                sendVerify === 3 ?
                    (
                        <div className="titWrapper mt_1">
                            <div className="orange">비밀번호 변경</div>
                            <div>
                                <input type="text"
                                       className="text input wd_100 pl_3"
                                       value={chngPwd.val}
                                       onChange={chngPwd.onChange}
                                />
                            </div>
                            <a className="btn orange bd_orange mt_1"
                            >변경</a>
                        </div>
                    ) : null
            }
        </div>
    )
}

export default FindPw;