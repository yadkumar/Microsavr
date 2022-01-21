import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Backdrop from '../Components/LoginBackdropComponent'
import '../CSS/RegisterSuccess.css'

const RegisterSuccess = (props: any) => {
    let location = useHistory();
    if(props.regMethod !== "email"){
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        let token = new URLSearchParams(location.location.hash).get("id_token")
        console.log("Token: " + token + "  \nSSN : " + props.ssn || localStorage.getItem("ssn"))
        axios({
            method : "POST",
                url : `${baseUrl}/api/user/google/login/`,
                headers: {
                    "Content-Type" : "application/json",
                },
                data : {
                    "id_token" : token,
                    "ssn" : props.ssn || localStorage.getItem("ssn"),
                },
        }).then(res => localStorage.setItem("token",res.data.token))
        .catch(err => console.log(err))
    }
    
    return(
        <>
        <Backdrop/>
        <div className="reg-success">
            <img className="tick-mark-success" src={require('../Assets/correct-ssn.svg').default} alt="success" />
            <p className="black text-large">Congratulations!</p>
            <p className="gray text-large">Your account is successfully created</p>
            <p className="black text-small start-investing">Let's start investing now</p>
            { props.regMethod === "email" ? <button className="login-btn-success" onClick={e => location.push("/login")}>Login</button> :
                <button className="login-btn-success" onClick={e => location.push("/risk")}>Let's Get Started</button>}
        </div>
        
        
        </>
    );
}

export default RegisterSuccess;