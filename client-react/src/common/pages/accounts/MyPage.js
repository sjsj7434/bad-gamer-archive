import { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';

import * as accountsFetch from '../../../common/js/accountsFetch.js'
import Row from 'react-bootstrap/esm/Row.js';
import Col from 'react-bootstrap/esm/Col.js';
import LoadingModal from '../common/LoadingModal.js';

const MyPage = () => {
	const [accountData, setAccountData] = useState(null);
	const [renderData, setRenderData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");

	const navigate = useNavigate();

	const callMyInfo = useCallback(async () => {
		const myInfo = await accountsFetch.getMyInfo();

		if(myInfo === null){
			navigate("/");
			return;
		}

		setAccountData(myInfo);
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
					<div style={{paddingLeft: "10px", paddingRight: "10px", fontSize: "0.8rem"}}>
						<Table hover>
							<colgroup>
								<col width="30%" />
								<col width="5%" />
								<col width="*" />
							</colgroup>
							<tbody>
								{/*
								<tr>
									<th>이메일</th>
									<td><div className="vr"></div></td>
									<td>
										<div style={{ display: "flex", alignItems: "center" }}>
											{accountData.email}
											&nbsp;&nbsp;
											<Button onClick={() => { clickREQ() }} variant="outline-success" style={{ width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem" }}>인증하기</Button>
										</div>
									</td>
								</tr>
								*/}
								<tr>
									<th>아이디</th>
									<td><div className="vr"></div></td>
									<td>
										{accountData.id}
									</td>
								</tr>
								<tr>
									<th>닉네임</th>
									<td><div className="vr"></div></td>
									<td>
										{accountData.nickname}
									</td>
								</tr>
								<tr>
									<th>이메일</th>
									<td><div className="vr"></div></td>
									<td>
										{accountData.email === null ? "-" : accountData.email}
									</td>
								</tr>
								<tr>
									<th>커뮤력</th>
									<td><div className="vr"></div></td>
									<td>
										{new Intl.NumberFormat().format(accountData.exp)}
									</td>
								</tr>
								<tr>
									<th>가입일</th>
									<td><div className="vr"></div></td>
									<td>
										{accountData.createdAt.substring(0, 10)}
									</td>
								</tr>
								<tr>
									<th>비밀번호 변경일</th>
									<td><div className="vr"></div></td>
									<td>
										{accountData.passwordChangeDate === null ? "-" : accountData.passwordChangeDate.substring(0, 10)}
									</td>
								</tr>
								<tr>
									<th>LA 인증</th>
									<td><div className="vr"></div></td>
									<td>
										<Table>
											<tbody>
												{
													accountData.authentication.map((element) => (
														<tr key={element.type}>
															<th>
																{stringParser(element.type)}
															</th>
															<td>
																{element.data}
															</td>
														</tr>
													))
												}
												{
													accountData.authentication.length === 0 ?
													<tr>
														<td colSpan="2">인증되지 않음</td>
													</tr>
													:
													<tr>
														<th>인증일</th>
														<td>{accountData.authentication.filter((element) => element.type === "lostark_item_level")[0].updatedAt.substring(0, 10)}</td>
													</tr>
												}
											</tbody>
										</Table>
										<div style={{ display: "flex", alignItems: "center" }}>
											<Row>
											</Row>
											{
												accountData.authentication.length === 0 ? 
												<>
													<Col>
														<div className="d-grid gap-2" style={{ margin: "0.4rem" }}>
															<Button onClick={() => { navigate("activate/lostark") }} variant="outline-success" style={{ padding: "2px", fontSize: "0.8rem" }}>인증하기</Button>
														</div>
													</Col>
												</>
												:
												<>
													<Col>
														<div className="d-grid gap-2" style={{ margin: "0.4rem" }}>
															<Button onClick={() => { renewLostarkCharacter() }} variant="outline-success" style={{ padding: "2px", fontSize: "0.8rem" }}>업데이트</Button>
														</div>
													</Col>
													<Col>
														<div className="d-grid gap-2" style={{ margin: "0.4rem" }}>
															<Button onClick={() => { navigate("activate/lostark") }} variant="outline-warning" style={{ padding: "2px", fontSize: "0.8rem" }}>변경하기</Button>
														</div>
													</Col>
													<Col>
														<div className="d-grid gap-2" style={{ margin: "0.4rem" }}>
															<Button onClick={() => { deactivateLostarkCharacter() }} variant="outline-danger" style={{ padding: "2px", fontSize: "0.8rem" }}>해제하기</Button>
														</div>
													</Col>
												</>
											}
										</div>
									</td>
								</tr>
							</tbody>
						</Table>

						<Row>
							<Col>
								<div className="d-grid gap-2">
									<Button variant="outline-primary" size="lg" onClick={() => {navigate("renew/email")}} style={{ padding: "2px", fontSize: "0.8rem" }}>이메일 변경</Button>
								</div>
							</Col>
							<Col>
								<div className="d-grid gap-2">
									<Button variant="outline-primary" size="lg" onClick={() => {navigate("renew/password")}} style={{ padding: "2px", fontSize: "0.8rem" }}>비밀번호 변경</Button>
								</div>
							</Col>
							<Col>
								<div className="d-grid gap-2">
									<Button variant="outline-primary" size="lg" onClick={() => {navigate("renew/nickname")}} style={{ padding: "2px", fontSize: "0.8rem" }}>닉네임 변경</Button>
								</div>
							</Col>
						</Row>

						<div className="d-grid gap-2" style={{ marginTop: "1.5rem" }}>
							<Button variant="danger" size="lg" onClick={() => { deleteAccount() }} style={{ fontSize: "0.8rem" }}>회원탈퇴</Button>
						</div>
					</div>
				</Container>
			);
		}
	}, [accountData, isLoading, loadingMessage, callMyInfo, deleteAccount, navigate])

	return renderData;
}

export default MyPage;