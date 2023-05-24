import MyEditor from './MyEditor'
import Form from 'react-bootstrap/Form';

const BoardWrite = () => {
	/**
	 * 자주 사용하는 fetch 템플릿
	 * @param {string} destination fetch url, 목적지
	 * @returns {object} 가져온 정보 JSON
	 */
	const parseStringToJson = async (jsonString) => {
		if(jsonString === null){
			return null;
		}
		else if(jsonString.status === 500){
			alert("Error!\nCan not get data");
			return null;
		}
		else{
			const jsonResult = await jsonString.json();

			if(jsonResult.statusCode === 500){
				return null;
			}
			else if(jsonResult.data === null){
				return null;
			}
			else{
				return jsonResult.data;
			}
		}
	}

	/**
	 * 입력한 캐릭터 이름의 기본 정보를 가져온다
	 * @returns {object} 가져온 캐릭터 정보 JSON
	 */
	const createContent = async (sendData) => {
		const fecthOption = {
			method: "POST"
			, body: JSON.stringify(sendData)
			, headers: {"Content-Type": "application/json",}
			, credentials: "include", // Don't forget to specify this if you need cookies
		};
		const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/free/content`, fecthOption);
		const jsonData = await parseStringToJson(jsonString);

		return jsonData;
	}
	const saveEditorData = async (contentData) => {
		console.log("func called : saveEditorData");
		let result = await createContent({
			title: document.querySelector("#title").value
			, content: contentData.content
		});

		console.log("saveEditorData", result);
		alert("saved!");
	}
	
	return(
		<>
			<div style={{ margin: "20px" }}>
				<Form.Control id="title" type="text" placeholder="title" style={{marginBottom: "10px"}} />
				<MyEditor saveContent={(contentData) => {saveEditorData(contentData)}}></MyEditor>
			</div>
		</>
	);
}

export default BoardWrite;