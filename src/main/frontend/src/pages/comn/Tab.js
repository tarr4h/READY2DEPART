import {useEffect} from "react";


function Tab({title, page, active}){

    return (
        <div>
            {
                active ? page : null
            }
        </div>
    )
}

export default Tab;