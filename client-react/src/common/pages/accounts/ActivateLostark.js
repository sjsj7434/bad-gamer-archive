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

import * as accountsAction from '../../js/accountsAction'

const ActivateLostark = (props) => {
	const [characterModalShow, setCharacterModalShow] = useState(false);
	const [characterList, setcharacterList] = useState([]);
	const [startTime, setStartTime] = useState(null);
	const [nowTime, setNowTime] = useState(null);
	const intervalRef = useRef(null);
	const tokenStatus = useRef(null);
	const TOKEN_TIME_LIMIT = 180; //sec

	let tokenLife = 0;
	if (startTime != null && nowTime != null) {
		tokenStatus.alive = true;
		tokenLife = TOKEN_TIME_LIMIT - parseInt((nowTime - startTime) / 1000, 10);
		if(tokenLife <= 0){
			tokenStatus.alive = false;
			clearInterval(intervalRef.current);
			
			document.querySelector("#getCodeButton").disabled = false;
			document.querySelector("#verifyButton").disabled = true;
		}
	}

	useEffect(() => {
		return() => {
			clearInterval(intervalRef.current);
		}
	}, []);

	const moveToStovePage = async () => {
		const stoveURL = document.querySelector("#stoveURL").value;
		window.open(`https://timeline.onstove.com/${stoveURL}/setting`);
	}
	const getVerificationCode = async () => {
		const verificationCode = await accountsAction.getVerificationCode();
		document.querySelector("#verificationCode").value = verificationCode;
		document.querySelector("#verificationArea").style.display = "";
		document.querySelector("#getCodeButton").disabled = true;
		document.querySelector("#verifyButton").disabled = false;
		document.querySelector("#copyButton").textContent = 'Copy';
		document.querySelector("#copyButton").classList.replace("btn-outline-primary", "btn-outline-secondary");

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

		clearInterval(intervalRef.current);

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
		}
		else if(matchResult.length === 0){
			alert("No character data!");
			setCharacterModalShow(false);
		}
		else{
			const elements = [];
			elements.push(matchResult.map((character) => {
				return (
					<ListGroup.Item key={character} action onClick={() => {setCharacter(character)}}>
						{character}
					</ListGroup.Item>
				)
			}));

			setcharacterList(elements);
			setCharacterModalShow(true);
		}
		
		props.setWaitModalShow(false);
	}

	const setCharacter = (character) => {
		if(window.confirm(`${character}로 캐릭터를 설정하시겠습니까?`)){
			document.querySelector("#getCodeButton").disabled = true;
			document.querySelector("#verifyButton").disabled = true;
			setCharacterModalShow(false);
			document.querySelector("#formArea").style.display = "";
			
			document.querySelector("#chosenCharacter").value = character;
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
									<Button variant="outline-secondary" onClick={() => {moveToStovePage()}}>
										Go Stove
									</Button>
									<Button variant="outline-secondary" id="getCodeButton" onClick={() => {getVerificationCode()}}>
										Get Code
									</Button>
								</InputGroup>
								<Form.Text muted>
									Please write only the "code", not all url
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
									<Button variant="outline-secondary" id="verifyButton" onClick={() => {compareCodeWithStove()}}>
										Verify
									</Button>
								</InputGroup>
								<Form.Text muted>
									{tokenStatus.alive === true ? <span>Time left : {tokenLife}</span> : <span style={{color: "red"}}>Token has expired, Click <b>[Get Code]</b> button again please</span>}
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

					<div id="formArea" style={{display: "none"}}>
						<Form.Group as={Row} className="mb-3">
							<Form.Label column sm="2">
								Character
							</Form.Label>
							<Col sm="10">
								<Form.Control id="chosenCharacter" plaintext readOnly />
								<Form.Text muted>
									Your ID must be 1-20 characters long, only alphabet
								</Form.Text>
							</Col>
						</Form.Group>
						
						<Form.Group as={Row} className="mb-3">
							<Form.Label column sm="2">
								Level
							</Form.Label>
							<Col sm="10">
								<Form.Control id="chosenCharacterLevel" defaultValue="1232.34" plaintext readOnly />
								<Form.Text muted>
									Your ID must be 1-20 characters long, only alphabet
								</Form.Text>
							</Col>
						</Form.Group>
						
						<Form.Group as={Row} className="mb-3">
							<Form.Label column sm="2">
								Class
							</Form.Label>
							<Col sm="10">
								<Form.Control id="chosenCharacterClass" defaultValue="goal keep" plaintext readOnly />
								<Form.Text muted>
									Your ID must be 1-20 characters long, only alphabet
								</Form.Text>
							</Col>
						</Form.Group>

						<Button size={"lg"} style={{width: "100%", marginBottom: "15px"}}>SAVE</Button>
					</div>
				</Form>
			</div>
		</Container>
	);
}

export default ActivateLostark;