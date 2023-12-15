import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import * as accountFetch from "../../../js/accountFetch";

const NicknameMenu = (props) => {
	const BLACK_REASON_MAX_LEN = 200; //블랙 사유 최대 길이

	const [showAddBlacklist, setShowAddBlacklist] = useState(false);

	const closeAddBlacklistModal = () => setShowAddBlacklist(false);
	const showAddBlacklistModal = () => setShowAddBlacklist(true);
			
	const addToBlacklist = async (blackNickname) => {
		const blackReasonElement = document.querySelector("#blackReason");

		if(window.confirm(`"${blackNickname}"을(를) 차단하시겠습니까?\n차단할 경우 이 사용자의 글과 댓글이 보이지 않습니다`) === false){
			return;
		}

		if(blackReasonElement.value.length > BLACK_REASON_MAX_LEN){
			alert(`${BLACK_REASON_MAX_LEN}자가 넘으면`);
			return;
		}

		const sendData = {
			blackNickname: blackNickname,
			blackReason: blackReasonElement.value,
		}

		const result = await accountFetch.addToBlacklist(sendData);

		if(result === "0001"){
			alert("이미 차단되어 있는 유저입니다");
		}
		else if(result === "0002"){
			alert("차단 되었습니다");
			window.location.reload();
		}
		else if(result === "0003"){
			alert("유저를 차단하려면 로그인이 필요합니다");
		}
		else{
			alert("오류가 발생하였습니다");
		}

		closeAddBlacklistModal();
	}
	
	const openAddBlacklistForm = async () => {
		if(props.accountData.status !== "login"){
			alert("사용자를 차단하려면 로그인이 필요합니다");
			return;
		}

		showAddBlacklistModal();
		document.querySelector("#nicknamePopover").style.display = "none";
	}

	const userPopover = (
		<Popover id={"nicknamePopover"} style={{ minWidth: "170px", fontSize: "0.8rem" }}>
			{/* <Popover.Header as="h3">메뉴</Popover.Header> */}
			<Popover.Body style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "10px", paddingRight: "30px" }}>
				<div>
					<div style={{ marginBottom: "10px" }}>
						<span onClick={() => { alert("아직 준비 중입니다") }} style={{ cursor: "pointer", color: "lightgray" }}>프로필 보기</span>
					</div>
					<div style={{ marginBottom: "10px" }}>
						<span onClick={() => { alert("아직 준비 중입니다") }} style={{ cursor: "pointer", color: "lightgray" }}>쪽지 보내기</span>
					</div>
					<div style={{ }}>
						<span onClick={() => { openAddBlacklistForm() }} style={{ cursor: "pointer", color: "red" }}>차단하기</span>
					</div>
				</div>
			</Popover.Body>
		</Popover>
	);
	
	return(
		<>
			{
				(props.accountData.nickname === props.targetNickname) === false ?
				<>
					<OverlayTrigger trigger="click" placement="right-start" overlay={userPopover} rootClose={true}>
						<Button variant="link" style={{ fontSize: "0.8rem", padding: "2px" }}>{ props.targetNickname }</Button>
					</OverlayTrigger>
				</>
				:
				<>
					<span style={{fontSize: "0.8rem", color: "black"}}>
						{ props.targetNickname }
					</span>
				</>
			}

			<Modal show={showAddBlacklist} onHide={closeAddBlacklistModal} backdrop="static" keyboard={false} centered>
				<Modal.Header closeButton>
					<Modal.Title style={{ fontSize: "1.3rem" }}>차단하기</Modal.Title>
				</Modal.Header>

				<Modal.Body style={{ maxHeight: "20rem", overflow: "auto", fontSize: "0.8rem" }}>
					<Form>
						<Form.Group className="mb-3" controlId="blackReason">
							<Form.Label>차단 사유</Form.Label>
							<Form.Control as="textarea" rows={3} maxLength={BLACK_REASON_MAX_LEN} style={{ fontSize: "0.8rem" }} />
						</Form.Group>
					</Form>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={closeAddBlacklistModal} className="smallButton">
						취소
					</Button>
					<Button variant="danger" onClick={ () => {addToBlacklist(props.targetNickname)} } className="smallButton">
						차단
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default NicknameMenu;