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

	const controlActivateVerify = (status) => {
		if(status === "activate"){
			document.querySelector("#getCodeButton").disabled = true;
			document.querySelector("#verifyButton").disabled = false;
			document.querySelector("#copyButton").textContent = 'Copy';
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

	const moveToStovePage = async () => {
		const stoveURL = document.querySelector("#stoveURL").value;
		window.open(`https://timeline.onstove.com/${stoveURL}/setting`);
	}
	const getVerificationCode = async () => {
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
		document.querySelector("#copyButton").textContent = 'Copied';
		const verificationCode = document.querySelector("#verificationCode");
		await navigator.clipboard.writeText(verificationCode.value);
		// alert("인증코드가 복사되었습니다");
		
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

	return (
		<Container fluid>
			<div style={{ marginTop: "20px" }}>
				<Form>
					<Form.Group as={Row} className="mb-3">
						<Form.Label column sm="2">
							Stove Code
						</Form.Label>
						<Col sm="10">
							<Row className="mb-3">
								<InputGroup>
									<Form.Control
										id="stoveURL"
										defaultValue={"83359381"}
									/>
									<Button variant="outline-secondary" id="getCodeButton" onClick={() => {getVerificationCode()}}>
										Get Code
									</Button>
								</InputGroup>
								<Form.Text muted>
									Please write only the "code", not all url

									<Button size={"lg"} style={{width: "100%", marginBottom: "15px"}} onClick={() => {moveToStovePage()}}>Go stove</Button>
								</Form.Text>

							</Row>
							<Row id="verificationArea" className="mb-3" style={{display: "none"}}>
								<InputGroup>
									<Form.Control
										id="verificationCode"
										readOnly
									/>
									
									<Button variant="outline-secondary" id="copyButton" onClick={() => {copyVerificationCode()}}>
										Copy
									</Button>
								</InputGroup>
								<Form.Text muted>
									{tokenStatus.alive === true ? <span>Time left : {tokenLife}</span> : <span style={{color: "red"}}>Token has expired, Click <b>[Get Code]</b> button again please</span>}
									
									<Button size={"lg"} style={{width: "100%", marginBottom: "15px"}} id="verifyButton" onClick={() => {compareCodeWithStove()}}>Verify</Button>
  								</Form.Text>
							</Row>
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