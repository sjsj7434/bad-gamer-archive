import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import LoadingModal from '../common/LoadingModal.js';

import * as accountsFetch from '../../js/accountsFetch.js'

const PasswordRenewForm = (props) => {
	const [passwordValid, setPasswordValid] = useState(0);
	const [rePasswordValid, setRePasswordValid] = useState(0);
	const [showLoadingModal, setShowLoadingModal] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const navigate = useNavigate();

	const renewPassword = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;

		if(form.oldPasswordInput.value === ""){
			alert("현재 비밀번호를 확인해주세요");
			form.oldPasswordInput.focus();
			return false;
		}
		if(passwordValid !== 2){
			alert("새 비밀번호를 확인해주세요");
			form.newPasswordInput.focus();
			return false;
		}
		if(rePasswordValid !== 2){
			alert("다시 입력한 새 비밀번호를 확인해주세요");
			form.reNewPasswordInput.focus();
			return false;
		}
		if(form.oldPasswordInput.value === form.newPasswordInput.value){
			alert("동일한 비밀번호는 사용할 수 없습니다");
			form.newPasswordInput.focus();
			return false;
		}

		if(window.confirm("비밀번호 변경을 진행하시겠습니까?")){
			setShowLoadingModal(true);
			setLoadingMessage("비밀번호를 변경 중입니다...");
			await asyncWaiter(1);
			setShowLoadingModal(false);

			const updateResult = await accountsFetch.renewPassword({
				oldPassword: form.oldPasswordInput.value,
				newPassword: form.newPasswordInput.value,
			});
			
			if(updateResult === 0){
				alert("똑같은 비밀번호로 변경할 수 없습니다");

				form.newPasswordInput.value = "";
				form.reNewPasswordInput.value = "";
			}
			else if(updateResult === 1){
				alert("비밀번호가 변경되었습니다\n비밀번호가 변경되었으니 다시 로그인해주세요");

				await props.checkSignInStatus();

				navigate("/accounts/signin");
			}
			else if(updateResult === 2){
				alert("입력하신 현재 비밀번호가 올바르지 않습니다");

				form.oldPasswordInput.value = "";
			}
			else if(updateResult === 3){
				alert("오류가 발생하여 비밀번호를 변경할 수 없습니다");

				form.newPasswordInput.value = "";
				form.reNewPasswordInput.value = "";
			}
		}
	};

	const isValidPassword = () => {
		const newPasswordInput = document.querySelector("#newPasswordInput");
		const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.<>`~/?;:'"]).{8,20}$/;

		if(passwordRegExp.test(newPasswordInput.value) === true){
			setPasswordValid(2);
		}
		else{
			setPasswordValid(1);
		}

		checkRePassword();
	}

	const checkRePassword = () => {
		const newPasswordInput = document.querySelector("#newPasswordInput");
		const reNewPasswordInput = document.querySelector("#reNewPasswordInput");

		if(newPasswordInput.value === reNewPasswordInput.value && newPasswordInput.classList.contains("is-valid")){
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

			<div style={{ marginTop: "30px" }}>
				<div style={{ display: "flex", alignItems: "center", marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid lightgray" }}>
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="gray" className="bi bi-file-lock2" viewBox="0 0 16 16">
						<path d="M8 5a1 1 0 0 1 1 1v1H7V6a1 1 0 0 1 1-1zm2 2.076V6a2 2 0 1 0-4 0v1.076c-.54.166-1 .597-1 1.224v2.4c0 .816.781 1.3 1.5 1.3h3c.719 0 1.5-.484 1.5-1.3V8.3c0-.627-.46-1.058-1-1.224z"/>
						<path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
					</svg>
					<span style={{fontSize: "1.2rem", marginLeft: "12px"}}>비밀번호 변경</span>
				</div>
				<Form noValidate onSubmit={renewPassword}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							현재 비밀번호 (Password)
						</Form.Label>
						<Col>
							<Form.Control
								id="oldPasswordInput"
								maxLength={20}
								type="password"
								placeholder="비밀번호를 입력해주세요"
								style={{fontSize: "0.9rem"}}
							/>
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>새 비밀번호를 설정하려면 현재 비밀번호를 입력해주세요</span>
								</div>
							</Form.Text>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							새 비밀번호 (New password)
						</Form.Label>
						<Col>
							<Form.Control
								className={statusParser(passwordValid)}
								id="newPasswordInput"
								maxLength={20}
								type="password"
								placeholder="비밀번호를 입력해주세요"
								onChange={() => {isValidPassword()}} style={{fontSize: "0.9rem"}}
							/>
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
							비밀번호 확인 (New password check)
						</Form.Label>
						<Col>
							<Form.Control 
								className={statusParser(rePasswordValid)}
								id="reNewPasswordInput"
								maxLength={20}
								type="password"
								placeholder="비밀번호를 한번 더 입력해주세요"
								onChange={() => {checkRePassword()}} style={{fontSize: "0.9rem"}}
							/>
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>확인을 위해 새 비밀번호를 한번 더 입력해주세요</span>
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

					<Button type="submit" variant="success" size="lg" style={{width: "100%", marginTop: "20px", fontSize: "0.9rem"}}>변경하기</Button>
				</Form>
			</div>
		</Container>
	);
}

export default PasswordRenewForm;