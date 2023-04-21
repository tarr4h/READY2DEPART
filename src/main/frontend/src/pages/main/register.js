import '../../css/register.css';
import '../../css/Comn.css';
import {useState} from "react";
import {useForm} from "react-hook-form";

function Register(){

    const [searchLoc, setSearchLoc] = useState(false);
    const {register, handleSubmit} = useForm();

    function showSearchLoc(){
        setSearchLoc((current) => !current);
    }

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <div>
            <form id="regFrm" onSubmit={handleSubmit(onSubmit)}>
                <div className="register_wrapper">
                    <div className="line_case">
                        <div className="line_tit">
                            <span>제목</span>
                        </div>
                        <div className="line_body">
                            <input type="text" name="title" {...register("title")}/>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>장소</span>
                            <div className="tit_btn">
                                <a>현재위치</a>
                                <a onClick={showSearchLoc}>위치검색</a>
                            </div>
                        </div>
                        <div className="line_body">
                            <input type="text" name="location" {...register("location")}/>
                        </div>
                        <div className="line_foot">
                            <div className="search_loc"
                                 style={
                                    searchLoc ? {} : {display:'none'}
                                 }
                            ></div>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>장소명</span>
                        </div>
                        <div className="line_body">
                            <input type="text" name="locNm" {...register("locNm")}/>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>내용</span>
                        </div>
                        <div className="line_body">
                            <textarea name="content" cols="30" rows="10" {...register("content")}></textarea>
                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>사진</span>
                            <div className="tit_btn">
                                <label
                                    htmlFor="fileInput"
                                >파일 등록</label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    name="file"
                                    {...register("file")}
                                    multiple={true}
                                    hidden={true}
                                />
                            </div>
                        </div>
                        <div className="line_body">

                        </div>
                    </div>
                    <div className="line_case">
                        <div className="line_tit">
                            <span>추가정보</span>
                            <div className="tit_btn">
                                <a>입력하기</a>
                            </div>
                        </div>
                    </div>
                    <a className="registerBtn" onClick={handleSubmit(onSubmit)}>등록하기</a>
                </div>
            </form>
        </div>
    )
}

export default Register;