import {useEffect, useState} from "react";

function Coin(){
    const [loading, setLoading] = useState(true);
    const [coins, setCoins] = useState([]);

    const [coinSelect, setCoinSelect] = useState("");

    const [exchangeUsd, setExchangeUsd] = useState(0);
    const [exchange, setExchange] = useState(0);

    useEffect(() => {
        fetch("https://api.coinpaprika.com/v1/tickers")
            .then((response) => response.json())
            .then((json) => {
                setCoinSelect(json[0].quotes.USD.price);
                setCoins(json);
                setLoading(false);
            });
    }, []);

    const exchangeCoin = (event) => {
        let val = event.target.value;
        setExchangeUsd(val);

        let coinValue = coinSelect;
        let exchangeVal = val/coinValue;
        setExchange(exchangeVal);
    }

    const coinSelectOnChange = (event) => {
        let coinValue = event.target.value;
        setCoinSelect(coinValue);

        let exchangeVal = exchangeUsd/coinValue;
        setExchange(exchangeVal);
    }

    return (
        <div>
            <h1>The Coins! {loading ? "" : `(${coins.length})`}</h1>
            {loading ? "" : (
                <div>
                    <input
                        type="number"
                        value={exchangeUsd}
                        onChange={exchangeCoin}
                        placeholder="USD to Coin"
                    />
                    <span>$ => HOW MUCH GET? : </span>
                    <input
                        type="number"
                        value={exchange}
                        readOnly={true}
                    />
                </div>
            )}
            {loading ? <strong>Loading...</strong> : (
                <select value={coinSelect} onChange={coinSelectOnChange}>
                    {coins.map((coin) =>
                        <option key={coin.id} value={coin.quotes.USD.price}>{coin.name} ({coin.symbol}) : {coin.quotes.USD.price} USD</option>
                    )}
                </select>
            )}
        </div>
    )
}

export default Coin;