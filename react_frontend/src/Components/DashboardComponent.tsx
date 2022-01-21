import React, { useEffect, useState } from 'react';
import '../CSS/Dashboard.css';
import Banner from './BannerComponent';
import CreditCard from './CreditCardComponent';
import RewardDetailsCard from './RewardDetailsCard';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Transaction from './TransactionComponent';
import ProfilePerformance from './ProfilePerformanceComponent'
import axios from 'axios';
import AddCardModal from "./AddCardModal";
import { useHistory } from 'react-router';

const Dashboard = (props: any) => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const location = useHistory();
    const [poinstsEarned, setPointsEarned] = useState("");
    const [pointsInvested, setPointsInvested] = useState("");
    const [nextMilestone, setMilestone] = useState("");
    const [hasTransactions, setHasTransactions] = useState(true);
    const [rerender, setRerender] = useState(false);
    const [creditCards, setCreditCards] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [addCardModalVisible, setAddCardModalVisible] = useState(false);
    const [ trigger, setTrigger ] = useState(1)

    useEffect(() => {
        axios({
            method: 'get',
            url: `${baseUrl}/api/user/rewards/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        }).then(res => {
            const earned = (res.data && res.data.points_earned);
            const invested = (res.data && res.data.money_invested) || (res.data && res.data.points_earned);
            setPointsEarned(earned);
            setPointsInvested(invested - 2000 + res.data.reward_milestone || 0);
            setMilestone(res.data.reward_milestone || 2000)
        }).catch(err => {
            console.log(err)
        });

        axios({
            method: 'get',
            url: `${baseUrl}/api/user/transactions/`,   //Check if transactions for that user exist or not
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        }).then(res => {
            if (JSON.stringify(res.data) === "[]") {
                setHasTransactions(false);
            } else {
                setTransactions(res.data);
                setHasTransactions(true);
            }
        }).catch(err => {
            console.log(err)
        });
        //eslint-disable-next-line
    }, [trigger])


    useEffect(() => {
        if (localStorage.getItem("token") === null)  //Check if unauthorized access is happening
            location.push("/unauthorized")

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);//eslint-disable-next-line
    }, []);

    const addCardHandler = async (cardNum: Number) => {
        try {//eslint-disable-next-line
            const resp = await axios({
                method: "POST",
                url: `${baseUrl}/api/user/credit/cards/`,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Token ' + localStorage.getItem("token")
                },
                data: {
                    card_no: cardNum
                },
            });
            setAddCardModalVisible(false);
            setCreditCards(resp.data.card);
        } catch (e) {
            console.log("Error : ", e);
        }
    }

    return (
        <>
            <Banner />
            <div className="flex col outermost-container">
                <div className="flex row row-container">
                    <div className="flex col outline right-quad" style={{overflow: "auto", height: "30vh"}}>
                        <div className="flex space-between">
                            <div className="flex">
                                <img className="credit-card-img" src={require('../Assets/credit-card.svg').default} alt="credit-card" />
                                <p className="card-title">Credit Cards</p>
                            </div>
                            <ContextMenuTrigger id="add-card-menu" holdToDisplay={0}>
                                <div>
                                    <img className="vertical-dots" src={require('../Assets/dashboard-vertical-dots.svg').default} alt="credit-card" />
                                </div>
                            </ContextMenuTrigger>

                            <ContextMenu id="add-card-menu">
                                <MenuItem>
                                    <div className="add-card-context flex row" onClick={() => setAddCardModalVisible(true)}>
                                        <img className="plus-outline" src={require('../Assets/plus-outline.svg').default} alt="add card" />
                                        <p className="add-new-card-dash">Add new card</p>
                                    </div>
                                </MenuItem>
                            </ContextMenu>
                        </div>
                        <CreditCard creditCards={creditCards} setTrigger={setTrigger} trigger={trigger} setRerender={setRerender} rerender={rerender} setTransactions={setTransactions} />
                        {<AddCardModal
                            modalVisible={addCardModalVisible}
                            modalHideShowHandler={setAddCardModalVisible}
                            addCardHandler={addCardHandler}
                        />}
                    </div>

                    <div className="flex col outline left-quad" style={{height:"30vh"}}>
                        <Transaction rerender={rerender} transactions={transactions} setTrigger={setTrigger} trigger={trigger}/>
                    </div>
                </div>
                <div className="flex row row-container">

                    <div className="flex col outline right-quad reward">
                        <div className="flex row header">
                            <img className="fit-height" src={require('../Assets/star.svg').default} alt="reward-points" />
                            <p className="card-title">Reward Points</p>
                        </div>
                        <div className="flex row reward-points-row1">
                            <img className="gift-box" src={require('../Assets/gift-box.svg').default} alt="reward-gift" />
                            <div className="text">
                                <p>Congratulations</p>
                                <p className="person-name">Jason Holder</p>
                            </div>
                        </div>
                        <div className="flex row reward-points-row2">
                            <RewardDetailsCard title='Points Earned' value={poinstsEarned} icon={'earned'} />
                            <RewardDetailsCard title='Points Invested' value={pointsInvested} icon={'invested'} />
                        </div>
                        <RewardDetailsCard title='Upcoming Milestone' value={nextMilestone} icon={'milestone'} />
                    </div>
                    <div className="flex col outline left-quad">
                        <ProfilePerformance riskProfile={props.riskProfile} hasTransactions={hasTransactions} rerender={rerender} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;