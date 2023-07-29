

function FindLocSearchResultModal({resultList, callback}){

    const sendResponse = (obj) => {
        const id = obj.target.id;
        callback(resultList[id]);
    }

    return (
        <div>
            {
                resultList.map((item, index) => (
                    <div key={index}
                         className="searchResultRow"
                         onClick={sendResponse}
                         id={index}
                    >
                        {item.address_name}
                    </div>
                ))
            }
        </div>
    )
}

export default FindLocSearchResultModal;