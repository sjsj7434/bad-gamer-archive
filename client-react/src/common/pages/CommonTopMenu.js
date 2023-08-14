import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from 'react';

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
		setShowOffcanvas(false);
		navigate(url);
	}, [navigate])

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
				<Container style={{maxWidth: "1200px"}}>
					<Navbar.Brand onClick={() => menuClick("/lostark/main", "menu-1")} style={{cursor: "pointer"}}>
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="orange" className="bi bi-fan" viewBox="0 0 16 16">
							<path d="M10 3c0 1.313-.304 2.508-.8 3.4a1.991 1.991 0 0 0-1.484-.38c-.28-.982-.91-2.04-1.838-2.969a8.368 8.368 0 0 0-.491-.454A5.976 5.976 0 0 1 8 2c.691 0 1.355.117 1.973.332.018.219.027.442.027.668Zm0 5c0 .073-.004.146-.012.217 1.018-.019 2.2-.353 3.331-1.006a8.39 8.39 0 0 0 .57-.361 6.004 6.004 0 0 0-2.53-3.823 9.02 9.02 0 0 1-.145.64c-.34 1.269-.944 2.346-1.656 3.079.277.343.442.78.442 1.254Zm-.137.728a2.007 2.007 0 0 1-1.07 1.109c.525.87 1.405 1.725 2.535 2.377.2.116.402.222.605.317a5.986 5.986 0 0 0 2.053-4.111c-.208.073-.421.14-.641.199-1.264.339-2.493.356-3.482.11ZM8 10c-.45 0-.866-.149-1.2-.4-.494.89-.796 2.082-.796 3.391 0 .23.01.457.027.678A5.99 5.99 0 0 0 8 14c.94 0 1.83-.216 2.623-.602a8.359 8.359 0 0 1-.497-.458c-.925-.926-1.555-1.981-1.836-2.96-.094.013-.191.02-.29.02ZM6 8c0-.08.005-.16.014-.239-1.02.017-2.205.351-3.34 1.007a8.366 8.366 0 0 0-.568.359 6.003 6.003 0 0 0 2.525 3.839 8.37 8.37 0 0 1 .148-.653c.34-1.267.94-2.342 1.65-3.075A1.988 1.988 0 0 1 6 8Zm-3.347-.632c1.267-.34 2.498-.355 3.488-.107.196-.494.583-.89 1.07-1.1-.524-.874-1.406-1.733-2.541-2.388a8.363 8.363 0 0 0-.594-.312 5.987 5.987 0 0 0-2.06 4.106c.206-.074.418-.14.637-.199ZM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
							<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14Zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z"/>
						</svg>
						&nbsp;
						TOP
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
								<Nav.Link active={activeMenu === "menu-1" ? true : false} onClick={() => menuClick("/lostark/main", "menu-1")}>메인</Nav.Link>
								<Nav.Link active={activeMenu === "menu-2" ? true : false} onClick={() => menuClick("/lostark/board/anonymous/1", "menu-2")}>익명 게시판</Nav.Link>
								<Nav.Link active={activeMenu === "menu-3" ? true : false} onClick={() => menuClick("/lostark/board/user/1", "menu-3")}>유저 게시판</Nav.Link>
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