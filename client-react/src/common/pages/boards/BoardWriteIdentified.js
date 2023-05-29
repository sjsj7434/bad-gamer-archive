import { useNavigate, useParams } from "react-router-dom";
import MyEditor from './MyEditor'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BoardWriteIdentified = () => {
	const params = useParams();
	const navigate = useNavigate();

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
		const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/identified`, fecthOption);
		const jsonData = await parseStringToJson(jsonString);

		return jsonData;
	}

	const saveEditorData = async (contentData) => {
		console.log("func called : saveEditorData");
		const titleElement = document.querySelector("#title");

		if(titleElement.value === ""){
			alert("제목을 입력해주세요");
			titleElement.focus();
			return;
		}

		if(window.confirm("게시글을 저장하시겠습니까?") === false){
			return;
		}

		let result = await createContent({
			title: titleElement.value,
			content: contentData.content
		});

		console.log("saveEditorData", result);

		if(result !== null){
			alert("저장되었습니다");
			navigate(`/lostark/board/identified/1`);
		}
		else{
			alert("문제가 발생하여 게시글을 저장할 수 없습니다");
			// localStorage.setItem("tempContentData", contentData.content); //다시 작성하는 일이 생기지 않도록?
		}
	}
	
	return(
		<Container style={{maxWidth: "1440px"}}>
			* Board : identified
			<Form.Control id="title" type="text" placeholder="제목" style={{marginBottom: "10px"}} />
			<MyEditor saveContent={(contentData) => {saveEditorData(contentData)}}></MyEditor>
		</Container>
	);
}

export default BoardWriteIdentified;