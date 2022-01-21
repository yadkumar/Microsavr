import React from 'react';
import '../CSS/Unauthorized.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useHistory } from 'react-router-dom';

const Unauthorized = (props : any) => {
    const history = useHistory()
    return(
        <>
        <div className="flex col unauthorized-container">
            <Loader type="Hearts" color="#DA3733" height={150} width={300} /><br></br>
            <b className="unauthorized">Unauthorized Access! Login to continue</b>
            <button className="classic" onClick={() => history.push("/login")}>Take me there!</button>
        </div>
        </>
    );
}

export default Unauthorized;