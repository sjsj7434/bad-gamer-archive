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

import * as accountsAction from '../../../common/js/accountsAction.js'

const SignInForm = (props) => {
	const [idValid, setIdValid] = useState(0);
	const [passwordValid, setPasswordValid] = useState(0);
	const [waitModalShow, setWaitModalShow] = useState(false);
	const [waitModalMessage, setWaitModalMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		console.log("SignInForm", props.accountData);

		if(props.accountData.status === "using"){
			alert("already login!");
			navigate("/");
		}
	}, [props]); //처음 페이지 로딩 될때만

	const handleSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;

		if(idValid !== 2){
			alert("Please check your ID");
			form.idInput.focus();
			return false;
		}
		if(passwordValid !== 2){
			alert("Please check your Password");
			form.passwordInput.focus();
			return false;
		}

		setWaitModalShow(true);
		setWaitModalMessage("Sign In...");
		// await asyncWaiter(1);
		setWaitModalShow(false);

		const signInResult = await accountsAction.signInAccount({
			id: form.idInput.value,
			password: form.passwordInput.value,
		});

		if(signInResult === "success"){
			props.renewLogin();
			navigate("/");
		}
		else if(signInResult === "fail"){
			alert("login failed");
		}
		else if(signInResult === "locked"){
			alert("account is locked");
		}
		else if(signInResult === "wrong_cookie"){
			alert("login failed");
		}
		else if(signInResult === "same_user"){
			alert("login failed");
		}
	};

	const isValidID = () => {
		const idInput = document.querySelector("#idInput");
		const idRegExp = new RegExp("[a-z0-9]", "g");

		idInput.value = idInput.value.toLowerCase();

		if(idInput.value.replace(idRegExp, "") === "" && (5 <= idInput.value.length && idInput.value.length <= 20)){
			setIdValid(2);
		}
		else{
			setIdValid(1);
		}
	}

	const isValidPassword = () => {
		const passwordInput = document.querySelector("#passwordInput");
		const passwordRegExp = new RegExp("^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$");

		if(passwordRegExp.test(passwordInput.value) === true){
			setPasswordValid(2);
		}
		else{
			setPasswordValid(1);
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
					<h2>Sign In</h2>
				</div>
				<Form noValidate onSubmit={handleSubmit}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							ID
						</Form.Label>
						<Col>
							<InputGroup>
								<Form.Control className={statusParser(idValid)} id="idInput" maxLength={20} type="text" placeholder="ID" isValid={false} isInvalid={false} onChange={() => {isValidID()}} autoComplete="off" />
							</InputGroup>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800"}}>
							Password
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(passwordValid)} id="passwordInput" maxLength={20} type="password" placeholder="password" onChange={() => {isValidPassword()}} />
						</Col>
					</Form.Group>

					<br/>
					<Button type="submit" variant="success" size="lg" style={{width: "100%"}}>Sign In</Button>
				</Form>
			</div>
		</Container>
	);
}

export default SignInForm;