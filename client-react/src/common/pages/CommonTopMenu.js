import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import logo from '../images/logo192.png';
import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import * as accountsAction from '../js/accountsAction.js'

const CommonTopMenu = (props) => {
	const [loginStatus, setLoginStatus] = useState("");
	const [accountData, setAccountData] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		const call = async () => {
			const statusJSON = await accountsAction.checkSignInStatus();
			console.log("topMenu", statusJSON)
			
			if(statusJSON.status === "locked"){
				alert("somebody keep trying to login your account, so it's locked now");
				navigate("/accounts/signin");
			}
			else if(statusJSON.status === "banned"){
				alert("sorry, you are banned");
				navigate("/accounts/signin");
			}
			else if(statusJSON.status === "lost"){
				alert("this account is lost, how can you use this?");
				navigate("/accounts/signin");
			}
			else if(statusJSON.status === "wrong_cookie"){
				alert("somebody using your account");
				navigate("/accounts/signin");
			}

			setLoginStatus(statusJSON.status);
			setAccountData(statusJSON);
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
			<Navbar collapseOnSelect bg="dark" variant="dark" expand="md" className="mb-3">
				<Container fluid style={{maxWidth: "1440px"}}>
					<Navbar.Brand as={NavLink} to="/lostark">
						<img
							alt=""
							src={logo}
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>
						&nbsp;
						Common-TOP-MENU
					</Navbar.Brand>

					<Navbar.Toggle />

					<Navbar.Offcanvas placement="end">
						<Offcanvas.Header closeButton style={{backgroundColor: "#878787"}}>
							<Offcanvas.Title>
								<b>Menu</b>
							</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body style={{backgroundColor: "#212529"}}>
							<Nav className="justify-content-start flex-grow-1 pe-3">
								<Nav.Link as={NavLink} href="#" to="/lostark" style={({ isActive, isPending }) => isActive ? {color: "#89d4ff"} : isPending ? {color: "red"} : {color: "white"}}>
									LA
								</Nav.Link>
								
								{/* 아직 오픈 계획 없음
								<Nav.Link as={NavLink} href="#" to="/" style={({ isActive, isPending }) => isActive ? {color: "#89d4ff"} : isPending ? {color: "red"} : {color: "white"}}>
									Main
								</Nav.Link>
								<Nav.Link as={NavLink} href="#" to="/deadbydaylight" style={({ isActive, isPending }) => isActive ? {color: "#89d4ff"} : isPending ? {color: "red"} : {color: "white"}}>
									DBD
								</Nav.Link>
								*/}
							</Nav>

							{
								loginStatus === "using" ?
								(
									<Form className="d-flex">
										<Navbar.Collapse className="justify-content-end">
											<Navbar.Text style={{color: "#ffffff"}}>
												Hello, {accountData.nickname}
											</Navbar.Text>
											&nbsp;&nbsp;
											<Button variant="info" onClick={() => {navigate("/accounts/mypage")}}>My Page</Button>
											&nbsp;&nbsp;
											<Button variant="outline-warning" onClick={() => {signOut()}}>Logout</Button>
										</Navbar.Collapse>
									</Form>
								)
								:
								(
									<Form className="d-flex">
										<Nav.Link as={NavLink} href="#" to="/accounts/signup">
											<Button variant="info">Sign Up</Button>
										</Nav.Link>
										&nbsp;
										<Nav.Link as={NavLink} href="#" to="/accounts/signin">
											<Button variant="info">Sign In</Button>
										</Nav.Link>
									</Form>
								)
							}
						</Offcanvas.Body>
					</Navbar.Offcanvas>
				</Container>
			</Navbar>
		</>
	);
}

export default CommonTopMenu;