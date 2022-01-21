import React from 'react';
import { NavLink } from 'react-router-dom';
import '../CSS/LoginBackdrop.css'

const LoginBackdrop = (props : any) => {
    return(
        <>
        <div className="flex row push-back">
        <NavLink to="/"><img className="navigate-logo" src={require('../Assets/logo.svg').default} alt="logo" /></NavLink>
            <img className="left-top" src={require('../Assets/left-top.svg').default} alt="decoration-1"/>
            <img className="blob" src={require('../Assets/blob.svg').default} alt="blob" />
            <img className="circle" src={require('../Assets/circle.svg').default} alt="circle" />
            <div className="cred-dude-container">
                <img className="cred-dude" src={require('../Assets/cred-dude.svg').default} alt="cred-dude" />
            </div>
        </div>
        </>
    );
}
export default LoginBackdrop;