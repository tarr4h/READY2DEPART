import {useForm} from "react-hook-form";
import axios from "axios";


function AddPlanModal(){

    const {register, setValue, handleSubmit} = useForm();

    const onSubmit = async(data) => {
        console.log('data : ', data);

        const result = await(await axios.post('/plan/insertPlanDay', data)).data;
        console.log('result data : ', result);
    }

    return (
        <div>
            <form id="addPlanFrm" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div>
                    <div>
                        <div>일정이름</div>
                        <input type="text" name="nm" {...register('nm')}/>
                    </div>
                    <div>
                        <div>시작시간</div>
                        <input type="time"
                               name="startTm"
                               defaultValue={'00:00'}
                               {...register('startTm')}
                        />
                    </div>
                    <div>
                        <div>종료시간</div>
                        <input type="time"
                               name="endtm"
                               defaultValue={'00:00'}
                               {...register('endTm')}/>
                    </div>
                </div>
                <a className="btn"
                   onClick={handleSubmit(onSubmit)}
                >추가</a>
            </form>
        </div>
    )
}

export default AddPlanModal;