import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";

const BoardView = () => {
	const [contentCode, setContentCode] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
	const navigate = useNavigate();
	const params = useParams();

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
	const readContent = useCallback(async () => {
		if(contentCode !== null){
			const fecthOption = {
				method: "GET"
				, headers: {"Content-Type": "application/json",}
				, credentials: "include", // Don't forget to specify this if you need cookies
			};
			const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/view/${contentCode}`, fecthOption);
			const jsonData = await parseStringToJson(jsonString);

			console.log("readContent", jsonData);

			setRenderData(
				<>
					<div style={{margin: 10}}>
						<div>
							<h2>{params.category}</h2>
							<h2>{jsonData.title}</h2>
							<hr></hr>
						</div>

						{/*
							sanitizer libraries for HTML XSS Attacks : DOMPurify
						*/}
						<div dangerouslySetInnerHTML={{__html: jsonData.content}}></div>

						<div style={{display: "flex", flexDirection: "row-reverse"}}>
							<span onClick={() => {navigate(`/lostark/board/${params.category}`)}}>To List</span>
						</div>
					</div>
				</>
			);
		}
	}, [contentCode])

	useEffect(() => {
		setContentCode(params.contentCode);
		readContent();
	}, [readContent, params.contentCode]);
	
	return(
		<>
			{renderData}
		</>
	);
}

export default BoardView;