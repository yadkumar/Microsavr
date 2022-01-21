import React from 'react';
import '../CSS/QuestionRadio.css'

const QuestionRadio = (props: any) => {
    return (
        <>
        <div className="question-container">
            <p className="black question-radio">{props.data.sl_no}. {props.data.question}</p>
            <div className="options-radio flex col" onChange={(e) => props.onChange(props.data.sl_no, e)}>
            {
                "descriptions" in props.data ?
                Object.keys(props.data.options).map(key => {
                    return(
                        <div className="option-radio flex row">
                            <input className="radio-btn-risk" id={props.data.sl_no + key} type="radio"
                            value={key} name={props.data.sl_no}/>
                            <div className="flex col">
                            <label htmlFor={props.data.sl_no + key}>{props.data.options[key]}</label>
                            <p>{props.data.descriptions[key]}</p>
                            </div>
                        </div>
                    );
                }):
                Object.keys(props.data.options).map(key => {
                    return(
                        <div className="option-radio flex row">
                            <input className="radio-btn-risk" id={props.data.sl_no + key} type="radio"
                            value={key} name={props.data.sl_no}/>
                            <label htmlFor={props.data.sl_no + key}>{props.data.options[key]}</label>
                        </div>
                    );
                })
            }
            </div>
        </div>
        </>
    );
}

export default QuestionRadio;