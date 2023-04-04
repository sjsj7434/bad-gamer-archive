import { useState, useEffect } from 'react';
import * as lostarkAPI from '../../js/lostarkAPI.js'
import EmptyResult from '../EmptyResult.js';
import Row from 'react-bootstrap/Row';

const Characters = (props) => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<></>);

	const renderCharacters = (characterList) => {
		const charactersElement = [];
		for(const element of characterList){
			charactersElement.push(
				<Row>
					<div style={{color: "red"}}>
						[{element.ServerName}] {element.CharacterName} ({element.ItemAvgLevel})
					</div>
				</Row>
			);
		}

		return charactersElement;
	}

	useEffect(() => {
		const call = async (characterName) => {
			const charactersData = await lostarkAPI.getCharacterList(characterName);
			console.log(charactersData);

			if(charactersData === null){
				setSearchResult(
					<EmptyResult/>
				);
			}
			else{
				setSearchResult(
					<>
						{renderCharacters(charactersData)}
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

export default Characters;