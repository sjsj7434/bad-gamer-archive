import { useState, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import { useNavigate } from "react-router-dom";
import Stack from 'react-bootstrap/esm/Stack';
import * as accountsFetch from '../../js/accountsFetch'
import '../../css/ActivateLostark.css';
import LoadingModal from '../common/LoadingModal';

const ActivateLostarkAPI = (props) => {
	const [characterModalShow, setCharacterModalShow] = useState(false);
	const [characterList, setcharacterList] = useState([]);
	const [startTime, setStartTime] = useState(null);
	const [nowTime, setNowTime] = useState(null);
	const [showLoadingModal, setShowLoadingModal] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const intervalRef = useRef(null);
	const tokenStatus = useRef(null);
	const TOKEN_TIME_LIMIT = 60 * 3; //sec
	const navigate = useNavigate();

	const controlActivateVerify = (status) => {
		if(status === "activate"){
			document.querySelector("#getCodeButton").disabled = true;
			document.querySelector("#verifyButton").disabled = false;
			document.querySelector("#copyButton").textContent = "인증 코드 복사";
			document.querySelector("#copyButton").classList.replace("btn-outline-primary", "btn-outline-secondary");
		}
		else if(status === "deactivate"){
			document.querySelector("#verificationCode").value = "";
			document.querySelector("#getCodeButton").disabled = false;
			document.querySelector("#verifyButton").disabled = true;
		}
		else if(status === "done"){
			document.querySelector("#getCodeButton").disabled = true;
			document.querySelector("#verifyButton").disabled = true;
		}
	}

	let tokenLife = 0;
	if (startTime != null && nowTime != null) {
		tokenStatus.alive = true;
		tokenLife = TOKEN_TIME_LIMIT - parseInt((nowTime - startTime) / 1000, 10);
		if(tokenLife <= 0){
			tokenStatus.alive = false;
			clearInterval(intervalRef.current);
			
			controlActivateVerify("deactivate");
		}
	}

	useEffect(() => {
		return() => {
			clearInterval(intervalRef.current);
		}
	}, []);

	const moveToStovePage = async () => {
		if(isValidStoveURL !== 2){
			alert("입력하신 스토브 코드를 확인해주세요");
			document.querySelector("#stoveURL").focus();
			return;
		}
		const stoveURL = document.querySelector("#stoveURL").value;
		window.open(`https://timeline.onstove.com/${stoveURL}/setting`);
	}

	const getVerificationCode = async () => {
		if(isValidStoveURL !== 2){
			alert("입력하신 스토브 코드를 확인해주세요");;
			document.querySelector("#stoveURL").focus();
			return;
		}
		const verificationCode = await accountsFetch.getVerificationCode();
		document.querySelector("#verificationCode").value = verificationCode;
		document.querySelector("#verificationArea").style.display = "";

		controlActivateVerify("activate");

		clearInterval(intervalRef.current);
		setStartTime(Date.now());
		setNowTime(Date.now());
		intervalRef.current = setInterval(() => {
			console.log('Token...');
			setNowTime(Date.now());
		}, 1000);
	}

	const copyVerificationCode = async () => {
		document.querySelector("#copyButton").textContent = "코드 복사 완료";
		const verificationCode = document.querySelector("#verificationCode");
		await navigator.clipboard.writeText(verificationCode.value);
		
		document.querySelector("#copyButton").classList.replace("btn-outline-secondary", "btn-outline-primary");
	}

	const compareCodeWithStove = async () => {
		if(tokenStatus.alive !== true){
			alert("인증 코드가 만료되었습니다");
			return;
		}

		setShowLoadingModal(true);
		setLoadingMessage("스토브 소개 정보를 확인 중입니다");
		const stoveURL = document.querySelector("#stoveURL").value;
		const [matchResult, characterNames] = await accountsFetch.checkProfileTokenMatchAPI(stoveURL);
		console.log(matchResult, characterNames)

		if(matchResult === "code"){
			alert("스토브 코드를 다시 확인해주세요");
			setCharacterModalShow(false);
		}
		else if(matchResult === "fail"){
			alert("인증 코드가 올바르지 않습니다");
			setCharacterModalShow(false);
		}
		else if(matchResult === "redo"){
			alert("인증 코드가 만료되었습니다");
			setCharacterModalShow(false);

			clearInterval(intervalRef.current);
			controlActivateVerify("deactivate");
		}
		else if(matchResult.length === 0){
			alert("캐릭터 정보가 존재하지 않습니다");
			setCharacterModalShow(false);
		}
		else{
			clearInterval(intervalRef.current);

			const elements = [];
			elements.push(characterNames.map((characterInfo) => {
				return (
					<ListGroup.Item key={characterInfo.CharacterName} action onClick={() => {setCharacter(characterInfo)}} style={{fontSize: "0.8rem"}}>
						[{characterInfo.ServerName}] <b>{characterInfo.CharacterName}</b> / {characterInfo.ItemMaxLevel} / {characterInfo.CharacterClassName}
					</ListGroup.Item>
				)
			}));
			elements.push(
				<ListGroup.Item key={"noCharacter"} action onClick={() => {noCharacter()}} style={{color: "red", fontSize: "0.8rem"}}>
					[!] 인증하지않고 종료하기
				</ListGroup.Item>
			);

			setcharacterList(elements);
			setCharacterModalShow(true);
		}
		
		setShowLoadingModal(false);
	}

	const noCharacter = async () => {
		if(window.confirm("인증하지 않고 종료하시겠습니까?")){
			setCharacterModalShow(false);
			controlActivateVerify("done");
			navigate("/accounts/mypage");
		}
	}

	const setCharacter = async (characterInfo) => {
		if(window.confirm(`[${characterInfo.CharacterName} (Level.${characterInfo.ItemMaxLevel})] 캐릭터로 인증하시겠습니까?`)){
			setCharacterModalShow(false);
			controlActivateVerify("done");
			
			setShowLoadingModal(true);
			setLoadingMessage("캐릭터를 설정 중입니다");
			await accountsFetch.setLostarkMainCharacter({
				lostarkMainCharacter: characterInfo.CharacterName,
			});
			setShowLoadingModal(false);
			navigate("/accounts/mypage")
		}
	}

	const checkStoveCodeValid = () => {
		const numberRegExp = /^[0-9]+$/;

		if(numberRegExp.test(document.querySelector("#stoveURL").value) === false){
			setIsValidStoveURL(1);
		}
		else{
			setIsValidStoveURL(2);
		}
	}
	const [isValidStoveURL, setIsValidStoveURL] = useState(0);

	const statusParser = (isValidStoveURL) => {
		if(isValidStoveURL === 0){
			return "";
		}
		else if(isValidStoveURL === 1){
			return "is-invalid";
		}
		else if(isValidStoveURL === 2){
			return "is-valid";
		}
	}

	const moveToStoveTimeline = () => {
		window.open("https://timeline.onstove.com");
	}

	const moveToStoveLogin = () => {
		window.open("https://accounts.onstove.com/login");
	}

	const controlStoveFormShow = () => {
		if(window.confirm("인증을 진행하기위해 스토브에 로그인하셨습니까?\n\n스토브에 로그인하지 않은 상태여도 인증 진행은 가능합니다\n[확인]을 누르시면 인증 절차를 시작합니다") === false){
			document.querySelector("#stoveLoginSwitch").checked = false;
			return;
		}

		if(document.querySelector("#stoveLoginSwitch").checked === true){
			document.querySelector("#stoveForm").style.display = "";
			document.querySelector("#stoveLoginSwitch").disabled = true;
			document.querySelector("#stoveLoginButton").disabled = true;
		}
		else{
			document.querySelector("#stoveForm").style.display = "none";
		}
	}

	return (
		<Container style={{maxWidth: "600px"}}>
			<LoadingModal showModal={showLoadingModal} message={loadingMessage}></LoadingModal>

			<div style={{ marginTop: "20px", fontSize: "0.8rem", color: "black" }}>
				<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
					원활한 인증을 위해 확인해주세요
				</Form.Label>
				<div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
					<Form.Check type="switch" id="stoveLoginSwitch" label="스토브에 로그인하였습니다" onChange={() => {controlStoveFormShow()}} />
					<Button id={"stoveLoginButton"} variant={"info"} style={{width: "35%", fontSize: "0.8rem"}} onClick={() => {moveToStoveLogin()}}>스토브 로그인하기</Button>
				</div>

				<hr />
			</div>

			<div id="stoveForm" style={{ marginTop: "20px", display: "none" }}>
				<Form>
					<Form.Group as={Row} className="mb-3">
						<Col>
							<Row className="mb-3">
								<Col>
									<Button size={"lg"} style={{width: "100%", marginTop: "5px", marginBottom: "5px", fontSize: "0.8rem"}} onClick={() => {moveToStoveTimeline()}}>내 스토브 코드 확인하기</Button>
								</Col>
							</Row>
							
							<Row className="mb-3">
								<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
									스토브 코드 (Stove code)
								</Form.Label>
								<InputGroup>
									<Form.Control className={statusParser(isValidStoveURL)} id="stoveURL" maxLength={20} defaultValue={"83359381"} placeholder={"자신의 스토브 코드를 적어주세요"} autoComplete={"off"} onChange={() => {checkStoveCodeValid()}} style={{fontSize: "0.9rem"}} />
									<Button variant="outline-secondary" id="getCodeButton" onClick={() => {getVerificationCode()}} style={{fontSize: "0.8rem"}}>
										인증 코드 받기
									</Button>
								</InputGroup>
								<Form.Text muted style={{fontSize: "0.8rem"}}>
									<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
											<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
											<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
										</svg>
										<span style={{marginLeft: "8px"}}>
											전체 주소(URL)가 아니라 스토브 코드(숫자)만 적어주세요
										</span>
									</div>
									<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-check" viewBox="0 0 16 16">
											<path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
											<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
											<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
										</svg>
										<span style={{marginLeft: "8px"}}>
											예시 : https://timeline.onstove.com/<span style={{color: "black", padding: "1px", backgroundColor: "greenyellow"}}>12345678</span>
										</span>
									</div>
								</Form.Text>
							</Row>

							<div id="verificationArea" style={{display: "none"}}>
								<hr/>
								<Row className="mb-3">
									<Col>
										<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
											인증 코드 (Verify code)
										</Form.Label>
										<InputGroup>
											<Form.Control id="verificationCode" readOnly style={{fontSize: "0.9rem"}} />
											
											<Button variant="outline-secondary" id="copyButton" onClick={() => {copyVerificationCode()}} style={{fontSize: "0.8rem"}}>
												인증 코드 복사
											</Button>
										</InputGroup>
										<Form.Text muted style={{fontSize: "0.8rem"}}>
											<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
													<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
													<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
												</svg>
												<span style={{marginLeft: "8px"}}>
													인증 코드를 복사하여 본인의 스토브 <strong>소개</strong>에 적어주세요
												</span>
											</div>
											{
												tokenStatus.alive === true ?
												<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass-split" viewBox="0 0 16 16">
														<path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
													</svg>
													<span style={{marginLeft: "8px"}}>남은 시간(초) : {tokenLife}</span>
												</div>
												:
												<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-hourglass" viewBox="0 0 16 16">
														<path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2h-7z"/>
													</svg>
													<span style={{marginLeft: "8px", color: "red"}}>인증 코드 시간이 만료되었습니다, 다시 발급받아 진행해주세요</span>
												</div>
											}
										</Form.Text>
									</Col>
								</Row>

								<Row className="mb-3">
									<Stack direction="horizontal" gap={2}>
										<Button size={"lg"} variant={"primary"} style={{width: "100%", fontSize: "0.8rem"}} onClick={() => {moveToStovePage()}}>내 스토브 설정으로 이동</Button>
										<Button size={"lg"} variant={"success"} id="verifyButton" onClick={() => {compareCodeWithStove()}} style={{width: "100%", fontSize: "0.8rem"}}>스토브 계정 인증하기</Button>
									</Stack>
									<div style={{display: "flex", alignItems: "center", marginTop: "5px", fontSize: "0.8rem", color: "gray"}}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
											<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
											<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
										</svg>
										<span style={{marginLeft: "8px"}}>
											인증 코드를 본인의 스토브 <strong>소개</strong>에 저장한 후 인증해주세요
										</span>
									</div>
								</Row>
							</div>
						</Col>
					</Form.Group>
					
					<Modal show={characterModalShow} onHide={() => {setCharacterModalShow(false)}} animation={true} backdrop="static" keyboard={false} centered>
						<Modal.Header>
							<Modal.Title>선택해주세요</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
								<Row>
									<Col>
										<ListGroup variant="flush">
											{characterList}
										</ListGroup>
									</Col>
								</Row>
							</Tab.Container>
						</Modal.Body>
					</Modal>
				</Form>
			</div>
		</Container>
	);
}

export default ActivateLostarkAPI;