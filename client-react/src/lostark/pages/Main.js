/*
	* 2023-03-30 확인해야할 것 메모
	1. nest에서 API키, DB PWD 같은 것은 어떻게 보호하는가?
*/
import { useNavigate } from "react-router-dom";
import * as dbActions from '../js/dbActions.js'

const Main = () => {
	const navigate = useNavigate();

	const postTest = async () => {
		const sendData = {
			id: 'helloo',
			age: 12,
		};

		const result = await dbActions.postTest(sendData);
		if(result === null){
			console.log(0);
		}
		else{
			console.log(1);
		}
	}

	const putTest = async () => {
		const sendData = {
			code: 10,
			id: 'testnewname',
		};

		const result = await dbActions.putTest(sendData);
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
			<button onClick={() => { postTest() }}>postTest</button>

			<br/><br/>
			<button onClick={() => { putTest() }}>putTest</button>
		</div>
	);
}

export default Main;