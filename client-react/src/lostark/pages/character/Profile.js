import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as lostarkAPI from '../../js/lostarkAPI.js'
import EmptyResult from '../EmptyResult';
import Image from 'react-bootstrap/Image'

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
						<Container>
							<Row style={{textAlign: "center"}}>
								<Col sm={1}>
									<Card title={equipment[0].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[0].Icon} />
									</Card>
									<Card title={equipment[1].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[1].Icon} />
									</Card>
									<Card title={equipment[2].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[2].Icon} />
									</Card>
									<Card title={equipment[3].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[3].Icon} />
									</Card>
									<Card title={equipment[4].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[4].Icon} />
									</Card>
									<Card title={equipment[5].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[5].Icon} />
									</Card>
									<Card title={equipment[6].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[6].Icon} />
									</Card>
									<Card title={equipment[7].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[7].Icon} />
									</Card>
								</Col>
								<Col sm={2}>
									<Card.Img variant="top" src={profile.CharacterImage} />
								</Col>
								<Col sm={1}>
									<Card title={equipment[8].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[8].Icon} />
									</Card>
									<Card title={equipment[9].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[9].Icon} />
									</Card>
									<Card title={equipment[10].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[10].Icon} />
									</Card>
									<Card title={equipment[11].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[11].Icon} />
									</Card>
									<Card title={equipment[12].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[12].Icon} />
									</Card>
									<Card title={equipment[13].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[13].Icon} />
									</Card>
									<Card title={equipment[14].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[14].Icon} />
									</Card>
									<Card title={equipment[15].Type} style={{margin: "5px"}}>
										<Card.Img variant="top" src={equipment[15].Icon} />
									</Card>
								</Col>
							</Row>
						</Container>

						<CardGroup>
							<Card>
								{/* <Card.Img variant="top" src={profile.CharacterImage} /> */}
								<Card.Body>
									<Card.Title>{characterName}</Card.Title>
									<Card.Text>
										{profile.CharacterClassName}<br/>
										{profile.CharacterLevel}<br/>
										{profile.ItemAvgLevel}<br/>
										{profile.ExpeditionLevel}<br/>
									</Card.Text>
								</Card.Body>
								<Card.Footer>
									<small className="text-muted">Last updated 3 mins ago</small>
								</Card.Footer>
							</Card>
							<Card>
								<Card.Body>
									<Card.Title>equipment</Card.Title>
									<Card.Text>
										<img src={equipment[0].Icon}/><br/>
										{equipment[0].Type}<br/>
										{equipment[0].Grade}<br/>
										{equipment[0].Name}<br/>
									</Card.Text>
								</Card.Body>
							</Card>
							<Card>
								<Card.Body>
									<Card.Title>Card title</Card.Title>
									<Card.Text>
										This is a wider card with supporting text below as a natural lead-in
										to additional content. This content is a little bit longer.
									</Card.Text>
								</Card.Body>
							</Card>
							<Card>
								<Card.Body>
									<Card.Title>Card title</Card.Title>
									<Card.Text>
										This is a wider card with supporting text below as a natural lead-in
										to additional content. This content is a little bit longer.
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