import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import * as dbActions from '../../js/dbActions.js'

const RegisterForm = (props) => {
	const [idValid, setIdValid] = useState(0);
	const [nicknameValid, setNicknameValid] = useState(0);
	const [emailValid, setEmailValid] = useState(0);
	const [passwordValid, setPasswordValid] = useState(0);
	const [rePasswordValid, setRePasswordValid] = useState(0);
	const [idDuplicated, setIdDuplicated] = useState(0);
	const [nicknameDuplicated, setNicknameDuplicated] = useState(0);

	useEffect(() => {
		const call = async (characterName) => {
			// console.log(characterName);
		}
		
		call(props.characterName);
	}, [props]); //처음 페이지 로딩 될때만

	const handleSubmit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;
		
		console.log(form);

		if(idValid !== 2){
			alert("please check your ID");
			form.idInput.focus();
			return;
		}
		if(idDuplicated !== 2){
			alert("please check your ID is duplicated");
			return;
		}
		if(nicknameValid !== 2){
			alert("please check your Nickname");
			form.nicknameInput.focus();
			return;
		}
		if(nicknameDuplicated !== 2){
			alert("please check your Nickname is duplicated");
			return;
		}
		if(emailValid !== 2){
			alert("please check your Email");
			form.emailInput.focus();
			return;
		}
		if(passwordValid !== 2){
			alert("please check your Password");
			form.passwordInput.focus();
			return;
		}

		if(window.confirm("save?")){
			form.idCheck.disabled = true;
			form.nicknameCheck.disabled = true;

			alert('Let it submit ~');
		}
	};

	const checkID = () => {
		const idCheck = document.querySelector("#idCheck");
		const idInput = document.querySelector("#idInput");
		const idRegExp = new RegExp("[a-z0-9]", "g");

		idCheck.value = false; //새로 중복 검사를 하도록 함
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
		const nicknameCheck = document.querySelector("#nicknameCheck");
		const nicknameInput = document.querySelector("#nicknameInput");
		const nicknameRegExp = new RegExp("[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]", "g");

		nicknameCheck.value = false; //새로 중복 검사를 하도록 함
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
	 * 중복되는 ID가 있는지 확인
	 * @returns boolean
	 */
	const isDuplicatedID = async () => {
		const idCheck = document.querySelector("#idCheck");
		const idInput = document.querySelector("#idInput");
		
		if(idInput.classList.contains("is-valid") === true){
			const result = await dbActions.isDuplicatedID(idInput.value);
			console.log(result);
	
			if(result !== null){
				idInput.classList.remove("is-valid");
				idInput.classList.add("is-invalid");
				idCheck.value = false;
				alert("sorry, you can not use this id");
				setIdDuplicated(1);
				return false;
			}
			else{
				idInput.classList.add("is-valid");
				idInput.classList.remove("is-invalid");
				idCheck.value = true;
				alert("good, you can use this id");
				setIdDuplicated(2);
				return true;
			}
		}
		else{
			alert("please write your id");
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
		const nicknameCheck = document.querySelector("#nicknameCheck");
		const nicknameInput = document.querySelector("#nicknameInput");
		
		if(nicknameInput.classList.contains("is-valid") === true){
			const result = await dbActions.isDuplicatedNickname(nicknameInput.value);
			console.log(result);

			if(result !== null){
				nicknameInput.classList.remove("is-valid");
				nicknameInput.classList.add("is-invalid");
				nicknameCheck.value = false;
				alert("sorry, you can not use this nickname");
				setNicknameDuplicated(1);
				return false;
			}
			else{
				nicknameInput.classList.add("is-valid");
				nicknameInput.classList.remove("is-invalid");
				nicknameCheck.value = true;
				alert("good, you can use this nickname");
				setNicknameDuplicated(2);
				return true;
			}
		}
		else{
			alert("please write your nickname");
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
			<div style={{ marginTop: "30px" }}>
				<div style={{ marginBottom: "30px" }}>
					<h3>Welcome To here</h3>
				</div>
				<Form noValidate onSubmit={handleSubmit}>
					<input type="hidden" id="idCheck" name="idCheck" value={false}></input>
					<input type="hidden" id="nicknameCheck" name="nicknameCheck" value={false}></input>
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