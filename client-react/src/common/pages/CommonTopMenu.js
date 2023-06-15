import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from 'react';
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
	const [renderData, setRenderData] = useState(null);
	const navigate = useNavigate();
	
	const menuClick = useCallback((url) => {
		props.renewLogin();
		setShowOffcanvas(false);
		navigate(url);
	}, [props, navigate])

	useEffect(() => {
		const signOut = async () => {
			if(window.confirm("로그아웃 하시겠습니까?") === false){
				return;
			}
			await accountsAction.setSignOut();
			setShowOffcanvas(false);
			props.renewLogin();
			alert("로그아웃 되었습니다");
			navigate("/");
		}

		if(props.accountData.status === "using"){
			setRenderData(
				<Form className="d-flex">
					<Navbar.Text>
						Hello, {props.accountData.nickname}
					</Navbar.Text>
					&nbsp;&nbsp;
					
					<Button variant="info" onClick={() => menuClick("/accounts/mypage")}>내 정보</Button>
					&nbsp;&nbsp;
					<Button variant="outline-warning" onClick={() => {signOut()}}>로그아웃</Button>
				</Form>
			)
		}
		else{
			setRenderData(
				<Form className="d-flex">
					<Button variant="secondary" onClick={() => menuClick("/accounts/signup")}>회원가입</Button>
					&nbsp;
					<Button variant="primary" onClick={() => menuClick("/accounts/signin")}>로그인</Button>
				</Form>
			)
		}
	}, [props, menuClick, navigate])

	return(
		<>
			<Navbar collapseOnSelect bg="dark" variant="dark" expand="md" className="mb-3" sticky="top">
				<Container style={{maxWidth: "1440px"}}>
					<Navbar.Brand as={NavLink} to="/lostark" onClick={() => {props.renewLogin()}}>
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
								<Nav.Link active={false} eventKey="link-1" onClick={() => menuClick("/lostark")}>메인</Nav.Link>
								<Nav.Link active={false} eventKey="link-2" onClick={() => menuClick("/lostark/board/anonymous/1")}>익명</Nav.Link>
								<Nav.Link active={false} eventKey="link-2" onClick={() => menuClick("/lostark/board/identified/1")}>인증</Nav.Link>
								<Nav.Link active={false} eventKey="link-2" onClick={() => menuClick("/lostark/board/identified/1")}>도구 모음</Nav.Link>
							</Nav>

							{renderData}
						</Offcanvas.Body>
					</Navbar.Offcanvas>
				</Container>
			</Navbar>
		</>
	);
}

export default CommonTopMenu;