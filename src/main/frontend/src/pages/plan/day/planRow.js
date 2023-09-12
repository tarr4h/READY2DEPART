import {useNavigate} from "react-router-dom";
import * as comn from "../../../comn/comnFunction";

function PlanRow({plan, onChange, size, isChecked}){

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
            (size === 'big' ? "pl_3 pr_3 pt_1 pb_1" : "") + ' planRow'
            + (isChecked ? ' bd_orange' : '')
        }
             key={plan.id}>
            <div>
                <input type="checkbox"
                       onChange={onChange}
                       value={plan.id}
                />
            </div>
            <div className="planRowCont"
                 onClick={size === 'big' ? showDetail : null}
            >
                <div>
                    <div>{plan.nm}</div>
                    <div>{plan.region}</div>
                </div>
                <div>
                    <div>{plan.description}</div>
                    <div>{plan.startTm} ~ {plan.endTm}</div>
                </div>
            </div>
        </div>
    )
}


export default PlanRow;

