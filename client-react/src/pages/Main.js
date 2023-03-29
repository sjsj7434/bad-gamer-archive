/*
	* 2023-03-29 확인해야할 것 메모
	1. react에서 innerHTML을 쓰는 것이 옳은가?
		답변 : setTestRender를 보아라

	2. nest에서 API키, DB PWD 같은 것은 어떻게 보호하는가?
*/
import { useState } from 'react';
import MainTable from './MainTable';
import MainTabs from './MainTabs';
import MainCards from './MainCards';

const Main = () => {
	// "testRender"라는 새 상태 변수를 선언합니다
	const [testRender, setTestRender] = useState(<>Empty Area</>);
	
	async function callMine(){
		const result = await fetch(`${process.env.REACT_APP_SERVER}/hello`);
		console.log(result);
		const jsonResult = await result.json();

		alert(jsonResult.message);
	}

	async function getServerGuildList(){
		const serverName = document.querySelector("#serverName").value;
		const result = await fetch(`${process.env.REACT_APP_SERVER}/guilds/${encodeURIComponent(serverName)}`);
		console.log(result);

		const jsonResult = await result.json();
		console.log(jsonResult);
		if(jsonResult.statusCode === 500){
			alert('Error!\nMaybe you need to edit api token or change url');
			return;
		}

		const ajaxArea = document.querySelector("#ajaxArea");
		ajaxArea.innerHTML = '';
		
		for(const element of jsonResult.message){
			ajaxArea.innerHTML += `<b>${element.GuildName}</b> => ${element.GuildMessage}<br/>`;
		}

		setTestRender(<MainTable />);
	}

	async function getCharacterList(){
		const characterNickName = document.querySelector("#characterNickName").value;
		const result = await fetch(`${process.env.REACT_APP_SERVER}/characters/${encodeURIComponent(characterNickName)}`);
		console.log(result);

		const jsonResult = await result.json();
		console.log(jsonResult);
		if(jsonResult.statusCode === 500){
			alert('Error!\nMaybe you need to edit api token or change url');
			return;
		}

		const ajaxArea = document.querySelector("#ajaxArea");
		ajaxArea.innerHTML = '';
		
		for(const element of jsonResult.message){
			ajaxArea.innerHTML += `<b>${element.ServerName}</b> => ${element.CharacterName} (${element.ItemAvgLevel})<br/>`;
		}

		setTestRender(<MainTabs />);
	}

	async function getCharacterInfo(){
		const characterNickName = document.querySelector("#characterNickName").value;
		const result = await fetch(`${process.env.REACT_APP_SERVER}/character/${encodeURIComponent(characterNickName)}`);
		console.log(result);

		const jsonResult = await result.json();
		console.log(jsonResult);
		if(jsonResult.statusCode === 500){
			alert('Error!\nMaybe you need to edit api token or change url');
			return;
		}

		const ajaxArea = document.querySelector("#ajaxArea");
		const element = jsonResult.message
		ajaxArea.innerHTML = '';
		ajaxArea.innerHTML += `<b>${element.CharacterName}</b> => ${element.CharacterClassName} (${element.ItemAvgLevel})<br/><img width='80' src='${element.CharacterImage}'/>`;

		setTestRender(<MainCards />);
	}

	return(
		<div style={{ margin: '20px' }}>
			<h2>Here is Main Page</h2>

			<button onClick={() => { callMine() }}>Call My API</button>

			<br/><br/>
			<input type='text' id='serverName' defaultValue={'루페온'} />{' '}
			<button onClick={() => { getServerGuildList() }}>Call External API(Guild)</button>

			<br/><br/>
			<input type='text' id='characterNickName' defaultValue={'노돌리'} />{' '}
			<button onClick={() => { getCharacterList() }}>Call External API(Characters)</button>{' '}
			<button onClick={() => { getCharacterInfo() }}>Call External API(Character)</button>

			<div id='ajaxArea'></div>
			
			{testRender}
		</div>
	);
}

export default Main;