import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useState, useEffect } from 'react';
import EmptyResult from '../../../common/pages/errors/EmptyResult.js';

const ProfileBasic = (props) => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<></>);

	useEffect(() => {
		const call = async (characterName) => {
			const profileData = props.profileData;

			if(profileData === null){
				setSearchResult(
					<EmptyResult/>
				);
			}
			else{
				setSearchResult(
					<>
						<Row>
							<Col xs={12} md={8}>
								<Container style={{display: "flex", marginTop: "15px", flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", textAlign: "left"}}>
									<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px", marginRight: "5px"}}>
										<span style={{color: "#ffffcc", fontSize: "12px"}}>
											{profileData.ServerName}
										</span>
									</div>
									<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px", marginRight: "5px"}}>
										<span style={{color: "#ffffcc", fontSize: "12px"}}>
											{profileData.CharacterClassName}
										</span>
									</div>
								</Container>

								<Container style={{marginTop: "15px"}}>
									<h2 style={{color: "#ffffdd", fontWeight: "600"}}>
										{characterName}
									</h2>
								</Container>
								
								<Container style={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", textAlign: "left", height: "170px"}}>
									<table>
										<colgroup>
											<col width={"100px"}></col>
											<col width={"170px"}></col>
										</colgroup>
										<tbody>
											<tr>
												<td style={{color: "#ffffcc"}}>
													길드
												</td>
												<td style={{color: "#ffffff"}}>
													{profileData.GuildName}
												</td>
											</tr>
											<tr>
												<td style={{color: "#ffffcc"}}>
													영지
												</td>
												<td style={{color: "#ffffff"}}>
													{profileData.TownName} (Lvl. {profileData.TownLevel})
												</td>
											</tr>
											<tr>
												<td style={{color: "#ffffcc"}}>
													PVP
												</td>
												<td style={{color: "#ffffff"}}>
													{profileData.PvpGradeName}
												</td>
											</tr>
										</tbody>
									</table>

									<table style={{marginTop: "10px"}}>
										<colgroup>
											<col width={"100px"}></col>
											<col width={"85px"}></col>
											<col width={"85px"}></col>
										</colgroup>
										<tbody>
											<tr>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															아이템 레벨
														</span>
													</div>
												</td>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															전투 레벨
														</span>
													</div>
												</td>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															원정대 레벨
														</span>
													</div>
												</td>
											</tr>
											<tr style={{color: "#ffffff"}}>
												<td>
													{profileData.ItemAvgLevel.replace(".00", "")}
												</td>
												<td>
													{profileData.CharacterLevel}
												</td>
												<td>
													{profileData.ExpeditionLevel}
												</td>
											</tr>
										</tbody>
									</table>
								</Container>
							</Col>
						</Row>
					</>
				);
			}
		}
		
		call();
	}, [props]); //처음 페이지 로딩 될때만

	return (
		<div>
			{searchResult}
		</div>
	);
}

export default ProfileBasic;