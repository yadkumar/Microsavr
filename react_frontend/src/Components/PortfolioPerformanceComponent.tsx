import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { useHistory } from 'react-router-dom';
import '../CSS/PortfolioPerformance.css'
import Banner from './BannerComponent';
import PortfolioHistoryItem from './PortfolioHistoryItemComponent';
import { getEtfSymbol } from "../helpers/utils";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const PortfolioPerformance = (props: any) => {
    const history = useHistory();
    const [chartData, setChartData] = useState([[0, 0]]);
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const [pfolioName, setPfolioName] = useState("0")
    const [totalMoney, setTotalMoney] = useState("0")
    const [ isChartReady, setChartReady ] = useState(false)
    const [historyData, setHistoryData] = useState<Array<any>>();

    useEffect(() => {
        axios.interceptors.response.use(    //Handles the "Unhandled promise rejection" errors
            response => response,
            error => {
                throw error;
            }
        );
        axios({
            method: "GET",
            url: `${baseUrl}/api/risk/etf/performance/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        }).then(res => {
            setPfolioName(res.data.etf.name);
            setTotalMoney(res.data.money_invested);
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
            .catch(err => console.log(err)) //eslint-disable-next-line
    }, [])

    useEffect(() => {
        axios({
            method: "GET",
            url: `${baseUrl}/api/risk/etf/transactions/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        }).then(res => {
            console.log(res.data);
            setHistoryData(res.data);
        }).catch(err => console.log(`${baseUrl}/api/risk/etf/transactions/`, err)) //eslint-disable-next-line
    }, [])

    return (
        <>
            <Banner />
            <div className="flex col outermost-container" style={{ rowGap: 5 }}>
                <div>
                    <button className="home-button" onClick={e => history.push("/dashboard")}><img style={{ height: 20, marginRight: 10 }} src={require("../Assets/back.jpg").default} alt="back" />Back to home page</button>
                </div>
                <p style={{ fontSize: 20, fontWeight: 500 }}>My Portoflio Performance</p>
                <div className="flex row facts-container" style={{marginTop : "2rem"}}>
                    <div className="flex row" style={{ width: "100%", height: "max-content", justifyContent: "space-around" }}>
                        <div className="flex row" style={{ width: "20vw", alignItems: "center", columnGap: 10, borderRight: "1px solid #23202180" }}>
                            <img style={{ height: 40 }} src={require('../Assets/$.svg').default} alt="dollar" />
                            <div className="flex col">
                                <p style={{ color: "#23202180", fontSize: 16 }}>Portfolio Name</p>
                                <p style={{ fontSize: 20 }}>{pfolioName}</p>
                            </div>
                        </div>

                        <div className="flex row" style={{ width: "20vw", alignItems: "center", columnGap: 10, borderRight: "1px solid #23202180"}}>
                            <img style={{ height: 30 }} src={require('../Assets/logo-blue.svg').default} alt="logo-blue" />
                            <div className="flex col">
                                <p style={{ color: "#23202180", fontSize: 16 }}>Total Money Invested</p>
                                <p style={{ fontSize: 30 }}>{totalMoney}</p>
                            </div>
                        </div>

                        <div className="flex row" style={{ width: "20vw", alignItems: "center", columnGap: 10 }}>
                            <img style={{ height: 30 }} src={require('../Assets/milestone.svg').default} alt="milestone" />
                            <div className="flex col">
                                <p style={{ color: "#23202180", fontSize: 16 }}>Present Value</p>
                                <p style={{ fontSize: 30 }}>{totalMoney}</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex row" style={{ justifyContent: "space-between", marginTop: "2rem" }}>
                    {/* Div for graphs - anubhav */}
                    <div className="flex col outline">
                        <div className="flex row header">
                            <img className="fit-height" src={require('../Assets/pro-performance.svg').default} alt="credit-card" />
                            <p className="card-title">Profile Performance</p>
                        </div>
                        { 
                        isChartReady ? 
                                <Chart
                                width={'520px'}
                                height={'220px'}
                                chartType="AreaChart"
                                loader={<div>Loading Chart</div>}
                                data={chartData}
                                options={{
                                    chart: {
                                        title: 'Profile Performance',
                                    },
                                }}
                                rootProps={{ 'data-testid': '1' }}
                            /> : 
                        <div style={{width : "520px",height: "220px", display: "flex", justifyContent : "center" , alignItems : "center"}}>
                            <Loader type="Watch" color="#00BFFF" height={80} width={80}/>
                        </div>
                        }
                        
                    </div>
                    <div className="flex col outline">
                        <div className="flex row header">
                            <img className="fit-height" src={require('../Assets/pro-performance.svg').default} alt="credit-card" />
                            <p className="card-title">Predicted Performance</p>
                        </div>

                        <Chart
                            width={'520px'}
                            height={'220px'}
                            chartType="LineChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['', ''],
                                [1, 15],
                                [2, 10],
                                [3, 23],
                                [4, 17],
                                [5, 18],
                                [6, 9],
                                [7, 11],
                                [8, 27],
                            ]}
                            options={{
                                chart: {
                                    title: 'Profile Performance',
                                },
                                series: {
                                    0: { curveType: 'function' },
                                }
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </div>
                </div>

                <div className="flex col outline" style={{marginTop : "2rem"}}>
                    <div className="flex row header">
                        <img className="fit-height" src={require('../Assets/invoices.svg').default} alt="credit-card" />
                        <p className="card-title">Portfolio History</p>
                    </div>

                    <div className="column-headings flex row">
                        <p>{`Date & time`}</p>
                        <p>Portfolio Name</p>
                        <p className="left-margin">Money Invested</p>
                        <p>ETF value/unit</p>
                        <p>No of ETF units purchased</p>
                    </div>
                    <hr />
                    <div className="history-list">
                        {
                            historyData?.map((item) => {
                                return(<PortfolioHistoryItem transaction={item} pfolioName={pfolioName}/>);
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default PortfolioPerformance;