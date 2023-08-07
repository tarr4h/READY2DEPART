import {useForm} from "react-hook-form";
import {useState} from "react";
import axios from "axios";
import {useInput} from "../../hks/useInput";


function JoinModal({callback}){

    const {register, setValue, getValues, handleSubmit, reset} = useForm();
    const [possPwd, setPossPwd] = useState(0);
    const [corrPwd, setCorrPwd] = useState(0);
    const verifyNumber = useInput('');
    const [isVerified, setIsVerified] = useState(0);

    const phOnChange = (event) => {
        const name = event.target.name;
        const val = event.target.value;

        switch(name){
            case 'ph1' :
                if(val.length === 4){
                    setValue(name, val.substring(0, 3));
                }
                break;
            default :
                if(val.length === 5){
                    setValue(name, val.substring(0, 4));
                }
        }
    }

    const chkPwd = (event) => {
        const val = event.target.value;

        const pwd = getValues('password');
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

        const valitPwd = getValues('valitPwd');
        if(valitPwd.length === 0 || possPwd !== 1){
            setCorrPwd(0);
            return;
        }

        const pwd = getValues('password');
        val === pwd ? setCorrPwd(1) : setCorrPwd(2) ;
    }

    const reqVerifyPh = async() => {
        const ph1 = getValues('ph1');
        const ph2 = getValues('ph2');
        const ph3 = getValues('ph3');
        if(ph1 === '' || ph2 === '' || ph3 === ''){
            alert('전화번호가 입력되지 않았습니다.');
            return false;
        }
        const ph = ph1 + ph2 + ph3;
        const param = {
            ph,
            ph1,
            ph2,
            ph3
        }
        const result = await(await axios.post('/auth/sendVerifyPhRequest', param)).data;
        if(!result){
            alert('해당 번호로 가입된 계정이 존재합니다.');
            return false;
        }

        if(result.statusCode === '202'){
            alert('인증번호가 전송되었습니다.');
            setIsVerified(1);
        } else {
            alert('정상적으로 처리되지 않았습니다.\n다시 시도해주세요');
            return false;
        }
    }

    const verifyPh = async () => {
        if(verifyNumber.val === ''){
            alert('인증번호를 입력해주세요');
            return false;
        }
        const result = await(await axios.post('/auth/verifyPh', {reqVerifyNum : verifyNumber.val})).data;
        if(result){
            setIsVerified(2);
        } else {
            alert('인증번호가 일치하지 않습니다.');
        }
    }

    /**
     * @type { {userId: string, ph1: number, ph2: number, ph3 : number} }
     * @returns {boolean}
     */
    function validate(data){
        if(data.id === ''){
            alert('ID가 입력되지 않았습니다.');
            return false;
        } else if(possPwd === 0){
            alert('비밀번호가 입력되지 않았습니다.');
            return false;
        } else if(corrPwd !== 1){
            alert('비밀번호 확인을 진행해주세요.');
            return false;
        } else if(data.userId === ''){
            alert('닉네임이 입력되지 않았습니다.');
            return false;
        } else if(data.ph1.length < 3 || data.ph2.length < 3 || data.ph3.length < 4){
            alert('전화번호를 확인해주세요');
            return false;
        } else if(isVerified !== 2){
            alert('전화번호 인증을 완료해주세요');
            return false;
        }

        return true;
    }

    const onSubmit = async(data) => {
        if(!validate(data)){
            return false;
        }
        /**
         *
         * @type {{validate, chkUser, idDupCnt, userIdDupCnt}}
         */
        const result = await(await axios.post('/auth/join', data)).data;
        if(!result.validate){
            if(result.chkUser.idDupCnt > 0){
                alert('중복된 아이디입니다.');
                return false;
            } else if(result.chkUser.userIdDupCnt > 0){
                alert('중복된 닉네임입니다.');
                return false;
            } else {
                alert('해당 번호로 가입된 계정이 존재합니다.');
                return false;
            }
        } else {
            alert('가입되었습니다.\n로그인 후 이용 가능합니다.');
            setPossPwd(0);
            setCorrPwd(0);
            reset();
            callback();
        }
    }

    return (
        <div>
            <form id="joinFrm" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="titWrapper">
                        <div className="orange">아이디</div>
                        <div>
                            <input type="text"
                                   className="input wd_100 pl_3"
                                   name="id"
                                   {...register('id')}
                            />
                        </div>
                    </div>
                    <div className="titWrapper mt_1">
                        <div className="orange">비밀번호</div>
                        <div>
                            <input type="password"
                                   className="input wd_100 pl_3"
                                   onKeyUp={chkPwd}
                                   name="password"
                                   {...register('password')}
                            />
                        </div>
                        <span>
                            {possPwd === 0 ? '' : possPwd === 1 ? (<span className="pwd poss pt_1">사용가능합니다</span>) : (<span className="pwd imposs pt_1">최소 1개의 특수문자를 포함한 8자리 이상이어야 합니다.</span>)}
                        </span>
                    </div>
                    <div className="titWrapper">
                        <div className="orange">비밀번호확인</div>
                        <div>
                            <input type="password"
                                   className="input wd_100 pl_3"
                                   onKeyUp={comparePwd}
                                   name="valitPwd"
                                   {...register('valitPwd')}
                            />
                        </div>
                        <span>{corrPwd === 0 || possPwd !== 1 ? '' : corrPwd === 1 && possPwd === 1 ? (<span className="pwd poss pt_1">일치합니다</span>) : (<span className="pwd imposs pt_1">일치하지 않습니다</span>)}</span>
                    </div>
                    <div className="titWrapper mt_1">
                        <div className="orange">닉네임</div>
                        <div>
                            <input type="text"
                                   className="input wd_100 pl_3"
                                   name="userId"
                                   {...register('userId')}
                            />
                        </div>
                    </div>
                    <div className="titWrapper mt_1">
                        <div className="orange">전화번호</div>
                        <div className="flex j_center">
                            <input type="number"
                                   className="input center wd_30 mr_5"
                                   onInput={phOnChange}
                                   name="ph1"
                                   readOnly={isVerified === 2}
                                   {...register('ph1')}
                            />
                            <input type="number"
                                   className="input center wd_30 mr_5"
                                   onInput={phOnChange}
                                   name="ph2"
                                   readOnly={isVerified === 2}
                                   {...register('ph2')}
                            />
                            <input type="number"
                                   className="input center wd_30"
                                   onInput={phOnChange}
                                   name="ph3"
                                   readOnly={isVerified === 2}
                                   {...register('ph3')}
                            />
                        </div>
                        {
                            isVerified === 0 ?
                                (<a className="btn orange mt_1"
                                    onClick={reqVerifyPh}
                                >인증번호 전송</a>)
                                : null
                        }
                    </div>
                    {
                        isVerified === 1 ?
                            (<div className="titWrapper mt_1">
                                <div className="orange">인증번호 입력</div>
                                <div className="flex j_center">
                                    <input type="number"
                                           value={verifyNumber.val}
                                           onChange={verifyNumber.onChange}
                                           className="input center wd_100 pl_3"
                                    />
                                </div>
                                <a className="btn orange mt_1"
                                   onClick={verifyPh}
                                >인증완료</a>
                            </div>)
                            : isVerified === 2 ?
                                (<div className="flex j_center mt_1">
                                    <span className="orange">인증되었습니다.</span>
                                </div>)
                                : null
                    }
                </div>
                <a className="btn bg_orange bd_orange mt_3"
                   onClick={handleSubmit(onSubmit)}
                >회원가입</a>
            </form>
        </div>
    )
}

export default JoinModal;