import React from 'react'
import '../CSS/Backdrop.css'

const Backdrop = () => {
    return(
        <>
            <img className="background" src={require('../Assets/landing-bg.svg').default} alt="background"/>
        </>
    );
}

export default Backdrop;