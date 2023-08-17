import {useForm} from "react-hook-form";
import axios from "axios";


function AddPlanModal({callback}){

    const {register, setValue, handleSubmit, reset} = useForm();

    const onSubmit = async(data) => {
        if(!validate(data)) return false;
        const result = await(await axios.post('/pln/insertPlanDay', data)).data;
        if(result > 0){
            alert('등록되었습니다.');
            reset();
            callback();
        }
    }

    const validate = (form) => {
        let startTm = new Date(0,0,0, convertTm(form.startTm).hours, convertTm(form.startTm).minutes);
        let endTm = new Date(0,0,0, convertTm(form.endTm).hours, convertTm(form.endTm).minutes);
        if(form.nm === ''){
            alert('제목을 입력해주세요.');
            return false;
        } else if(startTm >= endTm){
            alert('시작시간은 종료시간보다 앞설 수 없습니다.');
            return false;
        } else {
            return true;
        }
    }

    const convertTm = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return {hours, minutes};
    }

    return (
        <div>
            <form id="addPlanFrm" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div>
                    <div className="titWrapper">
                        <div className="orange">일정이름</div>
                        <div>
                            <input className="input wd_100"
                                   type="text" name="nm" {...register('nm')}/>
                        </div>
                    </div>
                    <div className="titWrapper">
                        <div className="orange">시작시간</div>
                        <div>
                            <input className="input wd_100"
                                   type="time"
                                   name="startTm"
                                   defaultValue={'00:00'}
                                   {...register('startTm')}
                            />
                        </div>
                    </div>
                    <div className="titWrapper mb_3">
                        <div className="orange">종료시간</div>
                        <div>
                            <input className="input wd_100"
                                   type="time"
                                   name="endtm"
                                   defaultValue={'23:59'}
                                   {...register('endTm')}/>
                        </div>
                    </div>
                </div>
                <a className="btn orange bd_orange"
                   onClick={handleSubmit(onSubmit)}
                >추가</a>
            </form>
        </div>
    )
}

export default AddPlanModal;