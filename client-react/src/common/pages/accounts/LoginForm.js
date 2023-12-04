import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import LoadingModal from '../common/LoadingModal.js';

import * as accountsFetch from '../../js/accountsFetch.js'

const LoginForm = () => {
	const [showLoadingModal, setShowLoadingModal] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;

		if(form.idInput.value === ""){
			alert("아이디(ID)을 확인해주세요");
			form.idInput.focus();
			return false;
		}
		if(form.passwordInput.value === ""){
			alert("비밀번호 (Password)를 확인해주세요");
			form.passwordInput.focus();
			return false;
		}

		setShowLoadingModal(true);
		setLoadingMessage("로그인 처리 중...");
		// await asyncWaiter(1);
		setShowLoadingModal(false);

		const loginResult = await accountsFetch.loginAccount({
			id: form.idInput.value,
			password: form.passwordInput.value,
		});

		if(loginResult === "success"){
			navigate("/");
		}
		else if(loginResult === "fail"){
			alert("아이디나 비밀번호가 올바르지 않습니다");
		}
		else if(loginResult === "fail_limit"){
			alert("아이디나 비밀번호가 올바르지 않습니다\n\n한번 더 실패할 경우 해당 계정은 잠금 처리됩니다");
		}
		else if(loginResult === "locked"){
			if(window.confirm("지속된 로그인 실패로 계정이 잠금상태가 되었습니다\n\n해당 계정의 비밀번호를 잊으셨나요?") === true){
				navigate("/accounts/find/password");
			}
		}
		else if(loginResult === "sleep"){
			alert("계정이 휴면상태입니다");
		}
		else if(loginResult === "already"){
			alert("누군가 이미 로그인하였습니다");
		}
		else{
			alert("로그인에 실패하였습니다");
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
		<Container style={{ maxWidth: "450px" }}>
			<LoadingModal showModal={showLoadingModal} message={loadingMessage}></LoadingModal>

			<div style={{ marginTop: "30px" }}>
				<Form noValidate onSubmit={handleSubmit}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							아이디 (ID)
						</Form.Label>
						<InputGroup>
							<Form.Control id="idInput" maxLength={20} type="text" placeholder="아이디를 입력해주세요" style={{fontSize: "0.9rem"}} />
						</InputGroup>
					</Form.Group>

					<Form.Group as={Row} className="mb-3">
						<Form.Label style={{fontWeight: "800", fontSize: "0.8rem"}}>
							비밀번호 (Password)
						</Form.Label>
						<InputGroup>
							<Form.Control id="passwordInput" autoComplete="off" maxLength={20} type="password" placeholder="비밀번호를 입력해주세요" style={{fontSize: "0.9rem"}} />
						</InputGroup>
						{/* <Form.Text muted style={{fontSize: "0.72rem"}}>
							계정이 <span style={{color: "orangered", fontWeight: "600"}}>잠금 상태</span>가 되면 아래의 <span style={{color: "#0d6efd", fontWeight: "600"}}>비밀번호 찾기</span>를 이용해주세요
						</Form.Text> */}
					</Form.Group>

					<Button type="submit" variant="success" size="lg" style={{ width: "100%", marginTop: "10px", fontSize: "1.1rem", fontWeight: 800 }}>로그인</Button>
				</Form>

				<div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "15px" }}>
					<Button onClick={() => { navigate("/accounts/register"); }} variant="link" style={{ fontSize: "0.75rem", textDecoration: "none", color: "gray" }}>회원가입</Button>
					
					<div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
						{/* <Button variant="link" style={{ fontSize: "0.75rem", textDecoration: "none", color: "gray" }}>계정 찾기</Button>
						<span style={{ fontSize: "0.65rem", color: "gray" }}>|</span> */}
						<Button onClick={() => { navigate("/accounts/find/password"); }} variant="link" style={{ fontSize: "0.75rem", textDecoration: "none", color: "gray" }}>비밀번호 찾기</Button>
					</div>
				</div>
			</div>
		</Container>
	);
}

export default LoginForm;