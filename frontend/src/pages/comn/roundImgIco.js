function RoundImgIco({img, onClick}){


    return (
        <img src={require(`../../img/${img}`)}
             className="roundImgIco"
             onClick={onClick}
             alt=""/>
    )
}

export default RoundImgIco;