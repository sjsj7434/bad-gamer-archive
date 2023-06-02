import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Placeholder from 'react-bootstrap/Placeholder';
import BoardReply from './BoardReply';

const BoardView = () => {
	const [contentCode, setContentCode] = useState(null);
	const [category, setCategory] = useState(null);
	const [contentTitle, setContentTitle] = useState("");
	const [contentData, setContentData] = useState("");
	const [contentJson, setContentJson] = useState(null);
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

	const deleteContent = useCallback(async () => {
		const contentPassword = prompt("삭제하시려면 게시글의 비밀번호를 입력해주세요");
		if(contentPassword === null){
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
	}, [contentCode, category, navigate])

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
			setContentTitle(jsonData.title);
			setContentData(jsonData.content);
			setContentJson(jsonData);
		}
	}, [contentCode])

	useEffect(() => {
		setContentCode(params.contentCode);
		setCategory(params.category)
		readContent();
	}, [readContent, params.contentCode, params.category]);

	useEffect(() => {
		if(contentJson === null){
			setRenderData(
				<>
					<div style={{margin: 10}}>
						<div>
							<h4>{category} Board</h4>

							<Placeholder as={"p"} animation="glow">
								<Placeholder style={{width: "5%"}} />{" "}<Placeholder style={{width: "45%"}} />{" "}
								<Placeholder style={{width: "10%"}} />{" "}<Placeholder style={{width: "40%"}} />{" "}
								<Placeholder style={{width: "25%"}} />{" "}<Placeholder style={{width: "35%"}} />{" "}
							</Placeholder>

							<hr style={{border: "2px solid #5893ff"}} />
						</div>

						<Placeholder as={"p"} animation="glow">
							<Placeholder style={{width: "10%"}} />{" "}<Placeholder style={{width: "35%"}} />{" "}<Placeholder style={{width: "25%"}} />{" "}
							<Placeholder style={{width: "25%"}} />{" "}<Placeholder style={{width: "35%"}} />{" "}
							<Placeholder style={{width: "45%"}} />{" "}<Placeholder style={{width: "15%"}} />{" "}<Placeholder style={{width: "15%"}} />{" "}
							<Placeholder style={{width: "45%"}} />{" "}<Placeholder style={{width: "45%"}} />{" "}
						</Placeholder>

						<BoardReply contentCode={contentCode}></BoardReply>

						<div style={{display: "flex", flexDirection: "row-reverse"}}>
							<span onClick={() => {navigate(`/lostark/board/${category}`)}}>To List</span>
							&nbsp;|&nbsp;
							<span onClick={() => {deleteContent()}}>Delete</span>
							&nbsp;|&nbsp;
							<span onClick={() => {navigate(`/lostark/board/${category}/edit/${contentCode}`)}}>Edit</span>
						</div>
					</div>
				</>
			);
		}
		else{
			setRenderData(
				<>
					<div style={{margin: 10}}>
						<div>
							{/* <p>{category} Board</p> */}
							<div style={{fontWeight: "800", fontSize: "1.5rem"}}>
								<span>{contentJson.title}</span>
							</div>
							<div style={{fontWeight: "400", fontSize: "0.8rem"}}>
								<span>
									{contentJson.writer === "" ? "익명" : contentJson.writer} ({contentJson.ip})
								</span>
								&nbsp;|&nbsp;
								<span>
									{new Date(contentJson.createdAt).toLocaleString("sv-SE")}
								</span>
							</div>
							<div style={{fontWeight: "400", fontSize: "0.8rem", color: "orange"}}>
								<span>
									{contentJson.updatedAt !== null ? `${new Date(contentJson.updatedAt).toLocaleString("sv-SE")} 수정됨` : ""}
								</span>
							</div>
							<hr style={{border: "2px solid #5893ff"}} />
						</div>

						{/*
							sanitizer libraries for HTML XSS Attacks : DOMPurify
						*/}
						<div dangerouslySetInnerHTML={{__html: contentData}} style={{overflowWrap: "anywhere", overflow: "auto"}}></div>

						<hr style={{border: "2px solid #5893ff"}} />
						<BoardReply contentCode={contentCode}></BoardReply>

						<hr style={{border: "2px solid #5893ff"}} />
						<div style={{display: "flex", flexDirection: "row-reverse"}}>
							<span onClick={() => {navigate(`/lostark/board/${category}`)}}>To List</span>
							&nbsp;|&nbsp;
							<span onClick={() => {deleteContent()}}>Delete</span>
							&nbsp;|&nbsp;
							<span onClick={() => {navigate(`/lostark/board/${category}/edit/${contentCode}`)}}>Edit</span>
						</div>
					</div>
				</>
			);
		}
	}, [category, contentTitle, contentData]);
	
	return(
		<Container style={{maxWidth: "1440px"}}>
			{renderData}
		</Container>
	);
}

export default BoardView;