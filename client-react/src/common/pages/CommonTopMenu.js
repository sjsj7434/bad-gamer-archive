import { useNavigate } from "react-router-dom";
import { useCallback, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import * as accountFetch from '../js/accountFetch.js'

const CommonTopMenu = (props) => {
	const [showOffcanvas, setShowOffcanvas] = useState(false);
	const [subMenuRender, setSubMenuRender] = useState(<></>);
	const navigate = useNavigate();

	const subMenuData = new Map(); //서브 메뉴 데이터
	subMenuData.set("post", [
		{ "name": "익명 게시판", "url": "/lostark/post/unknown/1", "currentMenu": "/lostark/post/unknown" }
		, { "name": "자유 게시판", "url": "/lostark/post/known/1", "currentMenu": "/lostark/post/known" }
	])

	const setSubMenu = (subMenu) => {
		const renderData = subMenuData.get(subMenu).map((element) => {
			return(
				<div
					key={element.name}
					onClick={() => { menuClick(element.url); controlSubmenu("hide"); }}
					style={{
						display: "flex"
						, alignItems: "center"
						, fontSize: "0.8rem"
						, fontWeight: props.currentMenu === element.currentMenu ? 800 : 400
						, color: props.currentMenu === element.currentMenu ? "white" : "lightgray"
						, height: "100%"
						, cursor: "pointer"
						, paddingLeft: "1rem"
						, paddingRight: "1rem"
					}}
					onMouseOver={ () => { controlSubmenu("show"); } }
				>
					{element.name}
				</div>
			);
		})
		setSubMenuRender(renderData);
	}

	const controlSubmenu = (control) => {
		if(control === "toggle"){
			document.querySelector("#subMenuArea").classList.toggle("show");
		}
		else if(control === "show"){
			document.querySelector("#subMenuArea").classList.add("show");
		}
		else if(control === "hide"){
			document.querySelector("#subMenuArea").classList.remove("show");
		}
	}
	
	const menuClick = useCallback((url) => {
		setShowOffcanvas(false);
		navigate(url);
	}, [navigate])
	
	const logoutAccount = async () => {
		if(window.confirm("로그아웃 하시겠습니까?") === false){
			return;
		}
		await accountFetch.logoutAccount();
		setShowOffcanvas(false);
		props.checkLoginStatus();
		navigate("/");
	}

	return(
		<>
			<div className="desktopMode" style={{ position: "sticky", top: 0, zIndex: 2000, width: "100%", marginBottom: "70px" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#212529" }}>
					<div style={{ maxWidth: "1200px", width: "100%" }}>
						<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "50px", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
							<div style={{ maxWidth: "200px", minWidth: "150px", color: "white", fontWeight: 400, fontSize: "1.1rem" }}
								onMouseOver={ () => { controlSubmenu("hide"); } }
							>
								<div style={{ width: "fit-content", cursor: "pointer" }} onClick={ () => { menuClick("/lostark/main") } }>
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="orange" className="bi bi-fan" viewBox="0 0 16 16">
										<path d="M10 3c0 1.313-.304 2.508-.8 3.4a1.991 1.991 0 0 0-1.484-.38c-.28-.982-.91-2.04-1.838-2.969a8.368 8.368 0 0 0-.491-.454A5.976 5.976 0 0 1 8 2c.691 0 1.355.117 1.973.332.018.219.027.442.027.668Zm0 5c0 .073-.004.146-.012.217 1.018-.019 2.2-.353 3.331-1.006a8.39 8.39 0 0 0 .57-.361 6.004 6.004 0 0 0-2.53-3.823 9.02 9.02 0 0 1-.145.64c-.34 1.269-.944 2.346-1.656 3.079.277.343.442.78.442 1.254Zm-.137.728a2.007 2.007 0 0 1-1.07 1.109c.525.87 1.405 1.725 2.535 2.377.2.116.402.222.605.317a5.986 5.986 0 0 0 2.053-4.111c-.208.073-.421.14-.641.199-1.264.339-2.493.356-3.482.11ZM8 10c-.45 0-.866-.149-1.2-.4-.494.89-.796 2.082-.796 3.391 0 .23.01.457.027.678A5.99 5.99 0 0 0 8 14c.94 0 1.83-.216 2.623-.602a8.359 8.359 0 0 1-.497-.458c-.925-.926-1.555-1.981-1.836-2.96-.094.013-.191.02-.29.02ZM6 8c0-.08.005-.16.014-.239-1.02.017-2.205.351-3.34 1.007a8.366 8.366 0 0 0-.568.359 6.003 6.003 0 0 0 2.525 3.839 8.37 8.37 0 0 1 .148-.653c.34-1.267.94-2.342 1.65-3.075A1.988 1.988 0 0 1 6 8Zm-3.347-.632c1.267-.34 2.498-.355 3.488-.107.196-.494.583-.89 1.07-1.1-.524-.874-1.406-1.733-2.541-2.388a8.363 8.363 0 0 0-.594-.312 5.987 5.987 0 0 0-2.06 4.106c.206-.074.418-.14.637-.199ZM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14Zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z"/>
									</svg>
									&nbsp;
									AGORA
								</div>
							</div>

							<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "lightgray" }}>
								<div
									onClick={() => { menuClick("/lostark/main") }}
									onMouseOver={ () => { controlSubmenu("hide"); } }
									style={{
										display: "flex"
										, alignItems: "center"
										, fontSize: "0.8rem"
										, fontWeight: props.currentMenu === "/lostark/main" ? 800 : 400
										, color: props.currentMenu === "/lostark/main" ? "white" : "lightgray"
										, height: "100%"
										, cursor: "pointer"
										, paddingLeft: "1rem"
										, paddingRight: "1rem"
									}}
								>
									메인
								</div>
								
								<div
									onClick={() => { menuClick("/post/announce/1") }}
									onMouseOver={ () => { controlSubmenu("hide"); } }
									style={{
										display: "flex"
										, alignItems: "center"
										, fontSize: "0.8rem"
										, fontWeight: props.currentMenu === "/post/announce" ? 800 : 400
										, color: props.currentMenu === "/post/announce" ? "white" : "lightgray"
										, height: "100%"
										, cursor: "pointer"
										, paddingLeft: "1rem"
										, paddingRight: "1rem"
									}}
								>
									공지사항
								</div>
								
								<div
									onClick={() => { controlSubmenu("toggle"); setSubMenu("post"); } }
									onMouseOver={ () => { controlSubmenu("show"); setSubMenu("post"); } }
									style={{
										display: "flex"
										, alignItems: "center"
										, fontSize: "0.8rem"
										, fontWeight: props.currentMenu !== null && props.currentMenu.includes("/lostark/post") ? 800 : 400
										, color: props.currentMenu !== null && props.currentMenu.includes("/lostark/post") ? "white" : "lightgray"
										, height: "100%"
										, cursor: "pointer"
										, paddingLeft: "1rem"
										, paddingRight: "1rem"
									}}
								>
									게시판 ▼
								</div>
								
								{/* <div
									onClick={() => { menuClick("/lostark/guild") }}
									onMouseOver={ () => { controlSubmenu("hide"); } }
									style={{
										display: "flex"
										, alignItems: "center"
										, fontSize: "0.8rem"
										, fontWeight: props.currentMenu === "/lostark/guild" ? 800 : 400
										, color: props.currentMenu === "/lostark/guild" ? "white" : "lightgray"
										, height: "100%"
										, cursor: "pointer"
										, paddingLeft: "1rem"
										, paddingRight: "1rem"
									}}
								>
									길드
								</div> */}
								
								<div
									onClick={() => { menuClick("/lostark/useful") }}
									onMouseOver={ () => { controlSubmenu("hide"); } }
									style={{
										display: "flex"
										, alignItems: "center"
										, fontSize: "0.8rem"
										, fontWeight: props.currentMenu === "/lostark/useful" ? 800 : 400
										, color: props.currentMenu === "/lostark/useful" ? "white" : "lightgray"
										, height: "100%"
										, cursor: "pointer"
										, paddingLeft: "1rem"
										, paddingRight: "1rem"
									}}
								>
									도구 모음
								</div>
							</div>

							<div style={{ maxWidth: "200px", minWidth: "150px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
								onMouseOver={ () => { controlSubmenu("hide"); } }
							>
								{
									props.accountData.status === "login" ?
									<>
										<div
											onClick={() => { menuClick("/account/mypage") }}
											onMouseOver={ () => { controlSubmenu("hide"); } }
											style={{
												display: "flex"
												, alignItems: "center"
												, fontSize: "0.8rem"
												, fontWeight: props.currentMenu === "/account/mypage" ? 800 : 400
												, color: props.currentMenu === "/account/mypage" ? "white" : "lightgray"
												, height: "100%"
												, cursor: "pointer"
												, paddingLeft: "1rem"
												, paddingRight: "1rem"
											}}
										>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												나의 정보
											</div>
										</div>
										<span style={{ fontSize: "0.65rem", color: "gray" }}>|</span>
										<div
											onClick={() => { logoutAccount() }}
											onMouseOver={ () => { controlSubmenu("hide"); } }
											style={{
												display: "flex"
												, alignItems: "center"
												, fontSize: "0.8rem"
												, fontWeight: props.currentMenu === "/account/logout" ? 800 : 400
												, color: props.currentMenu === "/account/logout" ? "white" : "lightgray"
												, height: "100%"
												, cursor: "pointer"
												, paddingLeft: "1rem"
												, paddingRight: "1rem"
											}}
										>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												로그아웃
											</div>
										</div>
									</>
									:
									<>
										<div
											onClick={() => { menuClick("/account/register") }}
											onMouseOver={ () => { controlSubmenu("hide"); } }
											style={{
												display: "flex"
												, alignItems: "center"
												, fontSize: "0.8rem"
												, fontWeight: props.currentMenu === "/account/register" ? 800 : 400
												, color: props.currentMenu === "/account/register" ? "white" : "lightgray"
												, height: "100%"
												, cursor: "pointer"
												, paddingLeft: "1rem"
												, paddingRight: "1rem"
											}}
										>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												회원가입
											</div>
										</div>
										<span style={{ fontSize: "0.65rem", color: "gray" }}>|</span>
										<div
											onClick={() => { menuClick("/account/login") }}
											onMouseOver={ () => { controlSubmenu("hide"); } }
											style={{
												display: "flex"
												, alignItems: "center"
												, fontSize: "0.8rem"
												, fontWeight: props.currentMenu === "/account/login" ? 800 : 400
												, color: props.currentMenu === "/account/login" ? "white" : "lightgray"
												, height: "100%"
												, cursor: "pointer"
												, paddingLeft: "1rem"
												, paddingRight: "1rem"
											}}
										>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												로그인
											</div>
										</div>
									</>
								}
							</div>
						</div>
					</div>
				</div>

				<div
					id="subMenuArea"
					style={{ position: "absolute", width: "100%", backgroundColor: "#212529", zIndex: 2000 }}
					onMouseOut={ () => { controlSubmenu("hide"); } }
					onMouseOver={ () => { document.querySelector("#subMenuArea").classList.add("show") } }
				>
					<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "fit-content", paddingTop: "20px", paddingBottom: "20px" }}>
						{subMenuRender}
					</div>
				</div>
			</div>
		
			{/* 모바일용 상단 고정 메뉴 */}
			<Navbar bg="dark" variant="dark" className="mb-3 mobileMode" expand="" sticky="top">
				<Container>
					{/* 모바일용 상단 고정 메뉴 */}
					<Navbar.Brand onClick={() => menuClick("/lostark/main")} style={{cursor: "pointer"}}>
						<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="orange" className="bi bi-fan" viewBox="0 0 16 16">
							<path d="M10 3c0 1.313-.304 2.508-.8 3.4a1.991 1.991 0 0 0-1.484-.38c-.28-.982-.91-2.04-1.838-2.969a8.368 8.368 0 0 0-.491-.454A5.976 5.976 0 0 1 8 2c.691 0 1.355.117 1.973.332.018.219.027.442.027.668Zm0 5c0 .073-.004.146-.012.217 1.018-.019 2.2-.353 3.331-1.006a8.39 8.39 0 0 0 .57-.361 6.004 6.004 0 0 0-2.53-3.823 9.02 9.02 0 0 1-.145.64c-.34 1.269-.944 2.346-1.656 3.079.277.343.442.78.442 1.254Zm-.137.728a2.007 2.007 0 0 1-1.07 1.109c.525.87 1.405 1.725 2.535 2.377.2.116.402.222.605.317a5.986 5.986 0 0 0 2.053-4.111c-.208.073-.421.14-.641.199-1.264.339-2.493.356-3.482.11ZM8 10c-.45 0-.866-.149-1.2-.4-.494.89-.796 2.082-.796 3.391 0 .23.01.457.027.678A5.99 5.99 0 0 0 8 14c.94 0 1.83-.216 2.623-.602a8.359 8.359 0 0 1-.497-.458c-.925-.926-1.555-1.981-1.836-2.96-.094.013-.191.02-.29.02ZM6 8c0-.08.005-.16.014-.239-1.02.017-2.205.351-3.34 1.007a8.366 8.366 0 0 0-.568.359 6.003 6.003 0 0 0 2.525 3.839 8.37 8.37 0 0 1 .148-.653c.34-1.267.94-2.342 1.65-3.075A1.988 1.988 0 0 1 6 8Zm-3.347-.632c1.267-.34 2.498-.355 3.488-.107.196-.494.583-.89 1.07-1.1-.524-.874-1.406-1.733-2.541-2.388a8.363 8.363 0 0 0-.594-.312 5.987 5.987 0 0 0-2.06 4.106c.206-.074.418-.14.637-.199ZM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
							<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14Zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z"/>
						</svg>
						&nbsp;
						AGORA
					</Navbar.Brand>

					<Nav style={{ display: "flex", flexDirection: "row", color: "white", fontSize: "0.8rem", width: "maxWidth" }}>
						{
							props.accountData.status === "login" ?
							<>
								<Nav.Link active={props.currentMenu === "/account/mypage" ? true : false} onClick={() => menuClick("/account/mypage")}>
									<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
										<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-fill-gear" viewBox="0 0 16 16">
											<path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Zm9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
										</svg>
									</div>
								</Nav.Link>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<div title="로그아웃" onClick={() => { logoutAccount() }} style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: "0.3rem" }}>
									<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#9b9d9e" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
										<path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
										<path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
									</svg>
								</div>
							</>
							:
							<>
								<Nav.Link title="로그인" active={props.currentMenu === "/account/login" ? true : false} onClick={() => menuClick("/account/login")}>
									<div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: "0.3rem" }}>
										<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-box-arrow-in-up-right" viewBox="0 0 16 16">
											<path fillRule="evenodd" d="M6.364 13.5a.5.5 0 0 0 .5.5H13.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 13.5 1h-10A1.5 1.5 0 0 0 2 2.5v6.636a.5.5 0 1 0 1 0V2.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H6.864a.5.5 0 0 0-.5.5z"/>
											<path fillRule="evenodd" d="M11 5.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793l-8.147 8.146a.5.5 0 0 0 .708.708L10 6.707V10.5a.5.5 0 0 0 1 0v-5z"/>
										</svg>
									</div>
								</Nav.Link>
							</>
						}
						&nbsp;&nbsp;

						<Navbar.Toggle onClick={() => setShowOffcanvas(true)} style={{ padding: "1px 6px", border: "0px" }} />
					</Nav>

					{/* 모바일용 우측 캔버스 메뉴 */}
					<Navbar.Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
						<Offcanvas.Header closeButton style={{backgroundColor: "#ffffff"}}>
							<Offcanvas.Title>
								<b>Menu</b>
							</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body style={{fontSize: "0.8rem"}}>
							<Nav variant="underline" className="justify-content-start flex-grow-1 pe-3">
								<Nav.Link active={props.currentMenu === "/lostark/main" ? true : false} onClick={() => menuClick("/lostark/main")}>메인</Nav.Link>
								<Nav.Link active={props.currentMenu === "/post/announce" ? true : false} onClick={() => menuClick("/post/announce/1")}>공지사항</Nav.Link>
								<Nav.Link active={props.currentMenu === "/lostark/post/unknown" ? true : false} onClick={() => menuClick("/lostark/post/unknown/1")}>익명 게시판</Nav.Link>
								<Nav.Link active={props.currentMenu === "/lostark/post/known" ? true : false} onClick={() => menuClick("/lostark/post/known/1")}>자유 게시판</Nav.Link>
								<Nav.Link active={props.currentMenu === "/lostark/useful" ? true : false} onClick={() => menuClick("/lostark/useful")}>유용한 사이트</Nav.Link>
								
								{/* <Nav.Link active={props.currentMenu === "/lostark/bus" ? true : false} onClick={() => menuClick("/lostark/bus")}>버스 정류장</Nav.Link>
								<Nav.Link active={props.currentMenu === "/lostark/academy" ? true : false} onClick={() => menuClick("/lostark/academy")}>학원</Nav.Link>
								<Nav.Link active={props.currentMenu === "/lostark/incruit" ? true : false} onClick={() => menuClick("/lostark/incruit")}>구인구직</Nav.Link>
								<Nav.Link active={props.currentMenu === "/lostark/sasage" ? true : false} onClick={() => menuClick("/lostark/sasage")}>사건사고</Nav.Link> */}
								
								<hr style={{ width: "100%" }}></hr>

								{
									props.accountData.status === "login" ?
									<>
										<Nav.Link active={props.currentMenu === "/account/mypage" ? true : false} onClick={() => menuClick("/account/mypage")}>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-fill-gear" viewBox="0 0 16 16">
													<path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Zm9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
												</svg>
												<p style={{ marginLeft: "0.7rem" }}>나의 정보</p>
											</div>
										</Nav.Link>
										
										<div style={{ paddingTop: "8px" }} onClick={() => { logoutAccount() }}>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
													<path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
													<path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
												</svg>
												<p style={{ marginLeft: "0.7rem" }}>로그아웃</p>
											</div>
										</div>
									</>
									:
									<>
										<Nav.Link active={props.currentMenu === "/account/register" ? true : false} onClick={() => menuClick("/account/register")}>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-square" viewBox="0 0 16 16">
													<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
													<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
												</svg>
												<p style={{ marginLeft: "0.7rem" }}>회원가입</p>
											</div>
										</Nav.Link>
										<Nav.Link active={props.currentMenu === "/account/login" ? true : false} onClick={() => menuClick("/account/login")}>
											<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
												<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-box-arrow-in-up-right" viewBox="0 0 16 16">
													<path fillRule="evenodd" d="M6.364 13.5a.5.5 0 0 0 .5.5H13.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 13.5 1h-10A1.5 1.5 0 0 0 2 2.5v6.636a.5.5 0 1 0 1 0V2.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H6.864a.5.5 0 0 0-.5.5z"/>
													<path fillRule="evenodd" d="M11 5.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793l-8.147 8.146a.5.5 0 0 0 .708.708L10 6.707V10.5a.5.5 0 0 0 1 0v-5z"/>
												</svg>
												<p style={{ marginLeft: "0.7rem" }}>로그인</p>
											</div>
										</Nav.Link>
									</>
								}
							</Nav>
						</Offcanvas.Body>
					</Navbar.Offcanvas>
				</Container>
			</Navbar>
			
			{/* 모바일용 상단 고정 퀵 메뉴 */}
			{/* <Navbar bg="dark" variant="dark" className="mb-3 mobileOnly" expand="" sticky="top">
				<Container>
					<div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
						<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="lightgray" className="bi bi-arrow-left-square" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
						</svg>
						&nbsp;
						<Nav style={{ display: "flex", flexDirection: "row", height: "2.2rem", color: "white", fontSize: "0.8rem", width: "90%", overflow: "scroll", whiteSpace: "nowrap" }}>
							<Nav.Link style={{ marginLeft: "0.6rem", marginRight: "1.4rem" }} active={props.currentMenu === "/lostark/main" ? true : false} onClick={() => menuClick("/lostark/main")}>메인</Nav.Link>
							<Nav.Link style={{ marginRight: "1.4rem" }} active={props.currentMenu === "/post/announce" ? true : false} onClick={() => menuClick("/post/announce/1")}>공지사항</Nav.Link>
							<Nav.Link style={{ marginRight: "1.4rem" }} active={props.currentMenu === "/lostark/post/unknown" ? true : false} onClick={() => menuClick("/lostark/post/unknown/1")}>익명 게시판</Nav.Link>
							<Nav.Link style={{ marginRight: "1.4rem" }} active={props.currentMenu === "/lostark/post/known" ? true : false} onClick={() => menuClick("/lostark/post/known/1")}>자유 게시판</Nav.Link>
							<Nav.Link style={{ marginRight: "1.4rem" }} active={props.currentMenu === "/lostark/useful" ? true : false} onClick={() => menuClick("/lostark/useful")}>유용한 사이트</Nav.Link>

							<Nav.Link style={{ marginRight: "1.4rem" }} active={props.currentMenu === "/bus" ? true : false} onClick={() => menuClick("/bus")}>버스 정류장</Nav.Link>
							<Nav.Link style={{ marginRight: "1.4rem" }} active={props.currentMenu === "/academy" ? true : false} onClick={() => menuClick("/academy")}>학원</Nav.Link>
							<Nav.Link style={{ marginRight: "1.4rem" }} active={props.currentMenu === "/incruit" ? true : false} onClick={() => menuClick("/incruit")}>구인구직</Nav.Link>
							<Nav.Link style={{ marginRight: "0.6rem" }} active={props.currentMenu === "/sasage" ? true : false} onClick={() => menuClick("/sasage")}>사건사고</Nav.Link>
						</Nav>
						&nbsp;
						<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="lightgray" className="bi bi-arrow-right-square" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
						</svg>
					</div>
				</Container>
			</Navbar> */}
			
			{/* 모바일용 하단 퀵 스크롤 메뉴 */}
			{/* <div className="mobileOnly" style={{ display: "none", position: "sticky", top: "94%" }}>
				<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", marginRight: "1rem" }}>
					<Button variant="dark" style={{ fontSize: "0.8rem", padding: "3px" }} onClick={() => { window.scrollTo({ top: "0%", behavior: "smooth" }) }}>
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
							<path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
						</svg>
					</Button>
					&nbsp;
					<Button variant="dark" style={{ fontSize: "0.8rem", padding: "3px" }} onClick={() => { window.scrollTo({ top: document.getElementsByTagName("body")[0].scrollHeight, behavior: "smooth" }) }}>
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
							<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
						</svg>
					</Button>
				</div>
			</div> */}
		</>
	);
}

export default CommonTopMenu;