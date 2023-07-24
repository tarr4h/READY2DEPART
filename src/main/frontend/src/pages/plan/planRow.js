import {useNavigate} from "react-router-dom";


function PlanRow({plan, onChange, size}){

    const navigate = useNavigate();

    const showDetail = () => {
        navigate('/plan/planDetail', {
            state : {
                plan
            }
        });
    }

    return (
        <div className={
            size === 'big' ? "planRow pl_3 pr_3" : "planRow"
        }
             key={plan.id}>
            <div>
                <input type="checkbox"
                       onChange={onChange}
                       value={plan.id}
                />
            </div>
            <div onClick={size === 'big' ? showDetail : null}
            >{plan.nm}</div>
            <div>{plan.startTm} ~ {plan.endTm}</div>
        </div>
    )
}


export default PlanRow;

