

function PlanRow({plan, onChange}){
    return (
        <div className="planRow" key={plan.id}>
            <div>
                <input type="checkbox"
                       onChange={onChange}
                       value={plan.id}
                />
            </div>
            <div>{plan.nm}</div>
            <div>{plan.startTm} ~ {plan.endTm}</div>
        </div>
    )
}


export default PlanRow;

