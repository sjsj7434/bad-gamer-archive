import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from 'react';
import logo from '../images/logo192.png';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import * as accountsFetch from '../js/accountsFetch.js'

const CommonTopMenu = (props) => {
	const [showOffcanvas, setShowOffcanvas] = useState(false);
	const [renderData, setRenderData] = useState(null);
	const [activeMenu, setActiveMenu] = useState("");
	const navigate = useNavigate();
	
	const menuClick = useCallback((url, activeMenuId) => {
		setActiveMenu(activeMenuId);
		// props.checkSignInStatus();
		setShowOffcanvas(false);
		navigate(url);
	}, [props, navigate])

	useEffect(() => {
		const signOut = async () => {
			if(window.confirm("로그아웃 하시겠습니까?") === false){
				return;
			}
			await accountsFetch.setSignOut();
			setShowOffcanvas(false);
			props.checkSignInStatus();
			navigate("/");
		}

		if(props.accountData.status === "signin"){
			setRenderData(
				<Form className="d-flex">
					<Navbar.Text>
						Hello, {props.accountData.nickname}
					</Navbar.Text>
					&nbsp;&nbsp;
					
					<Button variant="info" onClick={() => menuClick("/accounts/mypage", "")} style={{fontSize: "0.8rem", padding: "4px"}}>내 정보</Button>
					&nbsp;&nbsp;
					<Button variant="outline-warning" onClick={() => {signOut()}} style={{fontSize: "0.8rem", padding: "4px"}}>로그아웃</Button>
				</Form>
			)
		}
		else{
			setRenderData(
				<Form className="d-flex">
					<Button variant="secondary" onClick={() => menuClick("/accounts/signup", "")} style={{fontSize: "0.8rem", padding: "4px"}}>회원가입</Button>
					&nbsp;
					<Button variant="primary" onClick={() => menuClick("/accounts/signin", "")} style={{fontSize: "0.8rem", padding: "4px"}}>로그인</Button>
				</Form>
			)
		}
	}, [props, menuClick, navigate])

	return(
		<>
			<Navbar collapseOnSelect bg="dark" variant="dark" expand="md" className="mb-3" sticky="top">
				<Container style={{maxWidth: "1440px"}}>
					<Navbar.Brand onClick={() => menuClick("/lostark", "menu-1")} style={{cursor: "pointer"}}>
						<img
							alt=""
							src={logo}
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>
						&nbsp;
						TOP-MENU
					</Navbar.Brand>

					<Navbar.Toggle onClick={() => setShowOffcanvas(true)}/>

					<Navbar.Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
						<Offcanvas.Header closeButton style={{backgroundColor: "#ffffff"}}>
							<Offcanvas.Title>
								<b>Menu</b>
							</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body style={{fontSize: "0.8rem"}}>
							<Nav variant="underline" className="justify-content-start flex-grow-1 pe-3" style={{overflow: "", width: "fit-content"}}>
								{/* <div className="vr" style={{color: "white", padding: "1px", marginTop: "7px", marginBottom: "7px"}}></div> */}
								<Nav.Link active={activeMenu === "menu-1" ? true : false} onClick={() => menuClick("/lostark", "menu-1")}>메인</Nav.Link>
								<Nav.Link active={activeMenu === "menu-2" ? true : false} onClick={() => menuClick("/lostark/board/anonymous/1", "menu-2")}>익명 게시판</Nav.Link>
								<Nav.Link active={activeMenu === "menu-3" ? true : false} onClick={() => menuClick("/lostark/board/identified/1", "menu-3")}>인증 게시판</Nav.Link>
								<Nav.Link active={activeMenu === "menu-4" ? true : false} onClick={() => menuClick("/lostark/useful", "menu-4")}>유용한 사이트</Nav.Link>
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