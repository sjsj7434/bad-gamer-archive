/*
	* 2023-03-30 확인해야할 것 메모
	1. nest에서 API키, DB PWD 같은 것은 어떻게 보호하는가?
*/
import { useNavigate } from "react-router-dom";
import * as accountsAction from '../js/accountsAction.js'

const Main = () => {
	const navigate = useNavigate();

	const postTest = async () => {
		const sendData = {
			id: 'helloo',
			age: parseFloat(Math.random().toFixed(2).replace('0.', '')),
		};

		const result = await accountsAction.postTest(sendData);
		if(result === null){
			console.log(0);
		}
		else{
			console.log(1);
		}
	}

	const putTest = async () => {
		const sendData = {
			age: parseFloat(Math.random().toFixed(2).replace('0.', '')),
			id: 'testnewname',
		};

		const result = await accountsAction.putTest(sendData);
		if(result === null){
			console.log(0);
		}
		else{
			console.log(1);
		}
	}

	const deleteTest = async () => {
		const code = document.querySelector("#code").value;
		const sendData = {
			code: code,
		};

		const result = await accountsAction.deleteTest(sendData);
		if(result === null){
			console.log(0);
		}
		else{
			console.log(1);
		}
	}

	const getCharacterInfo = async () => {
		const characterNickName = document.querySelector("#characterNickName").value;
		navigate('character/' + characterNickName);
	}

	return(
		<div style={{ margin: '20px' }}>
			<h2>Here is Main Page</h2>

			<br/><br/>
			<input type='text' id='characterNickName' defaultValue={'노돌리'} />{' '}
			<button onClick={() => { getCharacterInfo() }}>API(Character)</button>

			<br/><br/>
			<input type='text' id='code' placeholder="code" defaultValue={''} />{' '}
			<button onClick={() => { postTest() }}>postTest</button>
			<button onClick={() => { putTest() }}>putTest</button>
			<button onClick={() => { deleteTest() }}>deleteTest</button>
		</div>
	);
}

export default Main;