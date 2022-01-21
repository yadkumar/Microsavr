import React from 'react'
import '../CSS/PortfolioHistoryItem.css'

let months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const PortfolioHistoryItem = (props: any) => {
    let t = props.transaction.created_at;
    let time = `${t.slice(8, 10)} ${months[parseInt(t.slice(5, 7))]}`;
    time += ` ${t.slice(11, 16)}`
    
    return(
        <div className="history-row flex row">
            <p>{time}</p>
            <p>{props.pfolioName}</p>
            <p className="left-margin money-invested-text">${props.transaction.money_invested}</p>
            <p className="unit-value-text">$ 5</p>
            <p className="no-of-etf-units">{props.transaction.money_invested / 5} Unit(s)</p>
        </div>
    )
}

export default PortfolioHistoryItem;