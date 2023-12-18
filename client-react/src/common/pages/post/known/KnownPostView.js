import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Placeholder from 'react-bootstrap/Placeholder';
import Button from 'react-bootstrap/Button';
import KnownReply from './KnownReply';
import LoadingModal from '../../common/LoadingModal';
import * as postFetch from '../../../js/postFetch';
import '../../../css/View.css';
import MyEditor from '../MyEditor';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as postCommon from "../../../js/postCommon";
import NicknameMenu from './NicknameMenu';

const KnownPostView = (props) => {
	const [postCode, setPostCode] = useState(null);
	const [upvoteCount, setUpvoteCount] = useState(0);
	const [downvoteCount, setDownvoteCount] = useState(0);
	const [contentJson, setContentJson] = useState(null);
	const [isContentWriter, setIsContentWriter] = useState(false);
	const [renderData, setRenderData] = useState(<></>);
	const [loadingModalShow, setLoadingModalShow] = useState(false);
	const [loadingModalMessage, setLoadingModalMessage] = useState("");
	const [voteHistory, setVoteHistory] = useState(<></>);
	const [showVote, setShowVote] = useState(false);
	const [voteModalTitle, setVoteModalTitle] = useState("");
	const navigate = useNavigate();
	const params = useParams();

	const closeVoteModal = () => setShowVote(false);
	const showVoteModal = () => setShowVote(true);

	useEffect(() => {
		setPostCode(params.postCode);
	}, [params.postCode]);

	useEffect(() => {
		/**
		 * code로 게시글 정보 가져오기
		 */
		const getContentData = async () => {
			const readResult = await postFetch.readContent("known", postCode);
			const contentData = readResult.contentData;

			if(contentData === null){
				alert("존재하지 않는 게시물입니다");
				navigate(`/lostark/post/known/1`);
			}
			else{
				setUpvoteCount(contentData.upvote);
				setDownvoteCount(contentData.downvote);
				setIsContentWriter(readResult.isWriter);
				setContentJson(contentData);
			}
		}

		if(postCode !== null){
			getContentData();
		}
	}, [postCode, navigate]);

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
								<Placeholder style={{width: "10%"}} />{" "}<Placeholder style={{width: "40%"}} />{" "}
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
				const sendData = {
					code: postCode,
				};

				if(window.confirm("게시글을 삭제하시겠습니까?") === false){
					return;
				}

				setLoadingModalShow(true);
				setLoadingModalMessage("게시글을 삭제 중입니다...");

				const deleteResult = await postFetch.deleteContent("known", sendData);

				if(deleteResult === true){
					navigate(`/lostark/post/known/1`);
				}
				else{
					alert("정보가 올바르지않아 게시글을 삭제할 수 없습니다");

					setLoadingModalShow(false);
					setLoadingModalMessage("");
				}
			}

			/**
			 * 게시글 수정으로 이동 전 비밀번호 확인
			 * 수정은 비밀번호 입력한 사람만 가능한데, 굳이 DB에서 다시 읽어와야하나?
			 */
			const editContent = async () => {
				navigate(`/lostark/post/known/edit/${postCode}`);
			}

			/**
			 * 게시글 추천
			 */
			const upvoteContent = async () => {
				if(props.accountData.status !== "login"){
					alert("자유 게시판 추천은 로그인이 필요합니다");
					return;
				}

				const downvoteButton = document.querySelector("#downvoteButton");
				const upvoteButton = document.querySelector("#upvoteButton");
				upvoteButton.disabled = true;
				downvoteButton.disabled = true;

				const sendData = {
					code: postCode,
				}

				if(postCode !== null){
					const voteResult = await postFetch.upvoteContent("known", sendData);

					if(voteResult === null){
						return;
					}
					else if(voteResult.isVotable === false){
						alert("이미 게시물에 추천 또는 비추천을 하였습니다");
					}
					else{
						setUpvoteCount(voteResult.upvote);
						setDownvoteCount(voteResult.downvote);
					}
					
					upvoteButton.disabled = false;
					downvoteButton.disabled = false;
				}
			}

			/**
			 * 게시글 비추천
			 */
			const downvoteContent = async () => {
				if(props.accountData.status !== "login"){
					alert("자유 게시판 비추천은 로그인이 필요합니다");
					return;
				}

				const downvoteButton = document.querySelector("#downvoteButton");
				const upvoteButton = document.querySelector("#upvoteButton");
				upvoteButton.disabled = true;
				downvoteButton.disabled = true;

				const sendData = {
					code: postCode,
				}

				if(postCode !== null){
					const voteResult = await postFetch.downvoteContent("known", sendData);

					if(voteResult === null){
						return;
					}
					else if(voteResult.isVotable === false){
						alert("이미 게시물에 추천 또는 비추천을 하였습니다");
					}
					else{
						setUpvoteCount(voteResult.upvote);
						setDownvoteCount(voteResult.downvote);
					}
					
					upvoteButton.disabled = false;
					downvoteButton.disabled = false;
				}
			}

			const showUpvoteUserList = async () => {
				setVoteHistory(<><Placeholder xs={3} /> <Placeholder xs={1} /> <Placeholder xs={4} /></>);
				showVoteModal();

				setVoteModalTitle(`추천자`);

				const voteResult = await postFetch.showUpvoteUserList(postCode);

				setVoteModalTitle(`추천자 : ${voteResult.length}명`);

				const voteListElement = voteResult.map((element) => {
					return(
						<Row key={element.voterNickname}>
							<Col>{element.voterNickname}</Col>
							<Col>{element.createdAt.substring(0, 10)}</Col>
						</Row>
					);
				});

				if(voteListElement.length > 0){
					setVoteHistory(voteListElement);
				}
				else{
					setVoteHistory(<>추천자가 존재하지 않습니다</>);
				}
			}

			const showDownvoteUserList = async () => {
				setVoteHistory(<><Placeholder xs={3} /> <Placeholder xs={1} /> <Placeholder xs={4} /></>);
				showVoteModal();

				setVoteModalTitle(`비추천자`);

				const voteResult = await postFetch.showDownvoteUserList(postCode);

				setVoteModalTitle(`비추천자 : ${voteResult.length}명`);

				const voteListElement = voteResult.map((element) => {
					return(
						<Row key={element.voterNickname}>
							<Col>{element.voterNickname}</Col>
							<Col>{element.createdAt.substring(0, 10)}</Col>
						</Row>
					);
				});

				if(voteListElement.length > 0){
					setVoteHistory(voteListElement);
				}
				else{
					setVoteHistory(<>비추천자가 존재하지 않습니다</>);
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
								자유 게시판
							</span>

							<div style={{ fontWeight: "800", fontSize: "1.3rem", wordBreak: "break-all" }}>
								<span>{contentJson.category !== "" ? `[${postCommon.parseCategory(contentJson.category)}] ` : ""}</span>
								<span>{contentJson.title}</span>
							</div>
							<div style={{ display: "flex", alignItems: "center", fontSize: "0.8rem" }}>
								<span>
									<NicknameMenu targetNickname={contentJson.writerNickname} accountData={props.accountData}/>

									{ contentJson.account.authentication[0] !== undefined ? `(${contentJson.account.authentication[0].data.replace(",", "")})` : "" }
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
								<span style={{color: "green"}}>↑{upvoteCount}</span> | <span style={{color: "red"}}>↓{downvoteCount}</span>
							</div>
							<div style={{fontWeight: "400", fontSize: "0.75rem", color: "orange"}}>
								<span>
									{contentJson.updatedAt !== null ? `${new Date(contentJson.updatedAt).toLocaleString("sv-SE")}에 수정되었습니다` : ""}
								</span>
							</div>

							<hr style={{border: "1px solid #5893ff"}} />
						</div>

						{/*
							sanitizer libraries for HTML XSS Attacks : DOMPurify
						*/}
						{/* <div dangerouslySetInnerHTML={{__html: contentJson.content}} style={{minHeight: "150px", overflowWrap: "anywhere", overflow: "auto", fontSize: "0.8rem"}}></div> */}
						<div style={{ minHeight: "20rem" }}>
							<MyEditor
								editorMode={"read"}
								savedData={contentJson.content}
								editorMaxKB={100}
								setEditor={ () => {} }
								setEditorSizeByte={ () => {} }
							/>
						</div>

						<div style={{display: "flex", justifyContent: "center", marginTop: "30px"}}>
							<Button id={"upvoteButton"} onClick={() => {upvoteContent()}} variant="outline-success" className="mediumButton">
								<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
										<path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
									</svg>
									&nbsp;
									<strong style={{fontSize: "1.1rem"}}>{upvoteCount}</strong>
								</div>
								<span style={{fontSize: "0.8rem"}}>추천</span>
							</Button>
							&nbsp;&nbsp;
							<Button id={"downvoteButton"} onClick={() => {downvoteContent()}} variant="outline-danger" className="mediumButton">
								<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
										<path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
									</svg>
									&nbsp;
									<strong style={{fontSize: "1.1rem"}}>{downvoteCount}</strong>
								</div>
								<span style={{fontSize: "0.8rem"}}>비추천</span>
							</Button>
						</div>
						<div style={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
							<Button variant="success" onClick={() => { showUpvoteUserList() }} className="mediumButton">추천자</Button>
							&nbsp;&nbsp;
							<Button variant="danger" onClick={() => { showDownvoteUserList() }} className="mediumButton">비추천자</Button>
						</div>
						
						{
							isContentWriter === true ?
							<>
								<div style={{display: "flex", justifyContent: "flex-end", marginBottom: "15px", marginTop: "30px"}}>
									<Button onClick={() => {editContent()}} variant="outline-primary" className="smallButton">수정</Button>
									&nbsp;
									<Button onClick={() => {deleteContent()}} variant="outline-danger" className="smallButton">삭제</Button>
									&nbsp;
									<Button onClick={() => {navigate(`/lostark/post/known/1`)}} variant="outline-secondary" className="smallButton">목록으로</Button>
								</div>
							</>
							:
							<>
								<div style={{display: "flex", justifyContent: "flex-end", marginBottom: "15px", marginTop: "30px"}}>
									<Button onClick={() => {navigate(`/lostark/post/known/1`)}} variant="outline-secondary" className="smallButton">목록으로</Button>
								</div>
							</>
						}

						<hr style={{border: "1px solid #5893ff"}} />
						
						<KnownReply accountData={props.accountData} postCode={postCode} />
					</div>
				</>
			);
		}
	}, [postCode, contentJson, upvoteCount, downvoteCount, isContentWriter, voteHistory, navigate, props.accountData]);
	
	return(
		<Container style={{maxWidth: "1200px"}}>
			{renderData}

			<LoadingModal showModal={loadingModalShow} message={loadingModalMessage}/>

			<Modal show={showVote} onHide={closeVoteModal} backdrop="static" keyboard={false} centered>
				<Modal.Header closeButton>
					<Modal.Title style={{ fontSize: "1.3rem" }}>{voteModalTitle}</Modal.Title>
				</Modal.Header>

				<Modal.Body style={{ maxHeight: "20rem", overflow: "auto", fontSize: "0.8rem" }}>{voteHistory}</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={closeVoteModal} style={{padding: "2px", width: "8%", minWidth: "70px", maxWidth: "100px", fontSize: "0.8rem"}}>
						닫기
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}

export default KnownPostView;