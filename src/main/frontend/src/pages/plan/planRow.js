

function PlanRow({plan, onChange, size}){
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
            <div>{plan.nm}</div>
            <div>{plan.startTm} ~ {plan.endTm}</div>
        </div>
    )
}


export default PlanRow;

