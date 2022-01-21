import axios from 'axios';
import React, { useState } from 'react'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import '../CSS/SingleCard.css'

const SingleCard = (props: any) => {
    const [showBtn, setShowBtn] = useState("hide-btns");
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    const handleRemoveCard = (creditCardNo: any) => {
        axios({
            method: 'delete',
            url: `${baseUrl}/api/user/credit/cards/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem("token")
            },
            data: {
                "card_no": creditCardNo
            },
        }).then(res => {
            // props.setRenderer(true);
            props.setRenderer(res.data.card);
        }).catch(err => {
            console.log(err)
        });
    }

    return (
        <div className="credit-card-container"
            onMouseEnter={() => setShowBtn("show-btns")} onMouseLeave={() => setShowBtn("hide-btns")}>

            <img className="credit-card-img" src={props.image} alt="credit-card" />

            <div className="col-block-card-no">
                <div className="heading"> {props.card && props.card['bank_name']}
                </div>
                <div className="value"> {props.card && props.card['card_no']}
                </div>
            </div>

            <div className="col-block-due-date" >
                <div className="heading"> Due Date </div>
                <div className="value"> {props.dueDate} </div>
            </div>

            <div className="col-block-min-amt-due">
                <div className="heading"> Min Amt Due </div>
                <div className="value"> ${props.card && props.card['min_amt_due']} </div>
            </div>

            <div className={"hover-btns flex row " + showBtn}>
                <button className="pay-now-btn-cc" onClick={() => props.payNow(props.card)}>Pay now</button>

                <ContextMenuTrigger id={`remove-card-menu${props.idx}`} holdToDisplay={1}>
                    <img className="three-dots-cc"
                        src={require('../Assets/dashboard-vertical-dots.svg').default} alt="carrot-menu" />
                </ContextMenuTrigger>
                <ContextMenu id={`remove-card-menu${props.idx}`}>
                    <MenuItem onClick={() => handleRemoveCard(props.card && props.card['card_no'])}>
                        <div className="add-card-context flex row">
                            <img className="plus-outline" src={require('../Assets/plus-outline.svg').default} alt="add card" />
                            <p className="add-new-card-dash">Remove card</p>
                        </div>
                    </MenuItem>
                </ContextMenu>
            </div>
        </div>
    );
}

export default SingleCard;