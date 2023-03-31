import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as lostarkAPI from '../../js/lostarkAPI.js'
import * as ImageCDN from '../../js/ImageCDN.js'
import EmptyResult from '../EmptyResult';
import testImage from '../../images/logo192.png'
import CardHeader from 'react-bootstrap/esm/CardHeader.js';

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
				const avatars = result.avatars.data;
				const combatSkills = result.combatSkills.data;
				const engravings = result.engravings.data;
				const cards = result.cards.data;
				const gems = result.gems.data;
				const colosseums = result.colosseums.data;
				const collectibles = result.collectibles.data;
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
				
				const renderTooltip = (props) => (
					<Tooltip id="button-tooltip" {...props}>
						<small>
							<font size='2'>
								<font color='#ffffff'>
									마나 소모량이 <font color='#99FF99'>50%</font> 감소하고,
									마나를 소모하는 스킬의 피해가 <font color='#99FF99'>12%</font> 증가한다.
								</font>
							</font>
						</small>
					</Tooltip>
				);

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

				setSearchResult(
					<>
						<Container style={{backgroundColor: "#15181d", backgroundImage: `url("${profile.CharacterImage}")`, backgroundRepeat: "no-repeat", backgroundPosition: "top -50px right -90px"}}>
							<Row>
								<Col xs={12} md={8}>
									<div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", textAlign: "left", color: "#ffffcc", height: "250px"}}>
										<Badge bg="primary" style={{margin: "2px"}}>{characterName} ({profile.CharacterClassName})</Badge>
										<Badge bg="primary" style={{margin: "2px"}}>{profile.ExpeditionLevel}</Badge>
										<Badge bg="primary" style={{margin: "2px"}}>{profile.CharacterLevel}</Badge>
										<Badge bg="primary" style={{margin: "2px"}}>{profile.ItemAvgLevel}</Badge>
									</div>
								</Col>
							</Row>

							<Row>
								<Col style={{textAlign: "center"}}>
									<div style={{display: "flex"}}>
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[1].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[1].Element_001.value.qualityValue)}}>
													<small style={{color: "#ff5d5d"}}><b>{equipment[1].Name.split(" ")[0]}</b></small>
													<br/>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[1].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[5].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[5].Element_001.value.qualityValue)}}>
													<small style={{color: "#ff5d5d"}}><b>{equipment[5].Name.split(" ")[0]}</b></small>
													<br/>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[5].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[2].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[2].Element_001.value.qualityValue)}}>
													<small style={{color: "#ff5d5d"}}><b>{equipment[2].Name.split(" ")[0]}</b></small>
													<br/>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[2].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[3].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[3].Element_001.value.qualityValue)}}>
													<small style={{color: "#ff5d5d"}}><b>{equipment[3].Name.split(" ")[0]}</b></small>
													<br/>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[3].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[4].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[4].Element_001.value.qualityValue)}}>
													<small style={{color: "#ff5d5d"}}><b>{equipment[4].Name.split(" ")[0]}</b></small>
													<br/>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[4].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[0].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[0].Element_001.value.qualityValue)}}>
													<small style={{color: "#ff5d5d"}}><b>{equipment[0].Name.split(" ")[0]}</b></small>
													<br/>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[0].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
									</div>
								</Col>
							</Row>

							<Row>
								<Col style={{textAlign: "center"}}>
									<div style={{display: "flex"}}>
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[6].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[6].Element_001.value.qualityValue)}}>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[6].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[7].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[7].Element_001.value.qualityValue)}}>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[7].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[8].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[8].Element_001.value.qualityValue)}}>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[8].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[9].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[9].Element_001.value.qualityValue)}}>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[9].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[10].Icon} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[10].Element_001.value.qualityValue)}}>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[10].Element_001.value.qualityValue}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[12] !== undefined ? equipment[12].Icon : ""} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[12].Element_001.value.qualityValue)}}>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[12] !== undefined ? equipmentDetailArray[12].Element_001.value.qualityValue : ""}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
										
										<OverlayTrigger
											placement="top"
											delay={{ show: 10, hide: 10 }}
											overlay={renderTooltip}
										>
											<Card style={{width: "48px", margin: "5px"}}>
												<Card.Img variant="top" src={equipment[11] !== undefined ? equipment[11].Icon : ""} style={{backgroundColor: "#ffc062"}}/>
												<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[11].Element_001.value.qualityValue)}}>
													<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[11] !== undefined ? equipmentDetailArray[11].Element_001.value.qualityValue : ""}</b></small>
												</Card.Footer>
											</Card>
										</OverlayTrigger>
									</div>
								</Col>
							</Row>

							<Row>
								<Col style={{textAlign: "center"}}>
									<div style={{display: "flex", flexDirection: "column"}}>
										{engravingsAreOn}
									</div>
								</Col>
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