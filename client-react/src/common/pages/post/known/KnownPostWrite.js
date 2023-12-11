import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react';
import MyEditor from '../MyEditor'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Placeholder from 'react-bootstrap/Placeholder';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import LoadingModal from '../../common/LoadingModal';
import * as postFetch from '../../../js/postFetch';
import '../../../css/View.css';

const KnownPostWrite = (props) => {
	const [writeMode, setWriteMode] = useState("");
	const [contentCode, setContentCode] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
	const [contentTitle, setContentTitle] = useState("");
	const [contentData, setContentData] = useState("");
	const [identity, setIdentity] = useState(false);
	const [editorSizeByte, setEditorSizeByte] = useState(0);
	const [loadingModalShow, setLoadingModalShow] = useState(false);
	const [loadingModalMessage, setLoadingModalMessage] = useState("");
	const params = useParams();
	const navigate = useNavigate();
	const [editorObject, setEditorObject] = useState(null);

	const editorMaxKB = 30;

	/**
	 * 신규 게시글 작성
	 */
	const saveEditorData = useCallback(async () => {
		const titleElement = document.querySelector("#title");

		if(titleElement.value === ""){
			alert("제목을 입력해주세요");
			titleElement.focus();
			return;
		}
		else if(editorSizeByte >= editorMaxKB){
			alert("작성된 글의 용량이 너무 큽니다");
			return;
		}
		else if(window.confirm("게시글을 저장하시겠습니까?") === false){
			return;
		}

		setLoadingModalShow(true);
		setLoadingModalMessage("게시글을 저장 중입니다...");

		const editorContet = editorObject.getData();

		const sendData = {
			title: titleElement.value,
			content: editorContet,
			hasImage: editorContet.indexOf("<img") > -1 ? true : false,
		};

		const createResult = await postFetch.createContent("known", sendData);

		if(createResult.createdCode === 0){
			if(createResult.status === "long_title"){
				alert("제목이 너무 길어 저장할 수 없습니다(최대 100자)");
				setLoadingModalShow(false);
			}
			else if(createResult.status === "long_content"){
				alert(`작성된 글의 용량이 너무 커 저장할 수 없습니다(최대 ${editorMaxKB}KB)`);
				setLoadingModalShow(false);
			}
			else if(createResult.status === "need_login"){
				alert("로그인이 필요합니다");
				setLoadingModalShow(false);
				navigate("/accounts/login");
			}
		}
		else{
			navigate(`/lostark/post/known/view/${createResult.createdCode}`);
		}
	}, [editorObject, editorSizeByte, editorMaxKB, navigate])

	/**
	 * 게시글 수정
	 */
	const editEditorData = useCallback(async () => {
		const titleElement = document.querySelector("#title");

		if(titleElement.value === ""){
			alert("제목을 입력해주세요");
			titleElement.focus();
			return;
		}

		console.log(editorSizeByte, editorMaxKB, editorSizeByte >= editorMaxKB);
		if(editorSizeByte >= editorMaxKB){
			alert("작성된 글의 용량이 너무 큽니다");
			return;
		}

		if(window.confirm("게시글을 수정하시겠습니까?") === false){
			return;
		}

		setLoadingModalShow(true);
		setLoadingModalMessage("게시글을 수정 중입니다...");

		const editorContet = editorObject.getData();

		const sendData = {
			code: contentCode,
			title: titleElement.value,
			content: editorContet,
			hasImage: editorContet.indexOf("<img") > -1 ? true : false,
		};

		let result = await postFetch.updateContent("known", sendData);

		if(result === null){
			alert("문제가 발생하여 게시글을 수정할 수 없습니다(1)");
			setLoadingModalShow(false);
			setLoadingModalMessage("");
		}
		else if(result === undefined){
			alert("문제가 발생하여 게시글을 수정할 수 없습니다(2)");
			setLoadingModalShow(false);
			setLoadingModalMessage("");
		}
		else{
			//정상적으로 처리 성공
			navigate(`/lostark/post/known/view/${contentCode}`);
		}
	}, [contentCode, editorObject, editorSizeByte, editorMaxKB, navigate])

	useEffect(() => {
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
		/**
		 * 게시글 정보 가져오기
		 */
		const readContent = async () => {
			const readResult = await postFetch.readContent("known", contentCode, "edit");
			const contentData = readResult.contentData;
	
			setContentTitle(contentData.title);
			setContentData(contentData.content);
		}

		if(contentCode !== null && identity === true){
			readContent();
		}
	}, [contentCode, identity])

	useEffect(() => {
		/**
		 * 수정 진입 전에 게시글 작성자 정보 확인
		 */
		const checkBeforeEdit = async () => {
			setLoadingModalShow(true);
			setLoadingModalMessage("작성자 정보 확인 중...");

			const sendData = {
				code: contentCode,
			};
			
			const checkResult = await postFetch.checkBeforeEdit("known", sendData);

			if(checkResult === true){
				setIdentity(true);
			}
			else{
				alert("작성자가 아닙니다");
				window.history.back();
			}

			setLoadingModalShow(false);
			setLoadingModalMessage("");
		}

		if(writeMode === "new"){
			setRenderData(
				<>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", marginTop: "30px"}}>
						자유 게시판
						&nbsp;
						<Button onClick={() => {saveEditorData()}} variant="primary" style={{width: "20%", minWidth: "70px", maxWidth: "100px", fontSize: "0.8rem"}}>저장</Button>
					</div>

					<Form.Control id="title" type="text" placeholder="제목" style={{marginBottom: "10px", fontSize: "0.8rem"}} defaultValue={""} maxLength={100} />
					
					<MyEditor
						editorMode={"write"}
						savedData={""}
						editorMaxKB={editorMaxKB}
						setEditor={(editor) => {setEditorObject(editor)}}
						setEditorSizeByte={(size) => {setEditorSizeByte(size)}}
					/>

					<ProgressBar
						now={parseInt((editorSizeByte / editorMaxKB) * 100, 10)} label={`${parseInt((editorSizeByte / editorMaxKB) * 100, 10)} %`}
						variant="success"
						style={{ height: "2.5rem", fontSize: "1rem", backgroundColor: "lightgray" }}
					/>

					<div style={{display: "flex", justifyContent: "flex-end", marginBottom: "15px", marginTop: "30px"}}>
						<Button onClick={() => {if(window.confirm("작성한 내용을 전부 비우시겠습니까?") === true){editorObject.setData("")}}} variant="danger" style={{width: "20%", minWidth: "70px", maxWidth: "100px", fontSize: "0.8rem"}}>비우기</Button>
						&nbsp;
						<Button onClick={() => {if(window.confirm("작성한 내용을 저장하지않고 나가시겠습니까?") === true){navigate("/lostark/post/known/1")}}} variant="secondary" style={{width: "20%", minWidth: "70px", maxWidth: "100px", fontSize: "0.8rem"}}>나가기</Button>
						&nbsp;
						<Button onClick={() => {saveEditorData()}} variant="primary" style={{width: "20%", minWidth: "70px", maxWidth: "100px", fontSize: "0.8rem"}}>저장</Button>
					</div>
				</>
			)
		}
		else if(writeMode === "edit"){
			if(identity !== true){
				checkBeforeEdit()
			}
			else{
				if(contentData === "" && contentTitle === ""){
					setRenderData(
						<>
							<Placeholder as={"p"} animation="glow">
								<Placeholder style={{width: "10%"}} />{" "}<Placeholder style={{width: "35%"}} />{" "}<Placeholder style={{width: "25%"}} />{" "}
								<Placeholder style={{width: "10%"}} />{" "}<Placeholder style={{width: "35%"}} />{" "}<Placeholder style={{width: "25%"}} />{" "}
							</Placeholder>
							<Placeholder as={"p"} animation="glow">
								<Placeholder style={{width: "30%"}} />{" "}<Placeholder style={{width: "55%"}} />{" "}
							</Placeholder>
							<Placeholder as={"p"} animation="glow">
								<Placeholder style={{width: "100%", height: "350px"}} />
							</Placeholder>
							<Placeholder as={"p"} animation="glow">
								<Placeholder style={{width: "10%"}} />{" "}<Placeholder style={{width: "10%"}} />
							</Placeholder>
						</>
					);
				}
				else{
					setRenderData(
						<>
							유저 게시판
							<br />
							<Form.Control id="title" type="text" placeholder="제목" style={{marginBottom: "10px", fontSize: "0.8rem"}} defaultValue={contentTitle} />

							<MyEditor
								editorMode={"write"}
								savedData={contentData}
								editorMaxKB={editorMaxKB}
								setEditor={(editor) => {setEditorObject(editor)}}
								setEditorSizeByte={(size) => {setEditorSizeByte(size)}}
							/>

							<ProgressBar
								now={parseInt((editorSizeByte / editorMaxKB) * 100, 10)} label={`${parseInt((editorSizeByte / editorMaxKB) * 100, 10)} %`}
								variant="success"
								style={{ height: "2.5rem", fontSize: "1rem", backgroundColor: "lightgray" }}
							/>

							<div style={{display: "flex", justifyContent: "flex-end", marginBottom: "15px", marginTop: "30px"}}>
								<Button
									onClick={() => {editEditorData()}}
									variant="outline-primary"
									style={{width: "20%", minWidth: "60px", maxWidth: "200px", fontSize: "0.8rem"}}
								>
									수정
								</Button>
								&nbsp;
								<Button
									onClick={() => {if(window.confirm("내용을 수정하지않고 나가시겠습니까?") === true){navigate(`/lostark/post/known/view/${contentCode}`)}}}
									variant="outline-secondary"
									style={{width: "20%", minWidth: "60px", maxWidth: "200px", fontSize: "0.8rem"}}
								>
									취소
								</Button>
							</div>
						</>
					);
				}
			}
		}
	}, [writeMode, contentCode, contentTitle, contentData, identity, editorObject, editorSizeByte, saveEditorData, editEditorData, navigate, props.accountData.id])
	
	return(
		<Container style={{maxWidth: "1000px"}}>
			{renderData}
			<LoadingModal showModal={loadingModalShow} message={loadingModalMessage}/>
		</Container>
	);
}

export default KnownPostWrite;