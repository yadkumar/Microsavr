import React from 'react';
import { NavLink } from 'react-router-dom';
import '../CSS/Navbar.css'

export const Navbar = () => {
    return(
        <>
            <nav>
                <header className="flex row navbar-container">
                    <NavLink to="/"><img src={require('../Assets/logo.svg').default} alt="logo" /></NavLink>
                    <div className="flex row navbar-items">
                        <NavLink to="/"><button className="navbar-button">Home</button></NavLink>
                        <NavLink to="/"><button className="navbar-button">How it works</button></NavLink>
                        <NavLink to="/"><button className="navbar-button">Subscriptions</button></NavLink>
                        <NavLink to="/"><button className="navbar-button">Who are we</button></NavLink>
                    </div>
                    
                    <NavLink to="/login"><button className="login">Login Now</button></NavLink>
                </header>
            </nav>
        </>
    );
}