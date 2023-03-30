import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Profile from './character/Profile';
import EmptyResult from './EmptyResult';
import * as functions from '../js/lostarkAPI.js'
/*
	모든 정보가 동일하게 세팅되는 문제가 있음
*/
const MainAccordion = (props) => {
	const [searchResult, setSearchResult] = useState(<>Empty Area</>);
	const navItem = [];

	const showCharacterDetail = async (event, characterNickName) => {
		console.log(event.target);
		const isCollapsed = event.target.classList.contains('collapsed');
		const isLoaded = event.target.getAttribute('loaded');

		if(isCollapsed === true && isLoaded !== "true"){
			const result = await functions.getCharacterInfo(characterNickName);
			event.target.setAttribute('loaded', true);

			if(result === null){
				setSearchResult(<EmptyResult />);
			}
			else{
				setSearchResult(<Profile cardTitle={characterNickName} cardText={characterNickName + ', I am doing test~ 한글!@#@'} />);
			}
		}
	}
	
	for(const character of props.characters){
		navItem.push(
			<Accordion.Item eventKey={character.CharacterName} key={character.CharacterName}>
				<Accordion.Header onClick={(event) => showCharacterDetail(event, character.CharacterName)}>
					<b>[{character.ServerName}]</b> {character.CharacterName} {character.CharacterClassName} ({parseInt(character.ItemAvgLevel.replace(',', ''), 10)})
				</Accordion.Header>
				<Accordion.Body style={{backgroundColor: '#f1f1f1'}}>
					{searchResult}
				</Accordion.Body>
			</Accordion.Item>
		);
	}

	return (
		<Accordion defaultActiveKey={[]} flush>
			{navItem}
		</Accordion>
	);
}

export default MainAccordion;