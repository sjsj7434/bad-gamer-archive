import { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";

import * as accountsFetch from '../../js/accountFetch.js'
import LoadingModal from '../common/LoadingModal.js';
import '../../css/MyPage.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const MyBlacklist = () => {
	const BLACK_REASON_MAX_LEN = 200; //블랙 사유 최대 길이

	const [accountData, setAccountData] = useState(null);
	const [renderData, setRenderData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [myBlackList, setMyBlackList] = useState(null);
	const [blackCount, setBlackCount] = useState(0);

	const navigate = useNavigate();

	const callMyInfo = useCallback(async () => {
		const deleteBlackList = async (blackCode) => {
			if(window.confirm("해당 사용자를 차단 해제하시겠습니까?") === false){
				return;
			}

			setIsLoading(true);
			setLoadingMessage("차단을 해제하고 있습니다");

			const sendData = {
				code: blackCode,
			};
			
			const result = await accountsFetch.deleteMyBlacklist(sendData);

			if(result === "true"){
				callMyInfo();
			}
			else{
				alert("차단을 해제할 수 없습니다");
			}

			setIsLoading(false);
		}

		const updateBlackList = async (blackCode) => {
			const blackReasonElement = document.querySelector(`#blackReason${blackCode}`);

			if(blackReasonElement.value.length > BLACK_REASON_MAX_LEN){
				alert(`${BLACK_REASON_MAX_LEN}자가 넘으면`);
				return;
			}

			if(window.confirm("차단 정보를 수정하시겠습니까?") === false){
				return;
			}

			setIsLoading(true);
			setLoadingMessage("차단 정보를 수정하고 있습니다");

			const sendData = {
				code: blackCode,
				blackReason: blackReasonElement.value,
			};

			const result = await accountsFetch.updateMyBlacklist(sendData);
			
			if(result === "false"){
				alert("차단 정보를 수정할 수 없습니다");
			}

			setIsLoading(false);
		}

		setIsLoading(true);

		const myInfo = await accountsFetch.getMyInfo();
		const blacklist = await accountsFetch.getMyBlacklist();

		if(myInfo === null){
			navigate("/");
			return;
		}

		if(blacklist === null){
			navigate("/");
			return;
		}

		setBlackCount(blacklist.length);

		const blackRender = [];
		blackRender.push(blacklist.map((element) => {
			return(
				<Form key={`blackUser${element.code}`} style={{ fontSize: "0.9rem", marginTop: "2.5rem" }}>
					<Form.Group className="mb-3" controlId={`blackReason${element.code}`}>
						<Form.Label style={{ width: "100%" }}>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
								<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between" }}>
									<Button variant="link" style={{ fontSize: "0.8rem", padding: "2px" }}>{element.blackNickname}</Button>
									<Button variant="link" style={{ fontSize: "0.8rem", textDecoration: "none", padding: "2px", color: "gray" }}>{element.createdAt.substring(0, 10)}</Button>
								</div>
								<div>
									<Button onClick={ () => {deleteBlackList(element.code)} } className="smallButton" variant="danger">해제</Button>
									&nbsp;
									<Button onClick={ () => {updateBlackList(element.code)} } className="smallButton" variant="success">수정</Button>
								</div>
							</div>
						</Form.Label>
						<Form.Control style={{ fontSize: "0.8rem" }} as="textarea" rows={3} maxLength={200} defaultValue={element.blackReason} />
					</Form.Group>
				</Form>
			);
		}))

		setAccountData(myInfo);
		setMyBlackList(blackRender);

		setIsLoading(false);
	}, [navigate])

	useEffect(() => {
		callMyInfo();
	}, [callMyInfo])

	useEffect(() => {
		const resetBlacklist = async () => {
			if(window.confirm("차단 목록을 초기화(전부 삭제)하시겠습니까?") === false){
				return;
			}

			const answer = window.prompt("차단 목록을 초기화 하려면 \"초기화\"라고 입력해주세요");

			if(answer === null){
				return;
			}
			else if(answer === "초기화"){
				setIsLoading(true);
				setLoadingMessage("차단 목록을 초기화 중입니다");
				await accountsFetch.resetMyBlacklist();
				setIsLoading(false);
				alert("차단 목록이 초기화 되었습니다");
				callMyInfo();
				return;
			}
			else{
				alert("입력된 문구가 올바르지 않습니다");
				return;
			}
		}

		if(accountData !== null){
			setRenderData(
				<Container style={{maxWidth: "600px"}}>
					<LoadingModal showModal={isLoading} message={loadingMessage}></LoadingModal>

					<div style={ blackCount > 0 ? {display: "block"} : {display: "none"} }>
						<div className="d-grid gap-2">
							<Button onClick={ () => {resetBlacklist()} } variant="danger" style={{ fontSize: "1.2rem", fontWeight: "800" }}>초기화</Button>
						</div>
					</div>

					<div style={{ display: "flex", alignItems: "center", marginTop: "2rem" }}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-ban" viewBox="0 0 16 16">
							<path d="M15 8a6.973 6.973 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/>
						</svg>
						&nbsp;
						<span style={{ fontSize: "0.9rem" }}><strong>{blackCount}</strong>명의 차단된 사용자가 있습니다</span>
					</div>

					<div>
						{myBlackList}
					</div>
				</Container>
			);
		}
	}, [accountData, isLoading, loadingMessage, myBlackList, blackCount, callMyInfo, navigate])

	return renderData;
}

export default MyBlacklist;