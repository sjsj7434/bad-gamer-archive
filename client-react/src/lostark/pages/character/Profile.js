import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';

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
							<div style={{display: "flex", alignItems: "center", marginBottom: "5px"}}>
								<Image roundedCircle={true} src={ImageCDN.findImageCDN(element.Name.split(" Lv.")[0], "")} style={{width: "34px", border: "1px solid gold"}} />
								<small style={{marginLeft: "5px", color: "#d9d9d9"}}><b>{element.Name}</b></small>
							</div>
						</>
					);
				}
				
				setSearchResult(
					<>
						<Container style={{backgroundColor: "#15181d", backgroundImage: `url("${testImage}")`, backgroundRepeat: "no-repeat", backgroundPosition: "top -50px right -90px"}}>
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
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[1].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[1].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[5].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[5].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[2].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[2].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[3].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[3].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[4].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[4].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[0].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[0].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
									</div>
								</Col>
							</Row>

							<Row>
								<Col style={{textAlign: "center"}}>
									<div style={{display: "flex"}}>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[6].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[6].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[7].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[7].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[8].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[8].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[9].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[9].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[10].Icon} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[10].Element_001.value.qualityValue}</b></small>
											</Card.Footer>
										</Card>
										
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[12] !== undefined ? equipment[12].Icon : ""} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[12] !== undefined ? equipmentDetailArray[12].Element_001.value.qualityValue : ""}</b></small>
											</Card.Footer>
										</Card>
										<Card style={{width: "42px", margin: "5px"}}>
											<Card.Img variant="top" src={equipment[11] !== undefined ? equipment[11].Icon : ""} style={{backgroundColor: "#ffc062"}}/>
											<Card.Footer style={{padding: "0px", backgroundColor: "#8700cd"}}>
												<small style={{color: "#d9d9d9"}}><b>{equipmentDetailArray[11] !== undefined ? equipmentDetailArray[11].Element_001.value.qualityValue : ""}</b></small>
											</Card.Footer>
										</Card>
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
		<div style={{marginTop: "10px"}}>
			{searchResult}
		</div>
	);
}

export default Profile;