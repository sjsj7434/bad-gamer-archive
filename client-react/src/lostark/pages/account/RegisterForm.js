import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import * as accountAction from '../../js/accountAction.js'

const RegisterForm = (props) => {
	const [idValid, setIdValid] = useState(0);
	const [nicknameValid, setNicknameValid] = useState(0);
	const [emailValid, setEmailValid] = useState(0);
	const [passwordValid, setPasswordValid] = useState(0);
	const [rePasswordValid, setRePasswordValid] = useState(0);
	const [idDuplicated, setIdDuplicated] = useState(0);
	const [nicknameDuplicated, setNicknameDuplicated] = useState(0);
	const [waitModalShow, setWaitModalShow] = useState(false);
	const [waitModalMessage, setWaitModalMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const call = async (characterName) => {
			// console.log(characterName);
		}
		
		call(props.characterName);
	}, [props]); //처음 페이지 로딩 될때만

	const handleSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;

		if(idValid !== 2){
			alert("Please check your ID");
			form.idInput.focus();
			return;
		}
		if(idDuplicated !== 2){
			alert("Please check your ID is duplicated");
			return;
		}
		if(nicknameValid !== 2){
			alert("Please check your Nickname");
			form.nicknameInput.focus();
			return;
		}
		if(nicknameDuplicated !== 2){
			alert("Please check your Nickname is duplicated");
			return;
		}
		if(emailValid !== 2){
			alert("Please check your Email");
			form.emailInput.focus();
			return;
		}
		if(passwordValid !== 2){
			alert("Please check your Password");
			form.passwordInput.focus();
			return;
		}
		if(rePasswordValid !== 2){
			alert("Please check your Re-Password");
			form.rePasswordInput.focus();
			return;
		}

		if(window.confirm("Do you wanna proceed?")){
			setWaitModalShow(true);
			setWaitModalMessage("Welcome!");
			await asyncWaiter(1);
			setWaitModalShow(false);

			const createResult = await accountAction.createAccount({
				code: 0,
				id: form.idInput.value,
				nickname: (form.nicknameInput.value),
				email: form.emailInput.value,
				password: form.passwordInput.value,
				passwordSalt: "passwordSalt",
				loginFailCount: 0,
				passwordChangeDate: null,
				personalQuestion: "",
				personalAnswer: "",
			});

			if(createResult === 1){
				alert("Hey Dev, you need to make encryption pwd\nGood, Welcome!\nMove to [Login] page");
				navigate("/");
			}
			else if(createResult === 0){
				alert("[Failed] There is same ID or Nickname already!");
				setIdValid(1);
				setNicknameValid(1);
				setIdDuplicated(1);
				setNicknameDuplicated(1);

				form.idInput.value = "";
				form.nicknameInput.value = "";
			}
		}
	};

	const checkID = () => {
		const idInput = document.querySelector("#idInput");
		const idRegExp = new RegExp("[a-z0-9]", "g");

		idInput.value = idInput.value.toLowerCase();
		setIdDuplicated(0);

		if(idInput.value.replace(idRegExp, "") === "" && (5 <= idInput.value.length && idInput.value.length <= 20)){
			setIdValid(2);
		}
		else{
			setIdValid(1);
		}
	}

	const checkNickname = () => {
		const nicknameInput = document.querySelector("#nicknameInput");
		const nicknameRegExp = new RegExp("[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]", "g");

		setNicknameDuplicated(0);

		if(nicknameInput.value.replace(nicknameRegExp, "") === "" && (1 <= nicknameInput.value.length && nicknameInput.value.length <= 20)){
			setNicknameValid(2);
		}
		else{
			setNicknameValid(1);
		}
	}

	const checkEmail = () => {
		const emailInput = document.querySelector("#emailInput");
		const emailRegExp = new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$", "i");

		if(emailRegExp.test(emailInput.value) === true){
			setEmailValid(2);
		}
		else{
			setEmailValid(1);
		}
	}

	const checkPassword = () => {
		const passwordInput = document.querySelector("#passwordInput");
		const passwordRegExp = new RegExp("^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$");

		if(passwordRegExp.test(passwordInput.value) === true){
			setPasswordValid(2);
		}
		else{
			setPasswordValid(1);
		}

		checkRePassword();
	}

	const checkRePassword = () => {
		const passwordInput = document.querySelector("#passwordInput");
		const rePasswordInput = document.querySelector("#rePasswordInput");

		if(passwordInput.value === rePasswordInput.value && passwordInput.classList.contains("is-valid")){
			setRePasswordValid(2);
		}
		else{
			setRePasswordValid(1);
		}
	}

	/**
	 * 과도한 호출을 방지하기위한 대기
	 * @param {number} second 대기할 초
	 * @returns 없음
	 */
	const asyncWaiter = async (second) => {
		return new Promise((prom) => setTimeout(prom, second * 1000));
	}

	/**
	 * 중복되는 ID가 있는지 확인
	 * @returns boolean
	 */
	const isDuplicatedID = async () => {
		const idInput = document.querySelector("#idInput");
		
		if(idValid === 2){
			setWaitModalShow(true);
			setWaitModalMessage("We're checking your ID");
			await asyncWaiter(1);
			setWaitModalShow(false);

			const result = await accountAction.isDuplicatedID(idInput.value);
	
			if(result !== null){
				setIdDuplicated(1);
				return false;
			}
			else{
				setIdDuplicated(2);
				return true;
			}
		}
		else{
			idInput.focus();
			setIdDuplicated(0);
			return false;
		}
	}

	/**
	 * 중복되는 닉네임이 있는지 확인
	 * @returns boolean
	 */
	const isDuplicatedNickname = async () => {
		const nicknameInput = document.querySelector("#nicknameInput");
		
		if(nicknameInput.classList.contains("is-valid") === true){
			setWaitModalShow(true);
			setWaitModalMessage("We're checking your Nickname");
			await asyncWaiter(1);
			setWaitModalShow(false);

			const result = await accountAction.isDuplicatedNickname(nicknameInput.value);

			if(result !== null){
				setNicknameDuplicated(1);
				return false;
			}
			else{
				setNicknameDuplicated(2);
				return true;
			}
		}
		else{
			nicknameInput.focus();
			setNicknameDuplicated(0);
			return false;
		}
	}

	const statusParser = (status) => {
		if(status === 0){
			return "";
		}
		else if(status === 1){
			return "is-invalid";
		}
		else if(status === 2){
			return "is-valid";
		}
	}

	const statusParserToElement = (status) => {
		if(status === 0){
			return <span style={{color: "red"}}>Please click <b>[Check]</b> button to check duplicated</span>;
		}
		else if(status === 1){
			return <span style={{color: "red"}}>It's already in use</span>;
		}
		else if(status === 2){
			return <span style={{color: "green"}}>It's good to go</span>;
		}
	}

	return (
		<Container style={{maxWidth: "600px"}}>
			<Modal
				show={waitModalShow}
				backdrop="static"
				keyboard={false}
				centered
			>
				<Modal.Body>
					<div style={{display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "50px", marginBottom: "50px"}}>
						<Spinner animation="grow" variant="success" />&nbsp;&nbsp;<h4>{waitModalMessage}</h4>
					</div>
				</Modal.Body>
			</Modal>

			<div style={{ marginTop: "30px" }}>
				<div style={{ marginBottom: "30px" }}>
					<h2>Welcome To here</h2>
				</div>
				<Form noValidate onSubmit={handleSubmit}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							ID
						</Form.Label>
						<Col>
							<InputGroup>
								<Form.Control className={statusParser(idValid)} id="idInput" maxLength={20} type="text" placeholder="ID" isValid={false} isInvalid={false} onChange={() => {checkID()}} autoComplete="off" />
								<Button variant="outline-dark" onClick={() => {isDuplicatedID()}}>
									Check
								</Button>
							</InputGroup>
							<Form.Text muted>
								Your ID must be 5-20 characters long, only alphabet and numbers
								<div>{statusParserToElement(idDuplicated)}</div>
							</Form.Text>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							Nickname
						</Form.Label>
						<Col>
							<InputGroup>
								<Form.Control className={statusParser(nicknameValid)} id="nicknameInput" maxLength={20} type="text" placeholder="Nickname" onChange={() => {checkNickname()}} autoComplete="off" />
								<Button variant="outline-dark"onClick={() => {isDuplicatedNickname()}}>
									Check
								</Button>
							</InputGroup>
							<Form.Text muted>
								Your Nickname must be 1-20 characters long, no special letters
								<div>{statusParserToElement(nicknameDuplicated)}</div>
							</Form.Text>

							<Form.Control.Feedback type="invalid">
								Please choose a Nickname.
							</Form.Control.Feedback>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							Email
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(emailValid)} id="emailInput" maxLength={50} type="email" placeholder="email" onChange={() => {checkEmail()}} autoComplete="off" />
							<Form.Text muted>
								Your Email will be used when you lost your password
							</Form.Text>
							<Form.Control.Feedback type="invalid">
								Please choose a email.
							</Form.Control.Feedback>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							Password
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(passwordValid)} id="passwordInput" maxLength={20} type="password" placeholder="password" onChange={() => {checkPassword()}} />
							<Form.Text muted>
								Your password must be 8-20 characters long, contain letters and numbers
							</Form.Text>
							
							<Form.Control.Feedback id="passwordValid" type="valid">
								Password is good
							</Form.Control.Feedback>
							<Form.Control.Feedback id="passwordInvalid" type="invalid">
								At least 8, alphabet, numbers, special letters
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							Re-Password
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(rePasswordValid)} id="rePasswordInput" maxLength={20} type="password" placeholder="Re-password" onChange={() => {checkRePassword()}} />
							<Form.Text muted>
								Type your password once more
							</Form.Text>
							
							<Form.Control.Feedback id="passwordValid" type="valid">
								Password is same
							</Form.Control.Feedback>
							<Form.Control.Feedback id="passwordInvalid" type="invalid">
								Password is not same
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					
					<Button type="submit">Submit form</Button>
				</Form>
			</div>

			<br/>
			password will be encrypted, so web admin will not know your password
		</Container>
	);
}

export default RegisterForm;