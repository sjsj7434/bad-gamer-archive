import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import LoadingModal from '../common/LoadingModal.js';

import * as accountsFetch from '../../js/accountFetch.js'

const ForgotPasswordForm = (props) => {
	const [showLoadingModal, setShowLoadingModal] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;

		if(form.idInput.value === ""){
			alert("아이디 (ID)를 확인해주세요");
			form.idInput.focus();
			return false;
		}

		setShowLoadingModal(true);
		setLoadingMessage("이메일 발송 처리 중...");
		// await asyncWaiter(1);
		setShowLoadingModal(false);

		const loginResult = await accountsFetch.requestPasswordReset({
			id: form.idInput.value,
		});

		if(loginResult === "email_sent"){
			alert("비밀번호 초기화를 위한 이메일이 발송되었습니다");
			navigate("/");
		}
		else if(loginResult === "no_user"){
			alert("이메일을 발송할 수 없습니다");
		}
	};

	/**
	 * 과도한 호출을 방지하기위한 대기
	 * @param {number} second 대기할 초
	 * @returns 없음
	 */
	// const asyncWaiter = async (second) => {
	// 	return new Promise((prom) => setTimeout(prom, second * 1000));
	// }

	return (
		<Container style={{maxWidth: "450px"}}>
			<LoadingModal showModal={showLoadingModal} message={loadingMessage}></LoadingModal>

			<div style={{ marginTop: "50px" }}>
				<div style={{ display: "flex", alignItems: "center", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid lightgray" }}>
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
						<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
					</svg>
					<span style={{fontSize: "0.8rem", marginLeft: "12px"}}>비밀번호를 잊으셨나요?</span>
				</div>
				<Form noValidate onSubmit={handleSubmit}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							아이디 (ID)
						</Form.Label>
						<InputGroup>
							<Form.Control id="idInput" maxLength={20} type="text" placeholder="아이디를 입력해주세요" style={{fontSize: "0.9rem"}} />
						</InputGroup>
						<Form.Text muted style={{fontSize: "0.72rem"}}>
							가입하신 계정의 이메일로 메일이 발송됩니다
							<br /><br />
							아이디 없으면 없다고 알림창 / 해당 메일의 링크를 클릭하면 해당 계정 비밀번호 변경하는 페이지로 이동
						</Form.Text>
					</Form.Group>

					<Button type="submit" variant="success" size="lg" style={{ width: "100%", marginTop: "10px", fontSize: "1.1rem", fontWeight: 800 }}>메일 보내기</Button>
				</Form>

				<div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: "200px", marginTop: "15px" }}>
					<Button onClick={() => { navigate("/account/login"); }} variant="link" style={{ fontSize: "0.75rem", textDecoration: "none", color: "gray" }}>이미 계정이 있으신가요?</Button>
				</div>
			</div>
		</Container>
	);
}

export default ForgotPasswordForm;