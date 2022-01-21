import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Navbar } from './NavbarComponent'
import Backdrop from './LandingBackdropComponent' 

const LandingPage = (props : any) => {
    const ssn_regex = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/; 
    let history = useHistory()
    const [ errorMsg, setErrorMsg ] = useState("")
    
    const resetError = () => {
        setErrorMsg("")
    }

    const handleVerify = () => {
        if(props.ssn){
            if(ssn_regex.test(props.ssn)){
                localStorage.setItem("ssn", props.ssn)
                history.push("/verify")
            }
                
            else
                setErrorMsg("Please verify the SSN format (AAA-BB-CCCC) and try again!")
        }
        else{
            setErrorMsg("Please enter an SSN to proceed.")
        }
    }
    return(
        <div className="landing-container">
            <Backdrop/>
            <Navbar/>
            <div className="flex row ssn-outer-container">
                <div className="flex col ssn-inner-container">
                    <b className="ssn-title">Simplest way to invest money by paying your credit card bills</b>
                    <div className="ssn-input">
                        <input name="ssn" onFocus={resetError} placeholder="SSN Number (AAA-BB-CCCC)" onChange={e => props.setSSN(e.target.value)} required></input>
                        <button type="submit" className="classic" onClick={handleVerify}>Register Now</button>
                        <p className="ssn-error">{errorMsg}</p>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default LandingPage;