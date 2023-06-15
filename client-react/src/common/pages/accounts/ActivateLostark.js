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

import * as accountsAction from '../../js/accountsAction'

const ActivateLostark = (props) => {
	const [characterModalShow, setCharacterModalShow] = useState(false);
	const [characterList, setcharacterList] = useState([]);
	const [startTime, setStartTime] = useState(null);
	const [nowTime, setNowTime] = useState(null);
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
		const verificationCode = await accountsAction.getVerificationCode();
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
			alert('no token');
			return;
		}

		props.setWaitModalShow(true);
		const stoveURL = document.querySelector("#stoveURL").value;
		const matchResult = await accountsAction.checkTokenMatch(stoveURL);

		if(matchResult === "code"){
			alert("please check your stove code");
			setCharacterModalShow(false);
		}
		else if(matchResult === "fail"){
			alert("token is not correct");
			setCharacterModalShow(false);
		}
		else if(matchResult === "redo"){
			alert("token is expired");
			setCharacterModalShow(false);

			clearInterval(intervalRef.current);
			controlActivateVerify("deactivate");
		}
		else if(matchResult.length === 0){
			alert("No character data!");
			setCharacterModalShow(false);
		}
		else{
			clearInterval(intervalRef.current);

			console.log(matchResult)

			const elements = [];
			elements.push(matchResult.map((characterInfo) => {
				return (
					<ListGroup.Item key={characterInfo.CharacterName} action onClick={() => {setCharacter(characterInfo)}}>
						[{characterInfo.ServerName}] <b>{characterInfo.CharacterName}</b> / {characterInfo.ItemMaxLevel} / {characterInfo.CharacterClassName}
					</ListGroup.Item>
				)
			}));

			setcharacterList(elements);
			setCharacterModalShow(true);
		}
		
		props.setWaitModalShow(false);
	}

	const setCharacter = (characterInfo) => {
		if(window.confirm(`[${characterInfo.CharacterName} (Level.${characterInfo.ItemMaxLevel})] 캐릭터로 인증하시겠습니까?`)){
			setCharacterModalShow(false);
			controlActivateVerify("done");
			
			props.setWaitModalShow(true);
			accountsAction.setLostarkMainCharacter({
				lostarkMainCharacter: characterInfo.CharacterName,
			});
			props.setWaitModalShow(false);
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

	return (
		<Container style={{maxWidth: "600px"}}>
			<div style={{ marginTop: "20px" }}>
				<Form>
					<Form.Group as={Row} className="mb-3">
						<Col>
							<Row className="mb-3">
								<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
									스토브 코드 (Stove code)
								</Form.Label>
								<InputGroup>
									<Form.Control className={statusParser(isValidStoveURL)} id="stoveURL" maxLength={20} defaultValue={"83359384"} placeholder={"자신의 스토브 코드를 적어주세요"} autoComplete={"off"} onChange={() => {checkStoveCodeValid()}} style={{fontSize: "0.9rem"}} />
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

							<Row className="mb-3">
								<Col>
									<Button size={"lg"} style={{width: "100%", marginTop: "15px", marginBottom: "15px", fontSize: "0.8rem"}} onClick={() => {moveToStovePage()}}>내 스토브 확인하기</Button>
								</Col>
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
													인증 코드를 복사하여 본인의 스토브 자기소개에 적어주세요
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
									<Col>
										<Button size={"lg"} style={{width: "100%", marginTop: "15px", marginBottom: "15px", fontSize: "0.8rem"}} onClick={() => {moveToStovePage()}}>내 스토브 설정으로 이동</Button>
									</Col>
								</Row>

								<Row className="mb-3">
									<Col>
										<Button size={"lg"} variant={"success"} style={{width: "100%", marginTop: "15px", marginBottom: "15px", fontSize: "0.8rem"}} id="verifyButton" onClick={() => {compareCodeWithStove()}}>스토브 소유자 인증하기</Button>
									</Col>
								</Row>
							</div>
						</Col>
					</Form.Group>
					
					<Modal show={characterModalShow} onHide={() => {setCharacterModalShow(false)}} animation={true} backdrop="static" keyboard={false} centered>
						<Modal.Header>
							<Modal.Title>Choose one</Modal.Title>
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

export default ActivateLostark;