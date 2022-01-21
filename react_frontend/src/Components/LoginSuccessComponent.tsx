import axios from 'axios';
import React, { useEffect } from 'react';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../CSS/LoginSuccess.css'
import { useHistory } from 'react-router-dom';

const LoginSuccess = () => {
    let location = useHistory();
    useEffect(() => {
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        let token = new URLSearchParams(location.location.hash).get("id_token")
        axios({
            method : "POST",
                url : `${baseUrl}/api/user/google/login/`,
                headers: {
                    "Content-Type" : "application/json",
                },
                data : {
                    "id_token" : token,
                },
        }).then(res => {
                localStorage.setItem("token",res.data.token)
                location.push("/dashboard")
            })
        .catch(err => console.log(err)) //eslint-disable-next-line
    },[])
    return(
    <>
        <div className="flex row spinner-container">
            <div className="spinner-text">
            Logging you in  <Loader type="MutatingDots" color="#00BFFF" height={80} width={80} />
            </div>
        </div>
    </>
    );
}

export default LoginSuccess;