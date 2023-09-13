import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Placeholder from 'react-bootstrap/Placeholder';
import Button from 'react-bootstrap/Button';
import ContentReply from './ContentReply';
import LoadingModal from '../common/LoadingModal';
import * as contentBoardFetch from '../../js/contentBoardFetch';
import '../../css/View.css';

const ContentView = (props) => {
	const [contentCode, setContentCode] = useState(null);
	const [upvoteCount, setUpvoteCount] = useState(0);
	const [downvoteCount, setDownvoteCount] = useState(0);
	const [contentJson, setContentJson] = useState(null);
	const [renderData, setRenderData] = useState(<></>);
	const [loadingModalShow, setLoadingModalShow] = useState(false);
	const [loadingModalMessage, setLoadingModalMessage] = useState("");
	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		setContentCode(params.contentCode);
	}, [params.contentCode]);

	useEffect(() => {
		/**
		 * code로 게시글 정보 가져오기
		 */
		const readContent = async () => {
			const contentData = await contentBoardFetch.readContent(props.boardType, contentCode, "view");

			if(contentData === null){
				alert("존재하지 않는 게시물입니다");
				navigate(`/lostark/board/anonymous/1`);
			}
			else{
				setUpvoteCount(contentData.upvote);
				setDownvoteCount(contentData.downvote);
				setContentJson(contentData);
			}
		}

		if(contentCode !== null){
			readContent();
		}
	}, [contentCode, navigate, props.boardType]);

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
								{props.boardTitle} 게시판
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
			/**
			 * code로 게시글 삭제
			 */
			const deleteContent = async () => {
				const password = prompt("삭제하시려면 게시글의 비밀번호를 입력해주세요");
				if(password === null){
					return;
				}

				setLoadingModalShow(true);
				setLoadingModalMessage("게시글을 삭제 중입니다...");

				const sendData = {
					code: contentCode,
					password: password,
				};

				const deleteResult = await contentBoardFetch.deleteContent(props.boardType, sendData);

				if(deleteResult === true){
					navigate(`/lostark/board/anonymous/1`);
				}
				else{
					alert("게시글이 삭제되지 않았습니다\n올바른 게시글 비밀번호가 아닙니다");

					setLoadingModalShow(false);
					setLoadingModalMessage("");
				}
			}

			/**
			 * 게시글 수정으로 이동 전 비밀번호 확인
			 * 수정은 비밀번호 입력한 사람만 가능한데, 굳이 DB에서 다시 읽어와야하나?
			 */
			const editContent = async () => {
				navigate(`/lostark/board/anonymous/edit/${contentCode}`);
			}

			/**
			 * 게시글 upvote & downvote
			 */
			const voteContent = async (voteType) => {
				if(props.accountData.status === "empty" && props.boardType === "user"){
					alert("로그인이 필요합니다");
					return;
				}

				const downvoteButton = document.querySelector("#downvoteButton");
				const upvoteButton = document.querySelector("#upvoteButton");
				upvoteButton.disabled = true;
				downvoteButton.disabled = true;

				const sendData = {
					code: contentCode,
				}

				if(contentCode !== null){
					const voteResult = await contentBoardFetch.voteContent(props.boardType, voteType, sendData);

					if(voteResult === null){
						alert("오늘은 이미 해당 게시물에 추천, 비추천을 하였습니다");
					}
					else if(voteResult.upvote === null || voteResult.downvote === null){
						alert("오늘은 이미 해당 게시물에 추천, 비추천을 하였습니다");
					}
					else{
						setUpvoteCount(voteResult.upvote);
						setDownvoteCount(voteResult.downvote);
					}
					
					upvoteButton.disabled = false;
					downvoteButton.disabled = false;
				}
			}

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
								{props.boardTitle} 게시판
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
							</div>
							<div style={{fontWeight: "400", fontSize: "0.8rem"}}>
								<span>
									조회 {contentJson.view}
								</span>
								&nbsp;|&nbsp;
								<span style={{color: "green"}}>↑{upvoteCount}</span> | ↓<span style={{color: "red"}}>{downvoteCount}</span>
							</div>
							<div style={{fontWeight: "400", fontSize: "0.75rem", color: "orange"}}>
								<span>
									{contentJson.updatedAt !== null ? `${new Date(contentJson.updatedAt).toLocaleString("sv-SE")}에 게시글이 수정되었습니다` : ""}
								</span>
							</div>
							<hr style={{border: "2px solid #5893ff"}} />
						</div>

						{/*
							sanitizer libraries for HTML XSS Attacks : DOMPurify
						*/}
						<div dangerouslySetInnerHTML={{__html: contentJson.content}} style={{minHeight: "150px", overflowWrap: "anywhere", overflow: "auto", fontSize: "0.8rem"}}></div>

						<div style={{display: "flex", justifyContent: "center", marginTop: "30px"}}>
							<Button id={"upvoteButton"} onClick={() => {voteContent("upvote")}} variant="outline-success" style={{width: "30%", maxWidth: "130px", padding: "2px"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
									<path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
								</svg>
								&nbsp;
								<span style={{fontWeight: "800", fontSize: "1.1rem"}}>{upvoteCount}</span>
								<br/>
								<span style={{fontSize: "0.85rem"}}>추천</span>
							</Button>
							&nbsp;&nbsp;
							<Button id={"downvoteButton"} onClick={() => {voteContent("downvote")}} variant="outline-danger" style={{width: "30%", maxWidth: "130px", padding: "2px"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
									<path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
								</svg>
								&nbsp;
								<span style={{fontWeight: "800", fontSize: "1.1rem"}}>{downvoteCount}</span>
								<br/>
								<span style={{fontSize: "0.85rem"}}>비추천</span>
							</Button>
						</div>

						{
							props.boardType === "anonymous" || props.accountData.id === contentJson.writerID ?
							<>
								<div style={{display: "flex", justifyContent: "flex-end", marginBottom: "15px", marginTop: "30px"}}>
									<Button onClick={() => {editContent()}} variant="outline-primary" style={{padding: "2px", width: "8%", minWidth: "60px", maxWidth: "100px", fontSize: "0.8rem"}}>수정</Button>
									&nbsp;
									<Button onClick={() => {deleteContent()}} variant="outline-danger" style={{padding: "2px", width: "8%", minWidth: "60px", maxWidth: "100px", fontSize: "0.8rem"}}>삭제</Button>
									&nbsp;
									<Button onClick={() => {navigate(`/lostark/board/anonymous/1`)}} variant="outline-secondary" style={{padding: "2px", width: "8%", minWidth: "70px", maxWidth: "100px", fontSize: "0.8rem"}}>목록으로</Button>
								</div>
							</>
							:
							<>
								{props.accountData.id}, {contentJson.writerID}
							</>
						}

						<hr style={{border: "2px solid #5893ff"}} />
						
						<ContentReply accountData={props.accountData} contentCode={contentCode} />
					</div>
				</>
			);
		}
	}, [contentCode, contentJson, upvoteCount, downvoteCount, navigate, props.boardType, props.boardTitle, props.accountData]);
	
	return(
		<Container style={{maxWidth: "1200px"}}>
			{renderData}
			<LoadingModal showModal={loadingModalShow} message={loadingModalMessage}/>
		</Container>
	);
}

export default ContentView;