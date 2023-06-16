import { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import * as accountsFetch from '../../../common/js/accountsFetch.js'

const SignInForm = (props) => {
	const [idValid, setIdValid] = useState(0);
	const [passwordValid, setPasswordValid] = useState(0);
	const [waitModalShow, setWaitModalShow] = useState(false);
	const [waitModalMessage, setWaitModalMessage] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;

		if(idValid !== 2){
			alert("아이디 (ID)를 확인해주세요");
			form.idInput.focus();
			return false;
		}
		if(passwordValid !== 2){
			alert("비밀번호 (Password)를 확인해주세요");
			form.passwordInput.focus();
			return false;
		}

		setWaitModalShow(true);
		setWaitModalMessage("로그인 처리 중...");
		// await asyncWaiter(1);
		setWaitModalShow(false);

		const signInResult = await accountsFetch.signInAccount({
			id: form.idInput.value,
			password: form.passwordInput.value,
		});

		if(signInResult === "success"){
			props.checkSignInStatus();
			navigate("/");
		}
		else if(signInResult === "fail"){
			alert("로그인이 실패하였습니다");
		}
		else if(signInResult === "locked"){
			alert("해당 계정은 잠금상태입니다");
		}
		else if(signInResult === "wrong_cookie"){
			alert("로그인 정보가 올바르지 않습니다");
		}
		else if(signInResult === "same_user"){
			alert("누군가 이미 로그인하였습니다");
		}
	};

	const isValidID = () => {
		const idInput = document.querySelector("#idInput");
		const idRegExp = new RegExp("[a-z0-9]", "g");

		idInput.value = idInput.value.toLowerCase();

		if(idInput.value.replace(idRegExp, "") === "" && (4 <= idInput.value.length && idInput.value.length <= 20)){
			setIdValid(2);
		}
		else{
			setIdValid(1);
		}
	}

	const isValidPassword = () => {
		const passwordInput = document.querySelector("#passwordInput");
		const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

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
	// const asyncWaiter = async (second) => {
	// 	return new Promise((prom) => setTimeout(prom, second * 1000));
	// }

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

	if(props.accountData.status === "using"){
		return (
			<Navigate to="/" />
		);
	}
	else{
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

				<div style={{ marginTop: "60px" }}>
					<Form noValidate onSubmit={handleSubmit}>
						<Form.Group as={Row} className="mb-3">
							<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
								아이디 (ID)
							</Form.Label>
							<Col>
								<InputGroup>
									<Form.Control className={statusParser(idValid)} id="idInput" maxLength={20} type="text" placeholder="아이디를 입력해주세요" isValid={false} isInvalid={false} onChange={() => {isValidID()}} autoComplete="off" style={{fontSize: "0.9rem"}} />
								</InputGroup>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3">
							<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
								비밀번호 (Password)
							</Form.Label>
							<Col>
								<Form.Control className={statusParser(passwordValid)} id="passwordInput" maxLength={20} type="password" placeholder="비밀번호를 입력해주세요" onChange={() => {isValidPassword()}} style={{fontSize: "0.9rem"}} />
							</Col>
						</Form.Group>

						<Button type="submit" variant="success" size="lg" style={{width: "100%", marginTop: "16px"}}>로그인</Button>
					</Form>
				</div>
			</Container>
		);
	}
}

export default SignInForm;