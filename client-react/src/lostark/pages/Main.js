/*
	* 2023-03-30 확인해야할 것 메모
	1. nest에서 API키, DB PWD 같은 것은 어떻게 보호하는가?
*/
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import MainTable from './MainTable';
import MainAccordion from './MainAccordion';
import EmptyResult from './EmptyResult';
import * as lostarkAPI from '../js/lostarkAPI.js'

const Main = () => {
	// "searchResult"라는 새 상태 변수를 선언합니다
	const [searchResult, setSearchResult] = useState(<>Empty Area</>);
	const navigate = useNavigate();

	const getServerGuildList = async () => {
		const serverName = document.querySelector("#serverName").value;

		setSearchResult(<>Loading</>);

		const result = await lostarkAPI.getServerGuildList(serverName);
		if(result === null){
			setSearchResult(<EmptyResult />);
		}
		else{
			setSearchResult(<MainTable guilds={result} />);
		}
	}

	const getCharacterList = async () => {
		const characterNickName = document.querySelector("#characterNickName").value;
		const result = await lostarkAPI.getCharacterList(characterNickName);
		
		setSearchResult(<>Loading</>);

		if(result === null){
			setSearchResult(<EmptyResult />);
		}
		else{
			setSearchResult(<MainAccordion characters={result} />);
		}
	}

	const getCharacterInfo = async () => {
		const characterNickName = document.querySelector("#characterNickName").value;
		navigate('profile/' + characterNickName);
	}

	return(
		<div style={{ margin: '20px' }}>
			<h2>Here is Main Page</h2>

			<br/>
			<input type='text' id='serverName' defaultValue={'루페온'} />{' '}
			<button onClick={() => { getServerGuildList() }}>Call External API(Guild)</button>

			<br/><br/>
			<input type='text' id='characterNickName' defaultValue={'노돌리'} />{' '}
			<button onClick={() => { getCharacterList() }}>Call External API(Characters)</button>{' '}
			<button onClick={() => { getCharacterInfo() }}>Call External API(Character)</button>

			<br/><br/>
			{searchResult}
		</div>
	);
}

export default Main;