import { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';

import * as accountsFetch from '../../js/accountFetch.js'
import Row from 'react-bootstrap/esm/Row.js';
import Col from 'react-bootstrap/esm/Col.js';
import LoadingModal from '../common/LoadingModal.js';
import Image from 'react-bootstrap/Image';
import '../../css/MyPage.css';
import Form from 'react-bootstrap/Form';

const MyBlacklist = () => {
	const [accountData, setAccountData] = useState(null);
	const [renderData, setRenderData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [myBlackList, setMyBlackList] = useState(null);

	const navigate = useNavigate();

	const callMyInfo = useCallback(async () => {
		const myInfo = await accountsFetch.getMyInfo();
		const blacklist = await accountsFetch.getMyBlacklist();

		console.log(blacklist)

		if(myInfo === null){
			navigate("/");
			return;
		}

		if(blacklist === null){
			navigate("/");
			return;
		}

		const rend = [];
		rend.push(blacklist.map((element) => {
			return(
				<>
					<Form style={{ fontSize: "0.9rem" }}>
						<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
							<Form.Label>{element.blackNickname} | {new Date(element.createdAt).toLocaleString("sv-SE")}</Form.Label>
							<Form.Control style={{ fontSize: "0.8rem" }} as="textarea" rows={3} defaultValue={element.blackReason} />
						</Form.Group>
					</Form>
				</>
			);
		}))

		setAccountData(myInfo);
		setMyBlackList(rend);

		setIsLoading(false);
	}, [navigate])

	useEffect(() => {
		callMyInfo();
	}, [callMyInfo])

	const deleteAccount = useCallback(async () => {
		if(window.confirm("탈퇴를 진행하시겠습니까?") === false){
			return;
		}

		const deleteResult = await accountsFetch.deleteAccount();

		if(deleteResult === "true"){
			alert("정상적으로 탈퇴 처리되었습니다");
		}
		else{
			alert("계정을 탈퇴 처리할 수 없습니다");
		}
		
		navigate("/");
	}, [navigate])

	// const clickREQ = async () => {
	// 	await accountsFetch.requestVerifyEmail();
	// }

	const stringParser = (value) => {
		let name = "";

		if(value === "lostark_character_level"){
			name = "전투 레벨";
		}
		switch (value) {
			case "lostark_character_level":
				name = "전투 레벨";
				break;
			case "lostark_item_level":
				name = "아이템 레벨";
				break;
			case "lostark_name":
				name = "캐릭터";
				break;
			case "lostark_server":
				name = "서버";
				break;
			case "stove_code":
				name = "스토브 코드";
				break;
			default:
				name = "-";
				break;
		}

		return name;
	}

	useEffect(() => {
		//캐릭터 인증 업데이트
		const renewLostarkCharacter = async () => {
			setIsLoading(true);
			setLoadingMessage("인증 정보를 갱신 중입니다...");
			const result = await accountsFetch.renewLostarkCharacter();
		
			if(result === null){
				return;
			}
			if(result === "0001"){
				alert("정상적으로 업데이트 되었습니다");
			}
			else if(result === "0002"){
				alert("알 수 없는 데이터가 입력되었습니다");
			}
			else if(result === "0003"){
				alert("정보를 업데이트할 수 없습니다(닉네임이 변경되었다면 변경하기를 진행해주세요");
			}
			else if(result === "0004"){
				alert("이미 캐릭터 인증 또는 업데이트가 진행되었습니다\n잠시 후 다시 진행해주세요");	
				setIsLoading(false);
				return;
			}

			callMyInfo();
		}

		//캐릭터 인증을 해제
		const deactivateLostarkCharacter = async () => {
			if(window.confirm("로스트아크 캐릭터 인증을 해제하시겠습니까?") === true){
				setIsLoading(true);
				setLoadingMessage("인증을 해제하는 중입니다...");
				await accountsFetch.deactivateLostarkCharacter();
	
				callMyInfo();
			}
		}
		
		if(accountData !== null){
			setRenderData(
				<Container style={{maxWidth: "600px"}}>
					<LoadingModal showModal={isLoading} message={loadingMessage}></LoadingModal>

					<div>
						{myBlackList}
					</div>
				</Container>
			);
		}
	}, [accountData, isLoading, loadingMessage, callMyInfo, deleteAccount, navigate])

	return renderData;
}

export default MyBlacklist;