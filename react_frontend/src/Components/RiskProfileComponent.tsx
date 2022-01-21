import React, { useEffect, useState } from 'react';
import '../CSS/RiskProfile.css';
import * as questionsJson from "../Assets/mockQuestions.json";
import QuestionRadio from './QuestionRadioComponent';
import { NavLink, useHistory } from 'react-router-dom';
import RangeSlider from './RangeSliderComponent';
import axios from 'axios';


export interface IQuestion {
    sl_no: number;
    question: string;
    type: string;
    image: string;
    options: object;
    descriptions?: object;
}

const RiskProfile = (props : any) => {
    let history = useHistory()
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        if(localStorage.getItem("token") === null)  //Check if unauthorized access is happening
            history.push("/unauthorized")
    })
    
    // reading the questions from json
    let questionsList: Array<IQuestion> = [];
    questionsJson.questions.forEach(q => {
        let question: IQuestion;
        if(q.descriptions) {
            question = {
                sl_no: q.sl_no,
                question: q.question,
                type: q.type,
                image: q.image,
                options: q.options,
                descriptions: q.descriptions
            }
        } else {
            question = {
                sl_no: q.sl_no,
                question: q.question,
                type: q.type,
                image: q.image,
                options: q.options
            }
        }
        
        questionsList.push(question);
    });
    let length = questionsList.length;

    const [totalQuestions, ] = useState(length);
    const [answersMap, setAnswersMap] = useState(new Map());
    const [proceedBtn, setProceedBtn] = useState("proceed-btn-reg btn-disabled");
    const onRadioBtnClick = (sl_no: number, event: any) => {
        let answer: string = event.target.value;
        setAnswersMap(new Map(answersMap.set(sl_no, answer)));
        setQuestionsAnswered(answersMap.size)
        //console.log(questionsAnswered)

        if(answersMap.size === totalQuestions){
            setProceedBtn("proceed-btn-reg")
        }
    }

    const onSliderBtnSelect = (sl_no: number, answer: any) => {
        setAnswersMap(new Map(answersMap.set(sl_no, answer)));
        setQuestionsAnswered(answersMap.size)
        //console.log(questionsAnswered)

        if(answersMap.size === totalQuestions){
            setProceedBtn("proceed-btn-reg")
        }
    }

    const HandleProceed = () => {
        if(proceedBtn === "proceed-btn-reg"){
            axios({
                method: 'post',
                url: `${baseUrl}/api/risk/profile/`,
                headers:{
                    'Content-Type': 'application/json',
                    // add token in this format
                    'Authorization': 'Token ' + localStorage.getItem("token")
                },
                data: Object.fromEntries(answersMap)
            }).then(res=>{
                console.log(res.data.risk_analysis)
                props.setProfile(res.data.risk_analysis)
                history.push("/bravo-risk")
            }).catch(err => {
                console.log(err)
            });
        }
    }

    return (
        <>
        <div className="container-risk-profile flex row">
            <div className="bg-risk flex row push-back">
                <NavLink to="/"><img className="navigate-logo bubble" src={require('../Assets/logo.svg').default} alt="logo" /></NavLink>
                <img className="left-top" src={require('../Assets/left-top.svg').default} alt="decoration-1"/>
                <img className="blob" src={require('../Assets/blob.svg').default} alt="blob" />
                <img className="circle" src={require('../Assets/circle.svg').default} alt="circle" />
            </div>

            <div className="left-risk-profile flex col">
                <p className="heading-risk black bold">How do you want to fund to your portfolio?</p>
                <img className="watering-risk" src={require('../Assets/watering.svg').default} alt="watering"/>
                <p className="counter-risk bold">{questionsAnswered}/{totalQuestions}</p>
                <p className="counter-caption-risk bold">Questions answered</p>
            </div>
            
            <div className="questions-container flex col">
            {
                questionsList.map(question => {
                    if(question.type === "radio") {
                        return(<>
                            <QuestionRadio onChange={onRadioBtnClick} data={question}/>
                            { question.image !== "no" ? <img src={require("../Assets/table.svg").default} alt="table"/> : null}
                            </>)
                    } else {
                        return(<RangeSlider data={question} onChange={onSliderBtnSelect} />);
                    }
                })
            }
            <button  type="submit" className={proceedBtn + " questions-proceed-btn"} onClick={HandleProceed}>Proceed</button>
            </div>
        </div>
        </>
    );
}

export default RiskProfile;
