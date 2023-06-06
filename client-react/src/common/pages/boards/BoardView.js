import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Placeholder from 'react-bootstrap/Placeholder';
import BoardReply from './BoardReply';
import LoadingModal from '../common/LoadingModal';

const BoardView = () => {
	const [contentCode, setContentCode] = useState(null);
	const [category, setCategory] = useState(null);
	const [contentTitle, setContentTitle] = useState("");
	const [contentData, setContentData] = useState("");
	const [contentJson, setContentJson] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
	const [loadingModalShow, setLoadingModalShow] = useState(false);
	const [loadingModalMessage, setLoadingModalMessage] = useState("");
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

		setLoadingModalShow(true);
		setLoadingModalMessage("게시글을 삭제 중입니다...");

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
			navigate(`/lostark/board/${category}`);
		}
		else{
			alert("게시글이 삭제되지 않았습니다\n올바른 게시글 비밀번호가 아닙니다");

			setLoadingModalShow(false);
			setLoadingModalMessage("");
		}
	}, [contentCode, category, navigate])

	/**
	 * 게시글 수정으로 이동 전 비밀번호 확인
	 * 수정은 비밀번호 입력한 사람만 가능한데, 굳이 DB에서 다시 읽어와야하나?
	 */
	const editContent = async () => {
		navigate(`/lostark/board/${category}/edit/${contentCode}`);
	}

	/**
	 * code로 게시글 정보 가져오기
	 */
	const readContent = useCallback(async () => {
		if(contentCode !== null){
			const fecthOption = {
				method: "GET"
				, headers: {"Content-Type": "application/json",}
				, credentials: "include", // Don't forget to specify this if you need cookies
			};
			const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/view/${contentCode}?type=view`, fecthOption);
			const jsonData = await parseStringToJson(jsonString);

			console.log("readContent", jsonData);

			if(jsonData === null){
				alert("존재하지 않는 게시물입니다");
				navigate(`/lostark/board/${category}/1`);
			}
			else{
				setContentTitle(jsonData.title);
				setContentData(jsonData.content);
				setContentJson(jsonData);
			}
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
							<span style={{color: "gray", fontSize: "0.92rem"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard2-data-fill" viewBox="0 0 16 16">
									<path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z"/>
									<path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5ZM10 7a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7Zm-6 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1Zm4-3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Z"/>
								</svg>
								&nbsp;
								익명 게시판
							</span>

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
						<hr style={{border: "2px solid #5893ff"}} />

						<Placeholder as={"p"} animation="glow">
							<Placeholder style={{width: "17%"}} />{" "}<Placeholder style={{width: "8%"}} />{" "}<Placeholder style={{width: "18%"}} />{" "}<Placeholder style={{width: "34%"}} /><br/>
							<Placeholder style={{width: "9%"}} />{" "}<Placeholder style={{width: "15%"}} />{" "}<Placeholder style={{width: "21%"}} />{" "}<Placeholder style={{width: "7%"}} />{" "}<Placeholder style={{width: "7%"}} /><br/>
							<Placeholder style={{width: "19%"}} />{" "}<Placeholder style={{width: "6%"}} />{" "}<Placeholder style={{width: "12%"}} />{" "}<Placeholder style={{width: "43%"}} /><br/>
							<Placeholder style={{width: "14%"}} />{" "}<Placeholder style={{width: "25%"}} />{" "}<Placeholder style={{width: "12%"}} />{" "}<Placeholder style={{width: "16%"}} /><br/>
							<Placeholder style={{width: "9%"}} />{" "}<Placeholder style={{width: "15%"}} />{" "}<Placeholder style={{width: "21%"}} />{" "}<Placeholder style={{width: "7%"}} />{" "}<Placeholder style={{width: "7%"}} />
						</Placeholder>
					</div>
				</>
			);
		}
		else{
			setRenderData(
				<>
					<div style={{margin: 10}}>
						<div>
							<span style={{color: "gray", fontSize: "0.92rem"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard2-data-fill" viewBox="0 0 16 16">
									<path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z"/>
									<path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5ZM10 7a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7Zm-6 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1Zm4-3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Z"/>
								</svg>
								&nbsp;
								익명 게시판
							</span>

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
								&nbsp;|&nbsp;
								<span>
									조회 {contentJson.view}
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

						<div style={{display: "flex", justifyContent: "center"}}>
							<button>{contentJson.goodPoint} / UP</button>
							&nbsp;
							<button>{contentJson.badPoint} / DOWN</button>
						</div>

						<hr style={{border: "2px solid #5893ff"}} />
						<BoardReply contentCode={contentCode}></BoardReply>

						<hr style={{border: "2px solid #5893ff"}} />
						<div style={{display: "flex", flexDirection: "row-reverse"}}>
							<span onClick={() => {navigate(`/lostark/board/${category}/1`)}}>To List</span>
							&nbsp;|&nbsp;
							<span onClick={() => {deleteContent()}}>Delete</span>
							&nbsp;|&nbsp;
							<span onClick={() => {editContent()}}>Edit</span>
						</div>
					</div>
				</>
			);
		}
	}, [category, contentTitle, contentData]);
	
	return(
		<Container style={{maxWidth: "1440px"}}>
			{renderData}
			<LoadingModal showModal={loadingModalShow} message={loadingModalMessage}/>
		</Container>
	);
}

export default BoardView;