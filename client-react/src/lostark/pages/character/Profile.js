import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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
				setSearchResult(
					<Card style={{ width: '150px' }}>
						<Card.Img variant="top" src={result.CharacterImage} />
						<Card.Body>
							<Card.Title>{characterName}</Card.Title>
							<Card.Text>
								{result.CharacterClassName}<br/>
								{result.CharacterLevel}<br/>
								{result.ItemAvgLevel}<br/>
								{result.ExpeditionLevel}<br/>
							</Card.Text>
							<Button variant="warning">Report!</Button>
						</Card.Body>
					</Card>
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