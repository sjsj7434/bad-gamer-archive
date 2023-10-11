import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';

import * as accountsFetch from '../../../common/js/accountsFetch.js'

const MyPage = () => {
	const [accountData, setAccountData] = useState(null);
	const [renderData, setRenderData] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		callMyInfo();
	}, [])

	// const clickREQ = async () => {
	// 	await accountsFetch.requestVerifyEmail();
	// }

	const callMyInfo = async () => {
		setAccountData(await accountsFetch.getMyInfo());
	}

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
		const deactivateLostarkCharacter = async () => {
			if(window.confirm("로스트아크 캐릭터 인증을 해제하시겠습니까?") === true){
				await accountsFetch.deactivateLostarkCharacter();
	
				callMyInfo();
			}
		}
		
		if(accountData !== null){
			setRenderData(
				<Container style={{maxWidth: "600px"}}>
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
										{accountData.email}
									</td>
								</tr>
								<tr>
									<th>가입일</th>
									<td><div className="vr"></div></td>
									<td>
										{accountData.nickname}
									</td>
								</tr>
								<tr>
									<th>비밀번호 변경일</th>
									<td><div className="vr"></div></td>
									<td>
										{accountData.nickname}
									</td>
								</tr>
								<tr>
									<th>lvl</th>
									<td><div className="vr"></div></td>
									<td>
										{accountData.nickname}
									</td>
								</tr>
								<tr>
									<th>LA Char</th>
									<td><div className="vr"></div></td>
									<td>
										<Table>
											<colgroup>
												<col width="*" />
											</colgroup>
											{
												accountData.authentication.map((element) => (
													<tr>
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
												accountData.authentication.length === 0 ? "인증되지 않음" : ""
											}
										</Table>
										<div style={{ display: "flex", alignItems: "center" }}>
											{
												accountData.authentication.length === 0 ? 
												<>
													<Button onClick={() => { navigate("activate/lostark") }} variant="outline-success" style={{ width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem" }}>인증하기</Button>
												</>
												:
												<>
													<Button onClick={() => { navigate("update/lostark") }} variant="outline-success" style={{ width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem" }}>업데이트</Button>
													&nbsp;
													<Button onClick={() => { navigate("activate/lostark") }} variant="outline-warning" style={{ width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem" }}>변경하기</Button>
													&nbsp;
													<Button onClick={() => { deactivateLostarkCharacter() }} variant="outline-danger" style={{ width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem" }}>해제하기</Button>
												</>
											}
										</div>
									</td>
								</tr>
								<tr>
									<th>LA Date</th>
									<td><div className="vr"></div></td>
									<td>
										* 더 다양한 정보를 저장하기 위해 테이블 따로
									</td>
								</tr>
							</tbody>
						</Table>

						<Stack direction="horizontal" gap={3}>
							<Button variant={"outline-primary"} onClick={() => {navigate("renew/password")}} style={{width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem"}}>비밀번호 변경</Button>
							<Button variant={"outline-primary"} onClick={() => {navigate("renew/nickname")}} style={{width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem"}}>닉네임 변경</Button>
							<Button variant={"outline-warning"} onClick={() => {navigate("leave")}} style={{width: "30%", maxWidth: "130px", padding: "2px", fontSize: "0.8rem"}}>회원탈퇴</Button>
						</Stack>
					</div>
				</Container>
			);
		}
	}, [accountData, navigate])

	return renderData;
}

export default MyPage;