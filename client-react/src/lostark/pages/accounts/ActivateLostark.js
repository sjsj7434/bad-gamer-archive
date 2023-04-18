import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';

import * as dbActions from '../../js/dbActions.js'

const RegisterForm = (props) => {
	const [validated, setValidated] = useState(false);
	const [modalShow, setModalShow] = useState(false);
	const [characterList, setcharacterList] = useState([]);

	useEffect(() => {
		const call = async (characterName) => {
			console.log(characterName);
		}
		
		call(props.characterName);
	}, [props]); //처음 페이지 로딩 될때만

	const moveToStovePage = async () => {
		const stoveURL = document.querySelector('#stoveURL').value;
		window.open(`https://timeline.onstove.com/${stoveURL}`);
	}
	const showVerificationArea = async () => {
		const verificationCode = await dbActions.getVerificationCode();
		document.querySelector('#verificationCode').value = verificationCode;
		document.querySelector("#verificationArea").style.display = "";
	}
	const copyVerificationCode = async () => {
		const verificationCode = document.querySelector('#verificationCode');
		await navigator.clipboard.writeText(verificationCode.value);
		alert('인증코드가 복사되었습니다');
	}

	const showCharacterModal = async () => {
		const stoveURL = document.querySelector('#stoveURL').value;
		const characterNames = await dbActions.checkCodeMatch(stoveURL);
		console.log(characterNames);

		const ele = [];
		ele.push(characterNames.map((character) => {
			return (
				<ListGroup.Item key={character} action onClick={() => {setCharacter(character)}}>
					{character}
				</ListGroup.Item>
			)
		}))

		setcharacterList(ele)
		
		setModalShow(true);
	}

	const setCharacter = (character) => {
		if(window.confirm(`${character}로 캐릭터를 설정하시겠습니까?`)){
			document.querySelector('#getCodeButton').disabled = true;
			document.querySelector('#verifyButton').disabled = true;
			setModalShow(false);
			document.querySelector("#formArea").style.display = "";
			
			document.querySelector('#chosenCharacter').value = character;
		}
	}

	return (
		<Container>
			<div style={{ margin: "20px" }}>
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
										defaultValue={"83200592"}
									/>
									<Button variant="outline-secondary" onClick={() => {moveToStovePage()}}>
										Open Page
									</Button>
									<Button variant="outline-secondary" id="getCodeButton" onClick={() => {showVerificationArea()}}>
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
									
									<Button variant="outline-secondary" onClick={() => {copyVerificationCode()}}>
										Copy
									</Button>
									<Button variant="outline-secondary" id="verifyButton" onClick={() => {showCharacterModal()}}>
										Verify
									</Button>
								</InputGroup>
								<Form.Text muted>
									Your password must be 8-20 characters long, contain letters and numbers
								</Form.Text>
							</Row>
						</Col>
					</Form.Group>
					
					<Modal show={modalShow} onHide={() => {setModalShow(false)}} animation={true} backdrop="static" keyboard={false} centered>
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
						<Form.Group as={Row} className="mb-5">
							<Form.Label column sm="2">
								Set Character
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
								ID
							</Form.Label>
							<Col sm="10">
								<Form.Control defaultValue="" />
								<Form.Text muted>
									Your ID must be 1-20 characters long, only alphabet
								</Form.Text>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3">
							<Form.Label column sm="2">
								Nickname
							</Form.Label>
							<Col sm="10">
								<Form.Control defaultValue="" />
								<Form.Text muted>
									Your Nickname must be 1-20 characters long, no special letters
								</Form.Text>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3">
							<Form.Label column sm="2">
								Email
							</Form.Label>
							<Col sm="10">
								<Form.Control defaultValue="email@example.com" />
								<Form.Text muted>
									Your Email will be used when you lost your password
								</Form.Text>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3">
							<Form.Label column sm="2">
								Password
							</Form.Label>
							<Col sm="10">
								<Form.Control type="password" placeholder="Password" />
								<Form.Text muted>
									Your password must be 8-20 characters long, contain letters and numbers
									<br/>
									be calm, password will be encrypted, so web admin will not know your password
								</Form.Text>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3">
							<Form.Label column sm="2">
								Re-Password
							</Form.Label>
							<Col sm="10">
								<Form.Control type="password" placeholder="Re-Password" />
								<Form.Text muted>
									Type your password once more
								</Form.Text>
							</Col>
						</Form.Group>
					</div>
				</Form>
			</div>
		</Container>
	);
}

export default RegisterForm;