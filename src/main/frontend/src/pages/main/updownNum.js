function UpdownNum({num, onChange}){
    async function upProcess(){
        num.current = num.current + 1;
        await onChange();
    }

    async function downProcess(){
        num.current = num.current === 1 ? 1 : num.current - 1;
        await onChange();
    }

    return (
        <div className="plusminusWrapper">
            <a onClick={upProcess}
                    className="plus_btn"
            ></a>
            <a onClick={downProcess}
                    className="minus_btn"
            ></a>
        </div>
    )

}

export default UpdownNum;