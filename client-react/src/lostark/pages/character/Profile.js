import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as lostarkAPI from '../../js/lostarkAPI.js'
import EmptyResult from '../EmptyResult';

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
				
				setSearchResult(
					<>
						<CardGroup>
							<Card>
								{/* <Card.Img variant="top" src={profile.CharacterImage} /> */}
								<Card.Body>
									{/* <Card.Img variant="top" src={profile.CharacterImage} style={{borderRadius: "8px"}} /> */}
									<img src={profile.CharacterImage} style={{width: "100%", borderRadius: "5px"}} />
									
									<Card.Title>{characterName}</Card.Title>
									<Card.Text>
										{profile.CharacterClassName}<br/>
										{profile.CharacterLevel}<br/>
										{profile.ItemAvgLevel}<br/>
										{profile.ExpeditionLevel}<br/>
									</Card.Text>
								</Card.Body>
							</Card>
							<Card>
								<Card.Body>
									<Card.Title>equipment</Card.Title>
									<Card.Text>
										<div style={{display: "flex", flexWrap: "wrap"}}>
											<div title={equipment[1].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[1].Icon} />
											</div>

											<div title={equipment[5].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[5].Icon} />
											</div>
											<div title={equipment[2].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[2].Icon} />
											</div>
											<div title={equipment[3].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[3].Icon} />
											</div>
											<div title={equipment[4].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[4].Icon} />
											</div>
											<div title={equipment[0].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[0].Icon} />
											</div>
										</div>
										
										<div style={{display: "flex", flexWrap: "wrap"}}>
											<div title={"착용 각인"} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={engravings.Engravings[0].Icon} />
											</div>
											<div title={"착용 각인"} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={engravings.Engravings[1].Icon} />
											</div>
										</div>

										<div style={{display: "flex", flexWrap: "wrap"}}>
											<div title={equipment[6].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[6].Icon} />
											</div>
											<div title={equipment[7].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[7].Icon} />
											</div>
											<div title={equipment[8].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[8].Icon} />
											</div>
											<div title={equipment[9].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[9].Icon} />
											</div>
											<div title={equipment[10].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[10].Icon} />
											</div>
											<div title={equipment[12].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[12].Icon} />
											</div>
											<div title={equipment[11].Type} style={{width: "fit-content", margin: "5px", backgroundColor: "#dddfdc", borderRadius: "4px"}}>
												<img src={equipment[11].Icon} />
											</div>
										</div>
									</Card.Text>
								</Card.Body>
							</Card>
						</CardGroup>
					</>
				);
			}
		}
		
		call(params.characterName);
	}, [params]); //처음 페이지 로딩 될때만

	return (
		<div style={{ margin: '20px' }}>
			{searchResult}
		</div>
	);
}

export default Profile;