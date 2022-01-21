import axios from 'axios';
import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { useHistory } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import { getEtfSymbol } from '../helpers/utils';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

let percent: number = 0
let risk: string
const chartStyle = {
    height: 150,
    width: 350,
}
const ProfilePerformance = (props: any) => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const [etfName, setEtfName] = useState("")
    const [rewardsInvested, setRewardsInvested] = useState("")
    const [moneyInvested, setMoneyInvested] = useState("")
    const [chartData, setChartData] = useState([]);
    const [ isChartReady, setChartReady ] = useState(false)
    const location = useHistory()

    useEffect(() => {
        axios({
            method: "GET",
            url: `${baseUrl}/api/risk/profile/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        }).then(res => risk = res.data.risk_analysis)
            .catch(err => console.log(err))//eslint-disable-next-line

        axios({
            method: "GET",
            url: `${baseUrl}/api/risk/etf/performance/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        }).then(res => {
            setEtfName(res.data.etf.name)
            setMoneyInvested(res.data.money_invested)
            setRewardsInvested(res.data.rewards_invested)
            const etfName = res.data.etf.name || '';
            const symbol = getEtfSymbol(etfName);
            axios({
                method: 'get',
                url: `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data`,
                params: { symbol, region: 'US' },
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_YAHOO_FINANCE_API_KEY,
                    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
                }
            }).then(function (response) {
                let mainArray: any = [['', 'Close']];
                let chartData = response.data || [];
                const prices = chartData.prices ? chartData.prices.reverse() : [];
                chartData = prices.map((item: any) => {
                    const date = new Date(item.date * 1000);
                    return [`${date.getMonth() + 1}/${date.getFullYear()}`, item.close]
                });
                mainArray = [...mainArray, ...chartData];
                setChartData(mainArray);
                setChartReady(true)
            }).catch(function (error) {
                console.error(error);
            });
        })
            .catch(err => console.log(err))
        //eslint-disable-next-line
    }, [props.rerender])

    let history = useHistory();
    if (props.riskProfile === "low risk") {
        percent = 0.15
        risk = "LOW"
    }
    if (props.riskProfile === "moderate risk") {
        percent = 0.50
        risk = "MODERATE"
    }
    if (props.riskProfile === "high risk") {
        percent = 0.85
        risk = "HIGH"
    }
    return (
        <>
            <div className="flex row header">
                <img className="fit-height" src={require('../Assets/pro-performance.svg').default} alt="credit-card" />
                <p className="card-title">Profile Dashboard</p>
            </div>
            { !props.hasTransactions ? <>

                <div className="flex row gauge-flex">
                    <div>
                        <GaugeChart id="gauge-chart2"
                            style={chartStyle}
                            className="gauge"
                            nrOfLevels={6}
                            arcWidth={0.3}
                            arcPadding={0.1}
                            cornerRadius={1}
                            needleColor="#E06135"
                            colors={["#507DC6", "#1B9CC8", "#39C3C3", "#FFCA45", "#E86F51", "#9D566E"]}
                            percent={percent}
                            hideText={true} />
                        <p className="risk-exp">Based on your responses, your financial risk exposure is <b>{risk}</b></p>
                    </div>
                    <button className="login spacing retake-sizing" onClick={e => history.push("/risk")}>Retake Assessment</button>
                </div>
            </>
                :
                <div className="flex row">
                    { 
                    isChartReady ? 
                    <div style={{marginLeft : "-1rem"}}>
                        <Chart
                            width={'480px'}
                            height={'220px'}
                            chartType="AreaChart"
                            loader={ chartData.length < 10 ? <div>Loading Chart</div> : <></>}
                            data={chartData}
                            options={{
                                chart: {
                                    title: 'Profile Performance',
                                },
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </div> :
                    <div style={{width : "480px", display: "flex", justifyContent : "center" , alignItems : "center"}}>
                        <Loader type="Watch" color="#00BFFF" height={80} width={80}/>
                    </div>
                    }
                    
                    
                    <div className="flex col etf-container" style={{ alignItems: "flex-start", marginLeft: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                            <p className="etf-name">{etfName}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                            <div style={{ display: "flex", flexDirection: "column", borderBottom: "1.5px solid grey", width: "12vw", marginBottom: "0.5rem" }}>
                                <p className="etf-title">Total Points invested</p>
                                <p style={{ marginBottom: "0.5rem" }} className="values-rp flex row rp-container"><img className="ms-currency" src={require('../Assets/logo-blue.svg').default} alt="dolla" style={{ marginRight: '0.5rem' }} />{rewardsInvested}</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                            <div style={{ display: "flex", flexDirection: "column", borderBottom: "1.5px solid grey", width: "12vw", marginBottom: "0.5rem" }}>
                                <p className="etf-title">Total Money Invested</p>
                                <p className="values-money">$ {moneyInvested}</p>
                            </div>
                        </div>
                        <button className="login" onClick={e => location.push("/performance")}>View More</button>
                    </div>
                </div>
            }
        </>
    );
}

export default ProfilePerformance;