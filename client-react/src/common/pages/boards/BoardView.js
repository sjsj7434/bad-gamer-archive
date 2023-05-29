import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';

const BoardView = () => {
	const [contentCode, setContentCode] = useState(null);
	const [category, setCategory] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
	const navigate = useNavigate();
	const params = useParams();

	const deleteContent = async () => {
		const contentPassword = prompt("게시글의 비밀번호를 입력해주세요");
		if(contentPassword === null){
			return;
		}

		if(window.confirm("게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다") === false){
			return;
		}

		const sendData = {
			contentPassword: contentPassword
		};
		
		const fecthOption = {
			method: "DELETE"
			, body: JSON.stringify(sendData)
			, headers: {"Content-Type": "application/json",}
		};
		const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/${contentCode}`, fecthOption);
		const jsonData = await parseStringToJson(jsonString);

		console.log("deleteContent", jsonData);

		if(jsonData === true){
			alert("게시글이 삭제되었습니다");
			navigate(`/lostark/board/${category}`);
		}
		else{
			alert("게시글이 삭제되지 않았습니다\n올바른 게시글 비밀번호가 아닙니다");
		}
	}

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
							<h4>{category} Board</h4>
							<h2>{jsonData.title}</h2>
							<hr></hr>
						</div>

						{/*
							sanitizer libraries for HTML XSS Attacks : DOMPurify
						*/}
						<div dangerouslySetInnerHTML={{__html: jsonData.content}}></div>

						<div style={{display: "flex", flexDirection: "row-reverse"}}>
							<span onClick={() => {navigate(`/lostark/board/${category}`)}}>To List</span>
							&nbsp;|&nbsp;
							<span onClick={() => {deleteContent()}}>Delete</span>
							&nbsp;|&nbsp;
							<span onClick={() => {navigate(`/lostark/board/${category}`)}}>Edit</span>
						</div>
					</div>
				</>
			);
		}
	}, [contentCode, category, navigate])

	useEffect(() => {
		setContentCode(params.contentCode);
		setCategory(params.category)
		readContent();
	}, [readContent, params.contentCode, params.category]);
	
	return(
		<Container style={{maxWidth: "1440px"}}>
			{renderData}
		</Container>
	);
}

export default BoardView;