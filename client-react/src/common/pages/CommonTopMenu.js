import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import logo from '../images/logo192.png';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import * as accountsAction from '../js/accountsAction.js'

const CommonTopMenu = (props) => {
	const [showOffcanvas, setShowOffcanvas] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		props.renewLogin();
		console.log("CommonTopMenu", props);
	}, []); //처음 페이지 로딩 될때만

	useEffect(() => {
		console.log("-----------> window.location.href", window.location.href);
	}, [window.location.href]); //처음 페이지 로딩 될때만

	const menuClick = (url) => {
		props.renewLogin();
		setShowOffcanvas(false);
		navigate(url);
	}

	const signOut = async () => {
		await accountsAction.setSignOut();
		setShowOffcanvas(false);
		props.renewLogin();
		alert("LogOUT!");
		navigate("/");
	}

	return(
		<>
			<Navbar collapseOnSelect bg="dark" variant="dark" expand="md" className="mb-3">
				<Container style={{maxWidth: "1440px"}}>
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

					<Navbar.Toggle onClick={() => setShowOffcanvas(true)}/>

					<Navbar.Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
						<Offcanvas.Header closeButton style={{backgroundColor: "#ffffff"}}>
							<Offcanvas.Title>
								<b>Menu</b>
							</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body>
							<Nav variant="pills" className="justify-content-start flex-grow-1 pe-3">
								<Nav.Link active={false} eventKey="link-1" onClick={() => menuClick("/lostark")}>Main</Nav.Link>
								<Nav.Link active={false} eventKey="link-2" onClick={() => menuClick("/lostark/board/anonymous/1")}>Anonymous Board</Nav.Link>
								<Nav.Link active={false} eventKey="link-2" onClick={() => menuClick("/lostark/board/identified/1")}>Identified Board</Nav.Link>

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
								props.accountData.status === "using" ?
								(
									<Form className="d-flex">
										<Navbar.Text>
											Hello, {props.accountData.nickname}
										</Navbar.Text>
										&nbsp;&nbsp;
										
										<Button variant="info" onClick={() => menuClick("/accounts/mypage")}>My Page</Button>
										&nbsp;&nbsp;
										<Button variant="outline-warning" onClick={() => {signOut()}}>Logout</Button>
									</Form>
								)
								:
								(
									<Form className="d-flex">
										<Button variant="info" onClick={() => menuClick("/accounts/signup")}>Sign Up</Button>
										&nbsp;
										<Button variant="info" onClick={() => menuClick("/accounts/signin")}>Sign In</Button>
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