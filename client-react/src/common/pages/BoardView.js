import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import MyEditorView from './MyEditorView';

const BoardView = () => {
	const [contentData, setContentData] = useState(null);
	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		readContent(params.contentCode);
	}, [])

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
	const readContent = async (contentCode) => {
		const fecthOption = {
			method: "GET"
			, headers: {"Content-Type": "application/json",}
			, credentials: "include", // Don't forget to specify this if you need cookies
		};
		const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/free/view/${contentCode}`, fecthOption);
		const jsonData = await parseStringToJson(jsonString);

		console.log("readContent", jsonData);
		setContentData(jsonData);
	}
	
	return(
		<>
			{
				contentData === null ?
					<></>
					:
					<>
						<div>
							<h2>{contentData.title}</h2>
							<hr></hr>
							<MyEditorView contentData={contentData}></MyEditorView>
							<hr></hr>
						</div>

						{/*
							sanitizer libraries for HTML XSS Attacks : DOMPurify
						 */}
						<div dangerouslySetInnerHTML={{__html: contentData.content}}></div>

						<div>
							<h5>Replies</h5>
							<div>
								<textarea style={{width: "100%"}}></textarea>
							</div>
							<div>
								<p>ACE : hello, i am the hero</p>
							</div>
							<div>
								<p>CAT : sister, you are the one</p>
							</div>
							<hr></hr>
						</div>

						<div>
							<h5>List</h5>
							<div>
								<p>Did you see that? LOL</p>
							</div>
							<div>
								<p>Why my cat died yestderday, i found it</p>
							</div>
							<div>
								<p>Crazy Dog in my room</p>
							</div>
							<hr></hr>
						</div>

						<div style={{display: "flex", flexDirection: "row-reverse"}}>
							<span onClick={() => {navigate("/lostark/board/free/write")}}>Write</span>
							&nbsp;&nbsp;|&nbsp;&nbsp;
							<span onClick={() => {navigate("/lostark")}}>To Main</span>
						</div>
					</>
			}
		</>
	);
}

export default BoardView;