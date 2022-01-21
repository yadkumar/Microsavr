import React from 'react';
import { useHistory } from 'react-router-dom';
import '../CSS/Banner.css';

const Banner = (props : any) => {
    const history = useHistory()
    const handleLogout = () => {
        localStorage.removeItem("token")
        history.push("/")
    }

    return(
        <>
            <div className="flex row banner-container">
                <img className="logo-size" src={require('../Assets/logo.svg').default} alt="logo"/>
                <p className="welcome">Welcome Jason!</p>
                <img className="" src={require('../Assets/Bell.svg').default} alt="bell"/>
                <img className="" src={require('../Assets/profile.svg').default} alt="profile"/>
                <img onClick={handleLogout} className="size-control" src={require('../Assets/logout.png').default} alt="logout"/>
            </div>
        </>
    );
}

export default Banner;