import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import LoadingModal from '../common/LoadingModal.js';

import * as accountsFetch from '../../js/accountsFetch.js'

const NicknameRenewForm = () => {
	const [showLoadingModal, setShowLoadingModal] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const navigate = useNavigate();

	const renewNickname = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;

		if(form.nicknameInput.value === ""){
			alert("새로운 닉네임을 입력해주세요");
			form.nicknameInput.focus();
			return false;
		}

		if(form.passwordInput.value === ""){
			alert("현재 비밀번호를 입력해주세요");
			form.passwordInput.focus();
			return false;
		}

		if(window.confirm("닉네임 변경을 진행하시겠습니까?")){
			setShowLoadingModal(true);
			setLoadingMessage("닉네임를 변경 중입니다...");
			await asyncWaiter(1);
			setShowLoadingModal(false);

			const updateResult = await accountsFetch.renewNickname({
				nickname: form.nicknameInput.value,
				password: form.passwordInput.value,
			});
			
			if(updateResult === true){
				alert("닉네임이 변경되었습니다");

				navigate("/accounts/mypage");
			}
			else if(updateResult === false){
				alert("닉네임을 변경할 수 없습니다");

				form.passwordInput.value = "";
			}
		}
	};

	/**
	 * 과도한 호출을 방지하기위한 대기
	 * @param {number} second 대기할 초
	 * @returns 없음
	 */
	const asyncWaiter = async (second) => {
		return new Promise((prom) => setTimeout(prom, second * 1000));
	}

	return (
		<Container style={{maxWidth: "600px"}}>
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
							/>
							<Form.Text muted style={{fontSize: "0.8rem"}}>
								<div style={{display: "flex", alignItems: "center", marginTop: "5px"}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
									<span style={{marginLeft: "8px"}}>닉네임은 1~20글자 제한이며 특수문자와 띄어쓰기는 사용 불가능합니다</span>
								</div>
							</Form.Text>
						</Col>
					</Form.Group>
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

					<Button type="submit" variant="success" size="lg" style={{width: "100%", marginTop: "20px"}}>변경하기</Button>
				</Form>
			</div>
		</Container>
	);
}

export default NicknameRenewForm;