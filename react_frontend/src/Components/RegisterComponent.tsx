import React, { useState } from 'react';
import Backdrop from '../Components/LoginBackdropComponent'
import { useHistory } from 'react-router-dom'
import '../CSS/Register.css'
import validator from 'validator'
import axios from 'axios';

const Register = (props: any) => {

    const showWarning = "validation-reg show";
    const hideWarning = "validation-reg hide";
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const history = useHistory()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailValidation, setEmailValidation] = useState(hideWarning);
    const [capitalValidation, setCapitalValidation] = useState(showWarning);
    const [specialCharValidation, setSpecialCharValidation] = useState(showWarning);
    const [numberValidation, setNumberValidation] = useState(showWarning);
    const [disableButton, setDisableButton] = useState(true);
    const [btnBgColor, setBtnBgColor] = useState("proceed-btn-reg btn-disabled");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPwValid, setIsPwValid] = useState(false);
    const [registerError, setRegError ] = useState("")

    const validatePassword = (text: string) => {
        setPassword(text);
        const capRegEx = new RegExp("(?=.*[A-Z])");
        const specialCharRegEx = new RegExp("(?=.*[!@#$%^&*])");
        const numberRegEx = new RegExp("(?=.*[0-9])");
        let isValid = true;
        if(! capRegEx.test(text)) {
            setCapitalValidation(showWarning);
            isValid = false;
        } else {
            setCapitalValidation(hideWarning);
        }
        if(! specialCharRegEx.test(text)) {
            setSpecialCharValidation(showWarning);
            isValid = false;
        } else {
            setSpecialCharValidation(hideWarning)
        }
        if(! numberRegEx.test(text)) {
            setNumberValidation(showWarning);
            isValid = false;
        } else {
            setNumberValidation(hideWarning);
        }
        setIsPwValid(isValid);
        if(isValid && isEmailValid) {
            setDisableButton(false);
            setBtnBgColor("proceed-btn-reg btn-enabled");
        } else {
            setDisableButton(true);
            setBtnBgColor("proceed-btn-reg btn-disabled");
        }
    }
    const validateEmail = (text: string) => {
        setEmail(text);
        let isValid = true;
        if(! validator.isEmail(text)) {
            setEmailValidation(showWarning);
            isValid = false;
            setIsEmailValid(false);
        } else {
            setEmailValidation(hideWarning);
            setIsEmailValid(true);
        }
        if(isValid && isPwValid) {
            setDisableButton(false);
            setBtnBgColor("proceed-btn-reg btn-enabled");
        } else {
            setDisableButton(true);
            setBtnBgColor("proceed-btn-reg btn-disabled");
        }
        //console.log(disableButton);
    }
    const registrationHandler = () => {
        if(isEmailValid && isPwValid) {
            props.setRegMethod("email")
            setRegError("")
            axios({
                method : "POST",
                url : `${baseUrl}/api/user/register/`,
                headers: {
                    "Content-Type" : "application/json",
                },
                data : {
                    "email" : email,
                    "password" : password,
                    "ssn" : props.ssn,
                },
            })
            .then((res) => {
                console.log(JSON.stringify(res))
                if(res.status === 201){
                    history.push("/register-success")
                }
            })
            .catch(err => setRegError(err.response.data.Error))
        }
    }

    return(
        <>
        <Backdrop/>
        <div className="container-reg">
            <p className="heading-reg">Please continue your registration below</p>

            <form className="form-reg" onSubmit={(e)=>{e.preventDefault();}}>
                <div className="card-reg">
                    <p className="label-reg enter-email"><span className="required">* </span>Enter Email ID</p>
                    <input type="email" required={true} className="input-field-reg email-input" onChange={(e)=>validateEmail(e.target.value)}/>
                    <p className={emailValidation}>* Please enter a valid email</p>
                    <p className="label-reg enter-password"><span className="required">* </span>Create Password</p>
                    <input type="password" className="input-field-reg password-input" onChange={(e)=>validatePassword(e.target.value)}/>

                    <p className={capitalValidation}>* Must contain atleast 1 Capital letter</p>
                    <p className={specialCharValidation}>* Must contain atleast 1 special character</p>
                    <p className={numberValidation}>* Must contain atleast 1 number</p>
                    { registerError.length === 0 ? null : <p className="regError">{registerError}</p> }
                </div>
                <button className={btnBgColor} disabled={disableButton} onClick={registrationHandler}>Proceed</button>
            </form>

        </div>
        </>
    );
}

export default Register;
