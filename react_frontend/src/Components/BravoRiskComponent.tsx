import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import '../CSS/BravoRisk.css'
import '../CSS/RiskProfile.css';
import GaugeChart from 'react-gauge-chart'

const gaugeStyle= {
    width: 600,
    marginLeft: -90,
    marginRight: -90,
    marginTop: -10,
}
let percent : number = 0
let risk : string
const BravoRisk = (props : any) => {
    if(props.riskProfile === "low risk"){
        percent = 0.15
        risk = "LOW"
    }
    if(props.riskProfile === "moderate risk"){
        percent = 0.50
        risk = "MODERATE"
    }
    if(props.riskProfile === "high risk"){
        percent = 0.85
        risk = "HIGH"
    }

    let history = useHistory()

    useEffect(() => {
        if(localStorage.getItem("token") === null)  //Check if unauthorized access is happening
            history.push("/unauthorized")//eslint-disable-next-line
    },[])
    return(
        <>
        <div className="flex outer-container">
            <div className="bg-risk push-back">
                <NavLink to="/"><img className="navigate-logo bubble" src={require('../Assets/logo.svg').default} alt="logo" /></NavLink>
                <img className="left-top" src={require('../Assets/left-top.svg').default} alt="decoration-1"/>
                <img className="blob" src={require('../Assets/blob.svg').default} alt="blob" />
                <img className="circle" src={require('../Assets/circle.svg').default} alt="circle" />
                <img className="watering-risk-bravo" src={require('../Assets/watering.svg').default} alt="watering"/>
            </div>
            <div className="gauge-container flex col">
                <p className="flex col title"><b className="bravo">BRAVO!</b>You have completed the risk profiling</p>
                <p className="risk-exposure">Based on your responses, your financial risk exposure is <b>{risk}</b></p>
                
                
                <div className="flex col gauge-indicators-container">
                    <b className="indicators">MODERATE</b>
                    <div className="flex row align-indicators">
                        <b className="indicators">LOW</b>
                        <GaugeChart id="gauge-chart1"
                        style={gaugeStyle}
                        className="gauge"
                        nrOfLevels={6}
                        arcWidth={0.3}
                        arcPadding={0.1}
                        cornerRadius={1}
                        needleColor="#E06135"
                        colors={["#507DC6", "#1B9CC8", "#39C3C3", "#FFCA45", "#E86F51", "#9D566E"]}
                        percent={percent}
                        hideText={true}/>
                        <b className="indicators">HIGH</b>
                    </div>
                    
                </div>
               
                <p className="risk-exposure negative-margin">Continue your bill payment and investment with us</p>
                <div className="flex col button-grp">
                    <button className="classic spacing" onClick={e => history.push("/dashboard")}>Continue</button>
                    <button className="login spacing" onClick={e => history.push("/risk")}>Retake Assessment</button>
                </div>
            </div>
        </div>
        </>
    );
}

export default BravoRisk;