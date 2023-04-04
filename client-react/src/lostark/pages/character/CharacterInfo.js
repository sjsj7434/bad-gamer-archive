import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as lostarkAPI from '../../js/lostarkAPI.js'
import testImage from '../../images/logo192.png'

import EmptyResult from '../EmptyResult.js';
import Equipment from './Equipment.js';
import ProfileBasic from './ProfileBasic.js';
import ProfileDetail from './ProfileDetail.js';
import Engravings from './Engravings.js';
import Cards from './Cards.js';
import Gems from './Gems.js';
import Characters from './Characters.js';

const CharacterInfo = () => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<></>);
	const params = useParams();

	useEffect(() => {
		const call = async (characterName) => {
			const profileData = await lostarkAPI.getCharacterInfo(characterName);

			if(profileData === null){
				setSearchResult(
					<EmptyResult/>
				);
			}
			else{
				setSearchResult(
					<>
						<Container style={{backgroundImage: `url("${true ? testImage : profileData.CharacterImage}")`, backgroundRepeat: "no-repeat", backgroundPosition: "top -50px right -90px"}}>
							<ProfileBasic profileData={profileData}></ProfileBasic>

							<Equipment characterName={characterName}></Equipment>

							<Row>
								<Col style={{textAlign: "left"}}>
									<ProfileDetail profileData={profileData}></ProfileDetail>
								</Col>

								<Col style={{textAlign: "center"}}>
									<Engravings characterName={characterName}></Engravings>
								</Col>
							</Row>
							
							<Cards characterName={characterName}></Cards>

							<Gems characterName={characterName}></Gems>

							<Characters characterName={characterName}></Characters>
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

export default CharacterInfo;