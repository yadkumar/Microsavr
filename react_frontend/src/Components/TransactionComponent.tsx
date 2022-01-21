import axios from 'axios';
import React, { useEffect, useState } from 'react';
import purpleCreditCard from '../Assets/purple-tilted-credit-card.svg'
import yellowCreditCard from '../Assets/yellow-tilted-credit-card.svg'
import blueCreditCard from '../Assets/blue-tilted-credit-card.svg'
import '../CSS/Transaction.css'

const Transaction = (props: any) => {
    const [transaction, setTransaction] = useState<Array<any>>([]);
    const baseUrl = process.env.REACT_APP_BACKEND_URL;  //eslint-disable-next-line
    const bankArray: any = []    //Set because I want to select unique bank values
    const [selectedBank, setSelectedBank] = useState('None');

    // let options : any = []
    useEffect(() => {
        axios({
            method: 'get',
            url: `${baseUrl}/api/user/transactions/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        }).then(res => {
            console.log(res.data.card)
            setTransaction(res.data);
        }).catch(err => {
            console.log(err)
        });

        axios({
            method: 'get',
            url: `${baseUrl}/api/user/credit/cards/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        }).then(res => {
            //console.log(res.data.card)
            res.data.card.map((elem: any) => bankArray.push(elem.bank_name))
            console.log("Bank array : " + JSON.stringify(bankArray))
            // bankArray.forEach(addValues)
            // function addValues(values : any)    //Function to add values to the select box
            // {   
            //     optionsArray.push({'value' : values, 'label' : values})
            // }
            //optionsArray.shift()

            //console.log("Options: " + JSON.stringify(options))
        }).catch(err => {
            console.log(err)
        }); //eslint-disable-next-line
    }, [props.trigger, props.transactions]);

    let creditCardImgArr: any = [purpleCreditCard, yellowCreditCard, blueCreditCard];

    const getTransactionsList = () => {
        const isBankSelected = selectedBank !== 'None';
        const filteredTrans = isBankSelected ? transaction.filter(trans => trans['card']['bank_name'] === selectedBank) : transaction;

        return filteredTrans.map((trans, index) => (<><div>
            <div className="transaction-container">
                <div className="credit-card-img-container">
                    <img className="credit-card-img" src={creditCardImgArr[index % 3]} alt="credit-card" />
                </div>
                <div className="col-block-card-no">
                    <div className="heading"> {trans['card']['bank_name']}
                    </div>
                    <div className="value"> {trans['card']['card_no']}
                    </div>
                </div>
                <div className="col-block-card-no">
                    <div className="heading"> Amount Paid
                            </div>
                    <div className="value"> {trans['amt']}
                    </div>
                </div>
                <div className="col-block-card-no">
                    <div className="heading"> Paid Date
                            </div>
                    <div className="value"> {trans['date']}
                    </div>
                </div>
                <div className="col-block-card-no">
                    <div className="heading"> Reward Points Earned
                            </div>
                    <div className="value"> {trans['points']}
                    </div>
                </div>
            </div>
            <hr></hr>
        </div>
        </>))
    }

    const getBankOptions = () => {
        const bankNames = transaction.map(trans => trans['card']['bank_name']);
        const uniqueNames: any = bankNames.filter((item, index) => bankNames.indexOf(item) === index);
        uniqueNames.unshift('None');
        return uniqueNames.map((item: string) => <option>{item}</option>);
    }

    return (
        <>
            <div className="flex row header">
                <img className="fit-height" src={require('../Assets/invoices.svg').default} alt="transaction-history" />
                <p className="card-title">Transaction History</p>
                <div style={{ marginLeft: "auto" }}>
                    <b style={{ marginRight: 2 }}>Filter Cards: </b>
                    <select onChange={e => setSelectedBank(e.target.value)} value={selectedBank} >
                        {getBankOptions()}
                    </select>
                </div>
            </div>
            <div className="transaction-outer-container">
                {transaction.length === 0 ? <b style={{ textAlign: "center" }}>No transactions for this card</b> : getTransactionsList()}
            </div>
        </>
    );
}

export default Transaction;