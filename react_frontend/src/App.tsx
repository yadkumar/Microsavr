import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LandingPage from './Components/LandingComponent'
import VerifySSN from './Components/VerifyComponent'
import Login from './Components/LoginComponent'
import Register from './Components/RegisterComponent'
import RegisterSuccess from './Components/RegisterSuccessComponent'
import './CSS/Landing.css'
import RiskProfile from './Components/RiskProfileComponent';
import BravoRisk from './Components/BravoRiskComponent';
import Dashboard from './Components/DashboardComponent';
import LoginSuccess from './Components/LoginSuccessComponent';
import Unauthorized from './Components/UnauthorizedComponent';
import PortfolioPerformance from './Components/PortfolioPerformanceComponent';

function App() {

	const [ ssn, setSSN ] = useState("")
	const [ regMethod, setRegMethod ] = useState("google")
	const [ riskProfile, setProfile ] = useState("")
	return (
	<Router>
		<Switch>
			<Route exact path = "/" >
				<LandingPage setSSN={ setSSN } ssn ={ ssn }/>
			</Route>

			<Route exact path="/verify">
				<VerifySSN ssn={ ssn } setRegMethod={setRegMethod}/>
			</Route>

			<Route exact path="/login">
				<Login />
			</Route>

			<Route exact path="/register">
				<Register ssn={ ssn } setRegMethod={setRegMethod}/>
			</Route>

			<Route exact path="/register-success">
				<RegisterSuccess regMethod={regMethod} ssn={ssn}/>
			</Route>

			<Route exact path="/risk">
				<RiskProfile setProfile={setProfile}/>
			</Route>

			<Route exact path="/bravo-risk">
				<BravoRisk riskProfile={riskProfile}/>
			</Route>

			<Route exact path="/dashboard">
				<Dashboard riskProfile={riskProfile}/>
			</Route>

			<Route exact path="/login-success">
				<LoginSuccess/>
			</Route>

			<Route exact path="/unauthorized">
				<Unauthorized/>
			</Route>

			<Route exact path="/performance">
				<PortfolioPerformance/>
			</Route>

		</Switch>
	</Router>
	);
}

export default App;
