import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import * as accountsFetch from '../../js/accountsFetch.js'

const SignUpForm = () => {
	const [idValid, setIdValid] = useState(0);
	const [nicknameValid, setNicknameValid] = useState(0);
	const [emailValid, setEmailValid] = useState(0);
	const [passwordValid, setPasswordValid] = useState(0);
	const [rePasswordValid, setRePasswordValid] = useState(0);
	const [waitModalShow, setWaitModalShow] = useState(false);
	const [waitModalMessage, setWaitModalMessage] = useState("");
	const navigate = useNavigate();

	const createAccount = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;

		if(idValid !== 2){
			alert("아이디를 확인해주세요");
			form.idInput.focus();
			return false;
		}
		if(nicknameValid !== 2){
			alert("닉네임을 확인해주세요");
			form.nicknameInput.focus();
			return false;
		}
		if(emailValid !== 2){
			alert("이메일을 확인해주세요");
			form.emailInput.focus();
			return false;
		}
		if(passwordValid !== 2){
			alert("비밀번호를 확인해주세요");
			form.passwordInput.focus();
			return false;
		}
		if(rePasswordValid !== 2){
			alert("다시 입력한 비밀번호를 확인해주세요");
			form.rePasswordInput.focus();
			return false;
		}

		if(window.confirm("회원가입을 진행하시겠습니까?")){
			setWaitModalShow(true);
			setWaitModalMessage("회원가입을 진행 중입니다...");
			await asyncWaiter(1);
			setWaitModalShow(false);

			const createResult = await accountsFetch.createAccount({
				id: form.idInput.value,
				nickname: form.nicknameInput.value,
				email: form.emailInput.value,
				password: form.passwordInput.value,
			});

			if(createResult === 4){
				alert("환영합니다!\n로그인 페이지로 이동합니다");
				navigate("/accounts/signin");
			}
			else if(createResult === 0){
				alert("이미 사용 중인 아이디와 닉네임입니다");

				setIdValid(1);
				form.idInput.value = "";

				setNicknameValid(1);
				form.nicknameInput.value = "";
			}
			else if(createResult === 1){
				alert("이미 사용 중인 아이디입니다");

				setIdValid(1);
				form.idInput.value = "";
			}
			else if(createResult === 2){
				alert("이미 사용 중인 닉네임입니다");

				setNicknameValid(1);
				form.nicknameInput.value = "";
			}
			else if(createResult === 3){
				alert("회원가입 처리 중 오류가 발생하였습니다");
			}
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

	const isValidNickname = () => {
		const nicknameInput = document.querySelector("#nicknameInput");
		const nicknameRegExp = new RegExp("[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]", "g");

		if(nicknameInput.value.replace(nicknameRegExp, "") === "" && (1 <= nicknameInput.value.length && nicknameInput.value.length <= 20)){
			setNicknameValid(2);
		}
		else{
			setNicknameValid(1);
		}
	}

	const isValidEmail = () => {
		const emailInput = document.querySelector("#emailInput");
		// const emailRegExp = new RegExp("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$", "i");
		const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

		if(emailRegExp.test(emailInput.value) === true){
			setEmailValid(2);
		}
		else{
			setEmailValid(1);
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
					<h2>회원가입</h2>
				</div>
				<Form noValidate onSubmit={createAccount}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							아이디 (ID)
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(idValid)} id="idInput" maxLength={20} type="text" placeholder="아이디를 입력해주세요" isValid={false} isInvalid={false} onChange={() => {isValidID()}} autoComplete="off" style={{fontSize: "0.9rem"}} />
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>아이디는 4~20글자 제한이며 숫자와 알파벳만 사용 가능합니다</span>
								</div>
							</Form.Text>
							<Form.Control.Feedback type="valid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>올바른 아이디입니다</span>
								</div>
							</Form.Control.Feedback>
							<Form.Control.Feedback type="invalid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>올바른 아이디가 아닙니다</span>
								</div>
							</Form.Control.Feedback>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							닉네임 (Nickname)
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(nicknameValid)} id="nicknameInput" maxLength={20} type="text" placeholder="닉네임을 입력해주세요" onChange={() => {isValidNickname()}} autoComplete="off" style={{fontSize: "0.9rem"}} />
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>닉네임은 1~20글자 제한이며 특수문자와 띄어쓰기는 사용 불가능합니다</span>
								</div>
							</Form.Text>
							<Form.Control.Feedback type="valid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>올바른 닉네임입니다</span>
								</div>
							</Form.Control.Feedback>
							<Form.Control.Feedback type="invalid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>올바른 닉네임이 아닙니다</span>
								</div>
							</Form.Control.Feedback>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							이메일 (Email)
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(emailValid)} id="emailInput" maxLength={50} type="email" placeholder="이메일을 입력해주세요" onChange={() => {isValidEmail()}} autoComplete="off" style={{fontSize: "0.9rem"}} />
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>이메일은 비밀번호 찾기에 이용됩니다</span>
								</div>
							</Form.Text>
							<Form.Control.Feedback type="valid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>올바른 이메일입니다</span>
								</div>
							</Form.Control.Feedback>
							<Form.Control.Feedback type="invalid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>올바른 이메일이 아닙니다</span>
								</div>
							</Form.Control.Feedback>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							비밀번호 (Password)
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(passwordValid)} id="passwordInput" maxLength={20} type="password" placeholder="비밀번호를 입력해주세요" onChange={() => {isValidPassword()}} style={{fontSize: "0.9rem"}} />
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>비밀번호는 8~20글자 제한이며 알파벳 대문자와 소문자, 숫자, 특수문자를 조합해주세요</span>
								</div>
							</Form.Text>
							<Form.Control.Feedback type="valid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>강력한 비밀번호입니다</span>
								</div>
							</Form.Control.Feedback>
							<Form.Control.Feedback type="invalid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>강력하지 못한 비밀번호입니다</span>
								</div>
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							비밀번호 확인 (Password Check)
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(rePasswordValid)} id="rePasswordInput" maxLength={20} type="password" placeholder="비밀번호를 한번 더 입력해주세요" onChange={() => {checkRePassword()}} style={{fontSize: "0.9rem"}} />
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>확인을 위해 비밀번호를 한번 더 입력해주세요</span>
								</div>
							</Form.Text>
							<Form.Control.Feedback type="valid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>비밀번호가 일치합니다</span>
								</div>
							</Form.Control.Feedback>
							<Form.Control.Feedback type="invalid" style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>비밀번호가 일치하지 않거나 강력하지 않은 비밀번호입니다</span>
								</div>
							</Form.Control.Feedback>
						</Col>
					</Form.Group>

					<Button type="submit" variant="success" size="lg" style={{width: "100%", marginTop: "20px"}}>가입하기</Button>
				</Form>
			</div>
		</Container>
	);
}

export default SignUpForm;