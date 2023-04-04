import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as lostarkAPI from '../../js/lostarkAPI.js'
import * as ImageCDN from '../../js/ImageCDN.js'
import EmptyResult from '../EmptyResult';
import testImage from '../../images/logo192.png'

const Profile = () => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<></>);
	const params = useParams();
	// console.log(params);

	useEffect(() => {
		const call = async (characterName) => {
			// const result = await lostarkAPI.getTestJson(characterName);
			const result = await lostarkAPI.getCharacterInfo(characterName);

			if(result === null){
				setSearchResult(
					<EmptyResult/>
				);
			}
			else{
				const profile = result.profile.data;
				const equipment = result.equipment.data;
				// const avatars = result.avatars.data;
				// const combatSkills = result.combatSkills.data;
				const engravings = result.engravings.data;
				const cards = result.cards.data;
				// const gems = result.gems.data;
				// const colosseums = result.colosseums.data;
				// const collectibles = result.collectibles.data;
				//한번 검색에 API 10번 호출???

				const equipmentDetailArray = [];
				for(const element of equipment){
					const equipmentDetail = JSON.parse(element.Tooltip);
					equipmentDetailArray.push(equipmentDetail);
				}

				const engravingsDetailArray = [];
				for(const element of engravings.Engravings){
					const engravingsDetail = JSON.parse(element.Tooltip);
					engravingsDetailArray.push(engravingsDetail);
				}
				console.log('engravingsDetailArray', engravingsDetailArray[0]);

				const engravingsAreOn = [];
				for(const element of engravings.Effects){
					engravingsAreOn.push(
						<>
							<div key={element.Name} style={{display: "flex", alignItems: "center", marginBottom: "5px"}}>
								<Image roundedCircle={true} src={ImageCDN.findImageCDN(element.Name.split(" Lv.")[0], "")} style={{width: "34px", border: element.Name.includes(" 감소") ? "2px solid #ff3e3e" : "2px solid #2e9d00"}} />
								<small style={{marginLeft: "5px", color: "#ffffff"}}><b>{element.Name}</b></small>
							</div>
						</>
					);
				}
				
				const getGearGradeColor = (gearGrade) => {
					let backColor = "";

					switch (gearGrade) {
						case "에스더":
							backColor = "#75ffec";
							break;
						case "고대":
							backColor = "#d3d3d3";
							break;
						case "유물":
							backColor = "#ffa638";
							break;
						case "전설":
							backColor = "#ffd26d";
							break;
						default:
							backColor = "white";
							break;
					}

					return backColor;
				}

				const getBackgroundColor = (score) => {
					if (0 <= score && score <= 9){
						return "orange";
					}
					else if (10 <= score && score <= 29){
						return "#dddd00";
					}
					else if (30 <= score && score <= 69){
						return "#539553";
					}
					else if (70 <= score && score <= 89){
						return "#4141ff";
					}
					else if (90 <= score && score <= 99){
						return "#853785";
					}
					else if (score === 100){
						return "#ffdd24";
					}
					else{
						return "";
					}
				}

				const renderCardGroup = (cardList) => {
					const cardListElement = [];

					for(const card of cardList){
						cardListElement.push(
							<Col>
								<div style={{display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
									<div>
										<div>
											<div style={{aspectRatio: 24 / 35, overflow: "hidden", backgroundSize: "cover", backgroundImage: `url('${card.Icon}')`}}>
												<img src={'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_card_grade.png'}  style={{position: "relative", left: `-${cardGradeLeft(card.Grade)}%`, top: "-2%", width: "656%"}} />
											</div>
										</div>

										<div>
											<div style={{aspectRatio: 3 / 1, overflow: "hidden", backgroundSize: "cover", backgroundImage: `url('https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_profile_awake.png')`}}>
												<img src={"https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_profile_awake.png"} style={{position: "relative", left: `-${cardAwakeCountLeft(card.AwakeCount)}%`, top: "-97%", width: "100%"}} />
											</div>
										</div>
									</div>
								</div>
							</Col>
						);
					}

					return cardListElement;
				}

				const cardAwakeCountLeft = (AwakeCount) => {
					let leftValue = 20 * AwakeCount;
					if(AwakeCount === 0){
						leftValue = 100;
					}
					else if(AwakeCount === 5){
						leftValue = 0;
					}

					return leftValue;
				}

				const cardGradeLeft = (grade) => {
					let leftValue = 0;

					switch (grade) {
						case "일반":
							leftValue = 0;
							break;
						case "희귀":
							leftValue = 111.5;
							break;
						case "고급":
							leftValue = 222.5;
							break;
						case "영웅":
							leftValue = 333.5;
							break;
						case "전설":
							leftValue = 444.5;
							break;
						default:
							break;
					}

					return leftValue;
				}

				const renderCardGroupEffect = (cardEffects) => {
					const cardEffectElement = [];

					for(const effect of cardEffects){
						cardEffectElement.push(
							<li>
								<div>
									<span style={{}}>{effect.Name}</span>
									<br/>
									<span style={{}}>{effect.Description}</span>
								</div>
							</li>
						);
					}

					return cardEffectElement;
				}

				setSearchResult(
					<>
						<Container style={{backgroundColor: "#15181d", width: "100%", backgroundImage: `url("${true ? testImage : profile.CharacterImage}")`, backgroundRepeat: "no-repeat", backgroundPosition: "top -50px right -90px"}}>
							<Row>
								<Col xs={12} md={8}>
									<Container style={{display: "flex", marginTop: "15px", flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", textAlign: "left"}}>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px", marginRight: "5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profile.ServerName}
											</span>
										</div>
										<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px", marginRight: "5px"}}>
											<span style={{color: "#ffffcc", fontSize: "12px"}}>
												{profile.CharacterClassName}
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
														{profile.GuildName}
													</td>
												</tr>
												<tr>
													<td style={{color: "#ffffcc"}}>
														영지
													</td>
													<td style={{color: "#ffffff"}}>
														{profile.TownName} (Lvl. {profile.TownLevel})
													</td>
												</tr>
												<tr>
													<td style={{color: "#ffffcc"}}>
														PVP
													</td>
													<td style={{color: "#ffffff"}}>
														{profile.PvpGradeName}
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
														{profile.ItemAvgLevel.replace(".00", "")}
													</td>
													<td>
														{profile.CharacterLevel}
													</td>
													<td>
														{profile.ExpeditionLevel}
													</td>
												</tr>
											</tbody>
										</table>
									</Container>
								</Col>
							</Row>

							<Row>
								<Col style={{textAlign: "center"}}>
									<div style={{display: "flex"}}>
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[1].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[1].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[1].Element_001.value.qualityValue)}}>
												<small style={{color: "#ff5d5d"}}><b>{equipment[1].Name.split(" ")[0]}</b></small>
												<br/>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[1].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[5].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[5].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[5].Element_001.value.qualityValue)}}>
												<small style={{color: "#ff5d5d"}}><b>{equipment[5].Name.split(" ")[0]}</b></small>
												<br/>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[5].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[2].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[2].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[2].Element_001.value.qualityValue)}}>
												<small style={{color: "#ff5d5d"}}><b>{equipment[2].Name.split(" ")[0]}</b></small>
												<br/>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[2].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[3].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[3].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[3].Element_001.value.qualityValue)}}>
												<small style={{color: "#ff5d5d"}}><b>{equipment[3].Name.split(" ")[0]}</b></small>
												<br/>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[3].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[4].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[4].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[4].Element_001.value.qualityValue)}}>
												<small style={{color: "#ff5d5d"}}><b>{equipment[4].Name.split(" ")[0]}</b></small>
												<br/>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[4].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[0].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[0].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[0].Element_001.value.qualityValue)}}>
												<small style={{color: "#ff5d5d"}}><b>{equipment[0].Name.split(" ")[0]}</b></small>
												<br/>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[0].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
									</div>
								</Col>
							</Row>

							<Row>
								<Col style={{textAlign: "center"}}>
									<div style={{display: "flex"}}>
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[6].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[6].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[6].Element_001.value.qualityValue)}}>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[6].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[7].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[7].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[7].Element_001.value.qualityValue)}}>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[7].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[8].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[8].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[8].Element_001.value.qualityValue)}}>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[8].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[9].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[9].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[9].Element_001.value.qualityValue)}}>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[9].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[10].Icon} style={{backgroundColor: `${getGearGradeColor(equipment[10].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[10].Element_001.value.qualityValue)}}>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[10].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[12] !== undefined ? equipment[12].Icon : ""} style={{backgroundColor: `${getGearGradeColor(equipment[12].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[12].Element_001.value.qualityValue)}}>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[12] !== undefined ? equipmentDetailArray[12].Element_001.value.qualityValue : ""}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "48px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[11] !== undefined ? equipment[11].Icon : ""} style={{backgroundColor: `${getGearGradeColor(equipment[11].Grade)}`}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[11].Element_001.value.qualityValue)}}>
												<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[11] !== undefined ? equipmentDetailArray[11].Element_001.value.qualityValue : ""}</b></small>
											</Card.Footer>
										</Card>
									</div>
								</Col>
							</Row>

							<Row>
								<Col style={{textAlign: "left"}}>
									<table style={{marginTop: "10px"}}>
										<colgroup>
											<col width={"80px"}></col>
											<col width={"80px"}></col>
											<col width={"80px"}></col>
										</colgroup>
										<tbody>
											<tr>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Stats[0].Type}
														</span>
													</div>
												</td>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Stats[1].Type}
														</span>
													</div>
												</td>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Stats[3].Type}
														</span>
													</div>
												</td>
											</tr>
											<tr style={{color: "#ffffff"}}>
												<td>
													{profile.Stats[0].Value}
												</td>
												<td>
													{profile.Stats[1].Value}
												</td>
												<td>
													{profile.Stats[3].Value}
												</td>
											</tr>
											<tr>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Stats[2].Type}
														</span>
													</div>
												</td>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Stats[4].Type}
														</span>
													</div>
												</td>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Stats[5].Type}
														</span>
													</div>
												</td>
											</tr>
											<tr style={{color: "#ffffff"}}>
												<td>
													{profile.Stats[2].Value}
												</td>
												<td>
													{profile.Stats[4].Value}
												</td>
												<td>
													{profile.Stats[5].Value}
												</td>
											</tr>
										</tbody>
									</table>
									
									<table style={{marginTop: "10px"}}>
										<colgroup>
											<col width={"60px"}></col>
											<col width={"60px"}></col>
											<col width={"60px"}></col>
											<col width={"60px"}></col>
										</colgroup>
										<tbody>
											<tr>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Tendencies[0].Type}
														</span>
													</div>
												</td>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Tendencies[1].Type}
														</span>
													</div>
												</td>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Tendencies[2].Type}
														</span>
													</div>
												</td>
												<td>
													<div style={{display: "flex", backgroundColor: "#303030", width: "fit-content", borderRadius: "8px", padding: "2px 5px 2px 5px"}}>
														<span style={{color: "#ffffcc", fontSize: "12px"}}>
															{profile.Tendencies[3].Type}
														</span>
													</div>
												</td>
											</tr>
											<tr style={{color: "#ffffff"}}>
												<td>
													{profile.Tendencies[0].Point}
												</td>
												<td>
													{profile.Tendencies[1].Point}
												</td>
												<td>
													{profile.Tendencies[2].Point}
												</td>
												<td>
													{profile.Tendencies[3].Point}
												</td>
											</tr>
										</tbody>
									</table>
								</Col>
								<Col style={{textAlign: "center"}}>
									<div style={{display: "flex", marginTop: "15px", flexDirection: "column"}}>
										{engravingsAreOn}
									</div>
								</Col>
							</Row>
							
							<Row xs={6} md={6} className="g-2">
								{renderCardGroup(cards.Cards)}
							</Row>

							<Row>
								<ul style={{color: "#ffffcc"}}>
									{renderCardGroupEffect(cards.Effects[0].Items)}
								</ul>
							</Row>
						</Container>
					</>
				);
			}
		}
		
		call(params.characterName);
	}, [params]); //처음 페이지 로딩 될때만

	return (
		<div>
			{searchResult}
		</div>
	);
}

export default Profile;