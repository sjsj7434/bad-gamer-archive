import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import * as accountFetch from '../../js/accountFetch.js'
import LoadingModal from '../common/LoadingModal.js';

const RegisterForm = () => {
	const [idValid, setIdValid] = useState(0);
	const [nicknameValid, setNicknameValid] = useState(0);
	const [emailValid, setEmailValid] = useState(0);
	const [passwordValid, setPasswordValid] = useState(0);
	const [rePasswordValid, setRePasswordValid] = useState(0);
	const [showLoadingModal, setShowLoadingModal] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
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
		else if(nicknameValid !== 2){
			alert("닉네임을 확인해주세요");
			form.nicknameInput.focus();
			return false;
		}
		else if(emailValid !== 2){
			alert("이메일을 확인해주세요");
			form.emailInput.focus();
			return false;
		}
		else if(passwordValid !== 2){
			alert("비밀번호를 확인해주세요");
			form.passwordInput.focus();
			return false;
		}
		else if(rePasswordValid !== 2){
			alert("다시 입력한 비밀번호를 확인해주세요");
			form.rePasswordInput.focus();
			return false;
		}

		if(window.confirm("회원가입을 진행하시겠습니까?")){
			setShowLoadingModal(true);
			setLoadingMessage("회원가입을 진행 중입니다...");
			await asyncWaiter(1);
			setShowLoadingModal(false);

			const createResult = await accountFetch.createAccount({
				id: form.idInput.value,
				nickname: form.nicknameInput.value,
				email: form.emailInput.value,
				password: form.passwordInput.value,
			});

			if(createResult === 4){
				alert("환영합니다!\n로그인 페이지로 이동합니다");
				navigate("/account/login");
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
			else if(createResult === 3 || createResult === 5){
				alert("회원가입 처리 중 오류가 발생하였습니다");
			}
		}
	};
	
	const isValidID = () => {
		const idRegex = /^[a-zA-Z0-9]{4,20}$/;
		const idInput = document.querySelector("#idInput");

		if(idInput.value.replace(idRegex, "") === "" && (4 <= idInput.value.length && idInput.value.length <= 20)){
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
		const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.<>`~/?;:'"]).{8,20}$/;

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
		<Container style={{maxWidth: "450px"}}>
			<LoadingModal showModal={showLoadingModal} message={loadingMessage}></LoadingModal>

			<div style={{ marginTop: "50px" }}>
				<Form noValidate onSubmit={createAccount}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							아이디 (ID)
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(idValid)} id="idInput" maxLength={20} type="id" placeholder="아이디를 입력해주세요" onChange={() => {isValidID()}} autoComplete="off" style={{fontSize: "0.9rem"}} />
							{/* <Form.Text muted style={{fontSize: "0.72rem"}}>
								로그인할 때 사용할 아이디를 적어주세요
							</Form.Text> */}
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
							<Form.Control className={statusParser(nicknameValid)} id="nicknameInput" maxLength={20} type="text" placeholder="닉네임을 입력해주세요 (1~20자)" onChange={() => {isValidNickname()}} autoComplete="off" style={{fontSize: "0.9rem"}} />
							{/* <Form.Text muted style={{fontSize: "0.72rem"}}>
								닉네임은 1~20글자 제한이며 특수문자와 띄어쓰기는 사용 불가능합니다
							</Form.Text> */}
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
							<Form.Control className={statusParser(emailValid)} id="emailInput" maxLength={20} type="text" placeholder="이메일을 입력해주세요" onChange={() => {isValidEmail()}} autoComplete="off" style={{fontSize: "0.9rem"}} />
							{/* <Form.Text muted style={{fontSize: "0.72rem"}}>
								비밀번호를 찾을 때 사용됩니다
							</Form.Text> */}
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
							<Form.Control className={statusParser(passwordValid)} id="passwordInput" autoComplete="off" maxLength={20} type="password" placeholder="비밀번호를 입력해주세요 (8~20자)" onChange={() => {isValidPassword()}} style={{fontSize: "0.9rem"}} />
							{/* <Form.Text muted style={{fontSize: "0.72rem"}}>
								알파벳 대문자와 소문자, 숫자, 특수문자를 조합하여 8~20자로 생성해주세요
							</Form.Text> */}
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
									<span style={{marginLeft: "8px"}}>강력하지 않은 비밀번호입니다</span>
								</div>
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							비밀번호 확인 (Password Check)
						</Form.Label>
						<Col>
							<Form.Control className={statusParser(rePasswordValid)} id="rePasswordInput" autoComplete="off" maxLength={20} type="password" placeholder="비밀번호를 한번 더 입력해주세요" onChange={() => {checkRePassword()}} style={{fontSize: "0.9rem"}} />
							{/* <Form.Text muted style={{fontSize: "0.72rem"}}>
								확인을 위해 비밀번호를 한번 더 입력해주세요
							</Form.Text> */}
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
									<span style={{marginLeft: "8px"}}>비밀번호가 일치하지 않습니다</span>
								</div>
							</Form.Control.Feedback>
						</Col>
					</Form.Group>

					<Button type="submit" variant="success" size="lg" style={{ width: "100%", marginTop: "10px", marginBottom: "200px", fontSize: "1.1rem", fontWeight: 800 }}>가입하기</Button>
					{/* <span style={{fontSize: "0.75rem"}}>
						사용자의 비밀번호는 <strong>단방향 암호화</strong> 되어 보관됩니다
						<br />
						관리자가 사용자의 비밀번호를 알아낼 수 없습니다
					</span> */}
				</Form>
			</div>
		</Container>
	);
}

export default RegisterForm;