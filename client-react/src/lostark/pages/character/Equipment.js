import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { useState, useEffect } from 'react';
import * as lostarkAPI from '../../js/lostarkAPI.js'
import EmptyResult from '../EmptyResult';

const Equipment = (props) => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<></>);
				
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
				backColor = "#ffffff";
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

	useEffect(() => {
		const call = async (characterName) => {
			const equipmentData = await lostarkAPI.getEquipmentInfo(characterName);
			console.log(equipmentData);

			if(equipmentData === null){
				setSearchResult(
					<EmptyResult/>
				);
			}
			else{
				const equipmentDetailArray = [];
				for(const element of equipmentData){
					const equipmentDetail = JSON.parse(element.Tooltip);
					equipmentDetailArray.push(equipmentDetail);
				}

				setSearchResult(
					<>
						<Row>
							<Col style={{textAlign: "center"}}>
								<div style={{display: "flex"}}>
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[1].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[1].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[1].Element_001.value.qualityValue)}}>
											<small style={{color: "#ff5d5d"}}><b>{equipmentData[1].Name.split(" ")[0]}</b></small>
											<br/>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[1].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[5].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[5].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[5].Element_001.value.qualityValue)}}>
											<small style={{color: "#ff5d5d"}}><b>{equipmentData[5].Name.split(" ")[0]}</b></small>
											<br/>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[5].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[2].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[2].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[2].Element_001.value.qualityValue)}}>
											<small style={{color: "#ff5d5d"}}><b>{equipmentData[2].Name.split(" ")[0]}</b></small>
											<br/>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[2].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[3].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[3].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[3].Element_001.value.qualityValue)}}>
											<small style={{color: "#ff5d5d"}}><b>{equipmentData[3].Name.split(" ")[0]}</b></small>
											<br/>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[3].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[4].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[4].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[4].Element_001.value.qualityValue)}}>
											<small style={{color: "#ff5d5d"}}><b>{equipmentData[4].Name.split(" ")[0]}</b></small>
											<br/>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[4].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[0].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[0].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[0].Element_001.value.qualityValue)}}>
											<small style={{color: "#ff5d5d"}}><b>{equipmentData[0].Name.split(" ")[0]}</b></small>
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
										<Card.Img variant="top" src={equipmentData[6].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[6].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[6].Element_001.value.qualityValue)}}>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[6].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[7].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[7].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[7].Element_001.value.qualityValue)}}>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[7].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[8].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[8].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[8].Element_001.value.qualityValue)}}>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[8].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[9].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[9].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[9].Element_001.value.qualityValue)}}>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[9].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[10].Icon} style={{backgroundColor: `${getGearGradeColor(equipmentData[10].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[10].Element_001.value.qualityValue)}}>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[10].Element_001.value.qualityValue}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[12] !== undefined ? equipmentData[12].Icon : ""} style={{backgroundColor: `${getGearGradeColor(equipmentData[12].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[12].Element_001.value.qualityValue)}}>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[12] !== undefined ? equipmentDetailArray[12].Element_001.value.qualityValue : ""}</b></small>
										</Card.Footer>
									</Card>
									
									<Card style={{width: "48px", margin: "5px"}}>
										<Card.Img variant="top" src={equipmentData[11] !== undefined ? equipmentData[11].Icon : ""} style={{backgroundColor: `${getGearGradeColor(equipmentData[11].Grade)}`}}/>
										<Card.Footer style={{padding: "0px", backgroundColor: getBackgroundColor(equipmentDetailArray[11].Element_001.value.qualityValue)}}>
											<small style={{color: "#ffffff"}}><b>{equipmentDetailArray[11] !== undefined ? equipmentDetailArray[11].Element_001.value.qualityValue : ""}</b></small>
										</Card.Footer>
									</Card>
								</div>
							</Col>
						</Row>
					</>
				);
			}
		}
		
		call(props.characterName);
	}, [props]); //처음 페이지 로딩 될때만

	return (
		<div>
			{searchResult}
		</div>
	);
}

export default Equipment;