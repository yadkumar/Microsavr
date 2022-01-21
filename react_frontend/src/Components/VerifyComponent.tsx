import React from 'react';
import '../CSS/Verify.css'
import LoginBackdrop from '../Components/LoginBackdropComponent'
import { GoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';

const VerifySSN = (props : any) => {
    let history = useHistory()

    const responseGoogle = (response : any) => {
        console.log("Google auth response: " , response);
    }

    const loginWithEmail = () => {
        props.setRegMethod("email")
        history.push("/register");  
    }


    return(
        <>
            <LoginBackdrop />
            <div className="flex col register-container">
                <div className="flex col register">
                    <img className="wrong-ssn align-center" src={require('../Assets/correct-ssn.svg').default} alt="correct" />
                    <p className="text-black align-center">Awesome!</p>
                    <p className="approval align-center">Your SSN Number <b className="text-black">{props.ssn}</b> is verified</p>
                    <p className="continue-reg align-center">Please continue your registration below</p>
                    <GoogleLogin
                        clientId="501040941682-lujba960qhdkvvdokl8q8b0gsf6cbuc9.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        prompt="select_account"
                        theme="dark"
                        uxMode="redirect"
                        responseType="code,token"
                        redirectUri= 'https://microsavr.hashedin.com/register-success'
                    />
                    <button className="login-email-pass" onClick={loginWithEmail}><img src={require('../Assets/logo-white.svg').default} alt="logo"/>Register with Email ID</button>
                </div> 
            </div>
        </>
    );
}

export default VerifySSN;
