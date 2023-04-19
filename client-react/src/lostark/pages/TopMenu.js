import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import logo from '../images/logo192.png';
import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import * as accountsAction from '../js/accountsAction.js'

const TopMenu = (props) => {
	const [loginStatus, setLoginStatus] = useState("");
	const [userID, setUserID] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const call = async () => {
			const statusJSON = await accountsAction.checkSignInStatus();
			console.log("topMenu", statusJSON)
			
			if(statusJSON.status === "locked"){
				alert("somebody keep trying to login your account, so it's locked now");
			}
			else if(statusJSON.status === "banned"){
				alert("sorry, you are banned");
			}
			else if(statusJSON.status === "lost"){
				alert("this account is lost, how can you use this?");
			}
			else if(statusJSON.status === "wrong_cookie"){
				alert("somebody using your account");
			}

			setLoginStatus(statusJSON.status);
			setUserID(statusJSON.id);
		}
		
		call();
	}, [props]); //처음 페이지 로딩 될때만

	const signOut = async () => {
		await accountsAction.setSignOut();
		alert("LogOUT!")
		setLoginStatus("");
		navigate("/");
	}

	return(
		<>
			<Navbar bg="primary" variant="primary" expand="lg">
				<Container fluid>
					<Navbar.Brand as={Link} to="/">
						<img
							alt=""
							src={logo}
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>{' '}
						TOP-MENU
					</Navbar.Brand>

					<Navbar.Toggle aria-controls="navbarScroll" />

					<Navbar.Collapse id="navbarScroll">
						<Nav
							className="me-auto my-2 my-lg-0"
							style={{ maxHeight: '100px' }}
							navbarScroll
						>
							<Nav.Link as={Link} to="/">Main</Nav.Link>
							<Nav.Link as={Link} to="/registration">CaseRegistration</Nav.Link>
							<Nav.Link as={Link} to="/pricing1">404-1</Nav.Link>
							<Nav.Link as={Link} to="/pricing2">404-2</Nav.Link>
						</Nav>

						{
							loginStatus === "using" ?
							(
								<Form className="d-flex">
									Hello, {userID}
									&nbsp;
									<Button variant="info" onClick={() => {signOut()}}>Sign Out</Button>
								</Form>
							)
							:
							(
								<Form className="d-flex">
									<Nav.Link as={Link} to="/accounts/signup">
										<Button variant="info">Sign Up</Button>
									</Nav.Link>
									&nbsp;
									<Nav.Link as={Link} to="/accounts/signin">
										<Button variant="info">Sign In</Button>
									</Nav.Link>
								</Form>
							)
						}
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
}

export default TopMenu;