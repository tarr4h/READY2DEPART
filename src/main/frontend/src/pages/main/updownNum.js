function UpdownNum({num, setNum, onChange}){
    const upProcess = async() => {
        console.log('num + ', num);
        setNum(current => current + 1);
        onChange();
    }

    const downProcess = () => {
        console.log('num - ', num);
        setNum(current => current !== 1 ? current - 1 : current);
        onChange();
    }

    return (
        <div>
            <button onClick={upProcess}
            >up</button>
            <span>{num}</span>
            <button onClick={downProcess}
            >down</button>
        </div>
    )

}

export default UpdownNum;