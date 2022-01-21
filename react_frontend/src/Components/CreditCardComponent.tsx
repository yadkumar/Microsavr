import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../CSS/CreditCard.css';
import purpleCreditCard from '../Assets/purple-credit-card.svg'
import yellowCreditCard from '../Assets/yellow-credit-card.svg'
import blueCreditCard from '../Assets/blue-credit-card.svg'
import SingleCard from './SingleCardComponent';

import Modal from 'react-modal'
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        background: "#23202142"
    }
};


const CreditCard = (props: any) => {
    const [cards, setCards] = useState<Array<any>>([]);
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    // var subtitle: any;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [bankNameModal, setBankNameModal] = useState("XXXXXX");
    const [cardNumModal, setCardNumModal] = useState("XXXX XXXX XXXX XXXX");
    const [dueDateModal, setDueDateModal] = useState("XX XXXX");
    const [actualCard, setActualCard] = useState("")
    const [minAmt, setMinAmt] = useState(0);
    const [fullAmt, setFullAmt] = useState(0);
    const [finalAmt, setFinalAmt] = useState(0.0);
    const [isSuccessModalOpen, setSuccessModal] = useState(false);
    const [rewardPoints, setRewardPoints] = useState("")

    const openRazorpay = () => {
        let API_KEY = process.env.REACT_APP_RZP_KEY;
        setIsOpen(false)
        let options = {
            "key": API_KEY,
            "image": require('../Assets/logo.svg').default,
            "handler": function (response: any) {
                //alert(response.razorpay_payment_id);
                axios({
                    method: "POST",
                    url: `${baseUrl}/api/user/credit/cards/payment/`,
                    headers: {
                        // add token in this format
                        'Authorization': 'Token ' + localStorage.getItem("token")
                    },
                    data: {
                        "card_no": actualCard,
                        "amt": finalAmt
                    }
                })
                    .then(res => {
                        console.log("Data: " + res.data.reward_points)
                        setRewardPoints(res.data.reward_points)
                        setSuccessModal(true);
                        props.setTrigger(props.trigger+1)
                    })
                    .catch(err => console.log(err))
            },
            "amount": finalAmt * 100,
            "currency": "USD",
            "reminder_enable": false,
            "prefill": {
                "contact": "+1502910292",
                "name": "Jason Holder",
                "email": "testing@razorpay.com",
                "method": "card",
                "card[number]": "5104 0600 0000 0008",
                "card[expiry]": "12/25",
                "card[cvv]": "123"
            },
            "notify": {
                "sms": false,
                "email": false,
            },
            "notes": {
                "address": "Hello World"
            },
            "theme": {
                "color": "#F37254",
                "hide_topbar": true
            }
        }// @ts-ignore
        var rzp1 = new Razorpay(options);
        rzp1.open();
    };

    function closeSuccessModal() {
        setSuccessModal(false)
        props.setRerender(true)
    }

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
        setFinalAmt(0.0);
    }

    useEffect(() => {
        axios({
            method: 'get',
            url: `${baseUrl}/api/user/credit/cards/`,
            headers: {
                'Content-Type': 'application/json',
                // add token in this format
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        }).then(res => {
            // console.log(res.data.card)
            setCards(res.data.card)
        }).catch(err => {
            console.log(err)
        }); //eslint-disable-next-line
    }, [props.creditCards, props.trigger]);

    const payNowHandler = (card: any) => {
        console.log(card);
        openModal();
        setBankNameModal(card['bank_name']);
        setCardNumModal(card['card_no'].slice(0, 4) + " XXXX XXXX " + card['card_no'].slice(-4));
        setActualCard(card['card_no'])  //For sending to /payment upon successful transaction
        setDueDateModal("12 April");
        setMinAmt(card['min_amt_due']);
        setFullAmt(card['total_amt_due']);
        setFinalAmt(card['min_amt_due']);
    }

    const [isMinChecked, setIsMinChecked] = useState(true);
    const [isFullChecked, setIsFullChecked] = useState(false);

    const [isMinSelected, setIsMinSelected] = useState("selected")
    const [isFullSelected, setIsFullSelected] = useState("unSelected");
    const [isCustomSelected, setIsCustomSelected] = useState("unSelected");

    const setAmount = (amount: number, type: string) => {
        setFinalAmt(amount);
        if (type === "min") {
            setIsMinChecked(true);
            setIsFullChecked(false);
            setIsMinSelected("selected");
            setIsFullSelected("unSelected");
            setIsCustomSelected("unSelected");
        } else if (type === "full") {
            setIsMinChecked(false);
            setIsFullChecked(true);
            setIsMinSelected("unSelected");
            setIsFullSelected("selected");
            setIsCustomSelected("unSelected");
        } else {
            setIsMinChecked(false);
            setIsFullChecked(false);
            setIsMinSelected("unSelected");
            setIsFullSelected("unSelected");
            setIsCustomSelected("selected");
        }
    }

    const creditCardImgArr: any = [purpleCreditCard, yellowCreditCard, blueCreditCard];
    const dueDates = ["15/05", "12/05", "20/05"];

    const getCards = () => {
        const cardsLength = cards.length;
        return cards.map((card, index) => <div>
            <SingleCard
                idx={index}
                card={card}
                image={creditCardImgArr[index % 3]}
                payNow={payNowHandler}
                dueDate={dueDates[index % 3]}
                rerender={props.rerender}
                // setRenderer={props.setRerender}
                setRenderer={setCards}
            />
            {index === cardsLength ? <hr /> : ""}
        </div>)
    }

    return (
        <div className="card-list-container">
            {getCards()}
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Pay now modal">

                {/* <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2> */}
                <div className="header-modal flex row">
                    <h3>Credit Card Payment</h3>
                    <img className="close-icon-modal" onClick={closeModal}
                        src={require('../Assets/close.svg').default} alt="" />
                </div>

                <div className="card-details-modal flex row">
                    <div className="card-num-div-modal">
                        <p className="sub-heading-modal">{bankNameModal}</p>
                        <p className="sub-detail-modal">{cardNumModal}</p>
                    </div>
                    <div>
                        <p className="sub-heading-modal">Due Date</p>
                        <p className="sub-detail-modal">{dueDateModal}</p>
                    </div>
                </div>

                <div className="amounts-container flex row">
                    <div className={"amt-block min-amt flex row " + isMinSelected} onClick={() => setAmount(minAmt, "min")}>
                        <input className="input-radio" checked={isMinChecked}
                            type="radio" name="pay-amount" />
                        <div>
                            <p>Pay Minimum</p>
                            <p className="large-bold">${minAmt}</p>
                        </div>
                    </div>

                    <div className={"amt-block full-amt flex row " + isFullSelected} onClick={() => setAmount(fullAmt, "full")}>
                        <input className="input-radio" checked={isFullChecked}
                            type="radio" name="pay-amount" />
                        <div>
                            <p>Pay Full Amount</p>
                            <p className="large-bold">${fullAmt}</p>
                        </div>
                    </div>

                    <div className={"amt-block custom-amt flex row " + isCustomSelected}>
                        <div>
                            <p>Enter Amount</p>
                            <div className="flex row">
                                <p className="dollar large-bold">$</p>
                                <input className="custom-amt-input large-bold" type="text"
                                    value={finalAmt} onChange={(e) => setAmount(parseFloat(e.target.value), "custom")} />
                            </div>
                        </div>
                    </div>

                    <button className="pay-now-btn-cc" onClick={openRazorpay}>Pay now</button>
                </div>
            </Modal>
            <Modal isOpen={isSuccessModalOpen} onRequestClose={closeSuccessModal} style={customStyles}>
                <div className="flex col success-modal">
                    <div className="flex row header-row">
                        <img className="payment-success" src={require('../Assets/payment-success.svg').default} alt="payment-success" />
                        <img className="close-icon-modal" onClick={closeSuccessModal} src={require('../Assets/close.svg').default} alt="close" />
                    </div>
                    <p className="payment-made">You have successfully made the payment</p>
                    <p className="grey-text">You have earned</p>
                    <div className="reward-points">
                        <img className="dolla-sign" src={require('../Assets/dolla.svg').default} alt="dolla-sign" />{rewardPoints}
                    </div>
                    <p className="grey-text">And these reward points will be invested in your portfolio!</p>
                </div>
            </Modal>
        </div>
    );
}


export default CreditCard;