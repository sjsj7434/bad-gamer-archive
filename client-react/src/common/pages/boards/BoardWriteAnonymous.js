import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react';
import MyEditor from './MyEditor'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Placeholder from 'react-bootstrap/Placeholder';

const BoardWriteAnonymous = () => {
	const [writeMode, setWriteMode] = useState("");
	const [contentCode, setContentCode] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
	const [contentTitle, setContentTitle] = useState("");
	const [contentData, setContentData] = useState("");
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
	 * 게시글 생성
	 */
	const createContent = useCallback(async (sendData) => {
		const fecthOption = {
			method: "POST"
			, body: JSON.stringify(sendData)
			, headers: {"Content-Type": "application/json",}
			, credentials: "include", // Don't forget to specify this if you need cookies
		};
		const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/anonymous`, fecthOption);
		const jsonData = await parseStringToJson(jsonString);

		return jsonData;
	}, [])

	/**
	 * 게시글 정보 가져오기
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
		}
	}, [contentCode])

	/**
	 * 게시글 수정
	 */
	const updateContent = useCallback(async (sendData) => {
		const fecthOption = {
			method: "PATCH"
			, body: JSON.stringify(sendData)
			, headers: {"Content-Type": "application/json",}
			, credentials: "include", // Don't forget to specify this if you need cookies
		};
		const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/anonymous`, fecthOption);
		const jsonData = await parseStringToJson(jsonString);

		return jsonData;
	}, [contentCode])

	/**
	 * 신규 게시글 작성
	 */
	const saveEditorData = useCallback(async (editorData) => {
		const passwordElement = document.querySelector("#contentPassword");
		const titleElement = document.querySelector("#title");

		if(passwordElement.value === ""){
			alert("게시글의 수정&삭제를 위해 비밀번호를 입력해주세요");
			passwordElement.focus();
			return;
		}
		else if(titleElement.value === ""){
			alert("제목을 입력해주세요");
			titleElement.focus();
			return;
		}

		if(window.confirm("게시글을 저장하시겠습니까?") === false){
			return;
		}

		let result = await createContent({
			password: passwordElement.value,
			title: titleElement.value,
			content: editorData.content,
		});

		console.log("saveEditorData", result);

		if(result !== null){
			alert("저장되었습니다");
			navigate(`/lostark/board/anonymous/1`);
		}
		else{
			alert("문제가 발생하여 게시글을 저장할 수 없습니다");
			// localStorage.setItem("tempContentData", contentData.content); //다시 작성하는 일이 생기지 않도록?
		}
	}, [createContent, navigate])

	/**
	 * 게시글 수정
	 */
	const editEditorData = useCallback(async (editorData) => {
		const titleElement = document.querySelector("#title");

		if(titleElement.value === ""){
			alert("제목을 입력해주세요");
			titleElement.focus();
			return;
		}

		if(window.confirm("게시글을 수정하시겠습니까?") === false){
			return;
		}

		let result = await updateContent({
			code: contentCode,
			title: titleElement.value,
			content: editorData.content,
		});

		console.log("editEditorData", result);

		if(result !== null){
			alert("수정되었습니다");
			navigate(`/lostark/board/anonymous/1`);
		}
		else{
			alert("문제가 발생하여 게시글을 수정할 수 없습니다");
			// localStorage.setItem("tempContentData", contentData.content); //다시 작성하는 일이 생기지 않도록?
		}
	}, [createContent, navigate])

	useEffect(() => {
		console.log(`useEffect 3`)
		if(params.contentCode !== undefined){
			setContentCode(params.contentCode);
			setWriteMode("edit");
		}
		else{
			setContentCode(null);
			setWriteMode("new");
		}
	}, [params.contentCode])

	useEffect(() => {
		console.log(`useEffect 2`)
		readContent();
	}, [contentCode, readContent])

	useEffect(() => {
		console.log(`useEffect 1 : ${writeMode}`)
		if(writeMode === "edit"){
			if(contentData === "" && contentTitle === ""){
				setRenderData(
					<>
						<Placeholder as="p" animation="glow">
							<Placeholder xs={12} />
							<Placeholder xs={12} />
							<Placeholder xs={12} />
						</Placeholder>
						<Placeholder as="p" animation="glow">
							<Placeholder xs={12} />
							<Placeholder xs={12} />
						</Placeholder>
					</>
				);
			}
			else{
				setRenderData(
					<>
						* Board : 익명
						<br />
						* Mode : 수정
						<Form.Control id="title" type="text" placeholder="제목" style={{marginBottom: "10px"}} defaultValue={contentTitle} />
						<MyEditor savedData={contentData} writeMode={writeMode} saveFunction={(editorData) => {saveEditorData(editorData)}}></MyEditor>
					</>
				);
			}
		}
		else if(writeMode === "new"){
			setRenderData(
				<>
					* Board : 익명
					<br />
					* Mode : 신규
					<Row className="g-2">
						<Col>
							<Form.Control id="writer" type="text" placeholder="작성자" defaultValue={"익명"} style={{marginBottom: "10px"}} readOnly />
						</Col>
						<Col>
							<Form.Control id="contentPassword" type="password" placeholder="비밀번호" maxLength={20} style={{marginBottom: "10px"}} />
						</Col>
					</Row>
					<Form.Control id="title" type="text" placeholder="제목" style={{marginBottom: "10px"}} defaultValue={""} />
					<MyEditor savedData={""} writeMode={writeMode} saveFunction={(editorData) => {editEditorData(editorData)}}></MyEditor>
				</>
			)
		}
	}, [writeMode, contentTitle, contentData, saveEditorData, editEditorData])
	
	return(
		<Container style={{maxWidth: "1440px"}}>
			{renderData}
		</Container>
	);
}

export default BoardWriteAnonymous;