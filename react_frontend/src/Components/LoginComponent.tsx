import axios from 'axios';
import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';
import Backdrop from '../Components/LoginBackdropComponent'
import '../CSS/Login.css'

const Login = (props: any) => {
    const history = useHistory();
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [proceedBtn, setProceedBtn] = useState("proceed-btn-reg btn-disabled");
    const [ loginError, setLoginError ] = useState("")

    const responseGoogle = (response : any) => {
        console.log("Google auth response: " , response);
    }

    // check if email is added
    const handleEmail = (emailId: string) => {
        setEmail(emailId);
        if(email === "" || password === ""){
            setProceedBtn("proceed-btn-log btn-disabled");
        }
        else{
            setProceedBtn("proceed-btn-log");
        }
    }

    // check if password is present
    const handlePassword = (password: string) => {
        setPassword(password);
        if(email === "" || password === ""){
            setProceedBtn("proceed-btn-log btn-disabled");
        }
        else{
            setProceedBtn("proceed-btn-log");
        }
    }

    const HandleProceed = () => {
        if( proceedBtn !== "proceed-btn-log btn-disabled"){
            setLoginError("")
            axios({
                method : "POST",
                url : `${baseUrl}/api/user/login/`,
                headers: {
                    "Content-Type" : "application/json",
                },
                data : {
                    "email" : email,
                    "password" : password,
                },
            })
            .then((res) => {
                //console.log(JSON.stringify(res))
                localStorage.setItem("token", res.data.token)
                axios({
                    method : 'GET',
                    url : `${baseUrl}/api/risk/profile/`,
                    headers : {
                        'Authorization': 'Token ' + localStorage.getItem("token")
                    }
                }).then(res => {
                    if(JSON.stringify(res.data) === '{}')
                       history.push("/risk")
                    else
                        history.push("/dashboard")
                }).catch(err => console.log(err))
            })
            .catch(err => setLoginError(err.response.data.Error))
        }
    }

    return(
        <>
        <Backdrop/>
        <div className="container-log">
            <div className="heading-log">Login</div>

            <form className="form-log">
                <div className="card-log">
                    <p className="label-reg enter-email">Enter Email ID</p>
                    <input type="email" className="input-field-reg email-input" onChange={(e)=>handleEmail(e.target.value)}/>
                    <p className="label-reg enter-password">Enter Password</p>
                    <input type="password" className="input-field-reg password-input" onChange={(e)=>handlePassword(e.target.value)}/>
                    { loginError.length === 0 ? null : <p className="regError">{loginError}</p> }
                    <div className="button-set">
                        <div className="need-help-btn-log">
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
                            redirectUri="https://microsavr.hashedin.com/login-success"
                        />
                        </div>
                        <div>
                            <button type="button" className={proceedBtn} onClick={HandleProceed}>Proceed</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        
        <div className="reg-btn-login-page">
            <button type="submit" className="reg-btn-log" onClick={e => history.push("/")}>Register Now</button>
            <div className="no-acc-txt-log">
                <span>Do not have an account?</span>
            </div>
        </div>
        </>
    );
}

export default Login;
