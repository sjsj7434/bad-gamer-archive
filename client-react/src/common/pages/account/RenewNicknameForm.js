import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import LoadingModal from '../common/LoadingModal.js';

import * as accountFetch from '../../js/accountFetch.js'

const RenewNicknameForm = () => {
	const [nicknameValid, setNicknameValid] = useState(0);
	const [showLoadingModal, setShowLoadingModal] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const navigate = useNavigate();

	const renewNickname = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;

		if(form.passwordInput.value === ""){
			alert("현재 비밀번호를 입력해주세요");
			form.passwordInput.focus();
			return false;
		}
		else if(form.nicknameInput.value === ""){
			alert("새로운 닉네임을 입력해주세요");
			form.nicknameInput.focus();
			return false;
		}

		if(nicknameValid !== 2){
			alert("사용할 수 없는 닉네임입니다");
			return;
		}

		if(window.confirm("닉네임 변경을 진행하시겠습니까?")){
			setShowLoadingModal(true);
			setLoadingMessage("닉네임를 변경 중입니다...");
			await asyncWaiter(1);
			setShowLoadingModal(false);

			const updateResult = await accountFetch.renewNickname({
				nickname: form.nicknameInput.value,
				password: form.passwordInput.value,
			});
			
			if(updateResult === true){
				alert("닉네임이 변경되었습니다");
				navigate("/account/mypage");
			}
			else if(updateResult === false){
				alert("닉네임을 변경할 수 없습니다\n비밀번호를 다시 확인해주세요");
				form.passwordInput.value = "";
			}
		}
	};

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

	/**
	 * 과도한 호출을 방지하기위한 대기
	 * @param {number} second 대기할 초
	 * @returns 없음
	 */
	const asyncWaiter = async (second) => {
		return new Promise((prom) => setTimeout(prom, second * 1000));
	}

	return (
		<Container style={{maxWidth: "450px"}}>
			<LoadingModal showModal={showLoadingModal} message={loadingMessage}></LoadingModal>

			<div style={{ marginTop: "30px" }}>
				<div style={{ display: "flex", alignItems: "center", marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid lightgray" }}>
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="gray" className="bi bi-file-person-fill" viewBox="0 0 16 16">
						<path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm-1 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-3 4c2.623 0 4.146.826 5 1.755V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1.245C3.854 11.825 5.377 11 8 11z"/>
					</svg>
					<span style={{fontSize: "1.2rem", marginLeft: "12px"}}>닉네임 변경</span>
				</div>
				<Form noValidate onSubmit={renewNickname}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							비밀번호 (Password)
						</Form.Label>
						<Col>
							<Form.Control
								id="passwordInput"
								maxLength={20}
								type="password"
								placeholder="비밀번호를 입력해주세요"
								autoComplete="off"
								style={{fontSize: "0.9rem"}}
							/>
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>닉네임을 변경하려면 비밀번호를 입력해주세요</span>
								</div>
							</Form.Text>
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							닉네임 (Nickname)
						</Form.Label>
						<Col>
							<Form.Control
								id="nicknameInput"
								maxLength={20}
								type="text"
								placeholder="새로운 닉네임을 입력해주세요"
								style={{fontSize: "0.9rem"}}
								autoComplete="off"
								className={statusParser(nicknameValid)}
								onChange={() => {isValidNickname()}}
							/>
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>닉네임은 1~20글자이며 특수문자와 띄어쓰기는 불가능합니다</span>
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

					<Button type="submit" variant="success" size="lg" style={{width: "100%", marginTop: "20px", fontSize: "0.9rem"}}>변경하기</Button>
				</Form>
			</div>
		</Container>
	);
}

export default RenewNicknameForm;