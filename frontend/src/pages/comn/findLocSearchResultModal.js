import {useEffect, useRef} from "react";

function FindLocSearchResultModal({resultList, callback}){

    const wpRef = useRef(null);

    useEffect(() => {
        wpRef.current.scrollTop = 0;
    }, [resultList]);

    const sendResponse = (obj) => {
        const id = obj.currentTarget.id;
        callback(resultList[id]);
    }

    return (
        <div className="locSearchResultModalWrapper"
             ref={wpRef}
        >
            {
                resultList.map((item, index) => (
                    <div key={index}
                         className="searchResultRow"
                         onClick={sendResponse}
                         id={index}
                    >
                        {
                            item.place_name == null ?
                                null
                                :
                                (<div className="orange mb_1"
                                >{item.place_name}</div>)
                        }
                        {item.address_name}
                    </div>
                ))
            }
        </div>
    )
}

export default FindLocSearchResultModal;