import { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomPagination from '../CustomPagination';
import * as replyFetch from '../../../js/replyFetch';
import NicknameMenu from './NicknameMenu';
import Image from 'react-bootstrap/Image';

const KnownReply = (props) => {
	const [renderData, setRenderData] = useState(<></>);
	const REPlY_MAX_LENG = 300; //댓글 글자 수 제한
	const REPlY_MAX_ROW = 10; //댓글 줄 수 제한

	/**
	 * 댓글 가져오기
	 */
	const getReplies = useCallback(async (currentPage) => {
		/**
		 * 댓글 페이지 이동
		 */
		const pageMoveFunc = async (pageIndex) => {
			await getReplies(pageIndex);
			let timeLimit = 0;
			const inter = setInterval(() => {
				timeLimit++;
				if(document.querySelector("div[id^=reply_]") !== null){
					document.querySelector("div[id^=reply_]").scrollIntoView({ behavior: "smooth", block: "center" });
					clearInterval(inter);
				}
				if(timeLimit >= 30){
					clearInterval(inter);
				}
			}, 100);
		}

		/**
		 * 댓글 삭제
		 */
		const deleteReply = async (replyCode, currentPage) => {
			if(window.confirm("댓글을 삭제하시겠습니까?") === false){
				return;
			}
			else{
				if(props.postCode !== null){
					const sendData = {
						code: replyCode,
					}

					const deleteResult = await replyFetch.deleteReply("known", sendData);

					if(deleteResult === false){
						alert("댓글 작성자가 아니면 삭제할 수 없습니다");
					}
					else if(deleteResult === true){
						getReplies(currentPage);
					}
				}
			}
		}

		/**
		 * 대댓글 입력 폼 컨트롤
		 */
		const appendReply = async (replyCode) => {
			const targetForm = document.querySelector(`#replyOfReplyForm_${replyCode}`);
			
			if(props.accountData.nickname === ""){
				alert("답글을 작성할 수 없습니다");
				return;
			}

			if(targetForm.style.display === "block"){
				targetForm.style.display = "none";
				return;
			}
			else{
				targetForm.style.display = "block";
			}

			const formArray = document.querySelectorAll(`form[id^=replyOfReplyForm_]`);
			for (const element of formArray) {
				if(element.id !== `replyOfReplyForm_${replyCode}`){
					if(element.style.display === "block"){
						element.style.display = "none";
					}
				}
			}
		}

		/**
		 * 대댓글 작성
		 */
		const createRecursiveReply = async (replyCode, currentPage) => {
			const formElement = document.querySelector(`#replyOfReplyForm_${replyCode}`);
			const replyLines = formElement.content.value.split("\n"); //댓글 줄

			if(formElement.content.value === ""){
				alert("답글 내용을 입력해주세요");
				formElement.content.focus();
				return;
			}
			else if(formElement.content.value.length > REPlY_MAX_LENG){
				alert("답글이 글자수 제한을 초과하였습니다");
				formElement.content.focus();
				return;
			}
			else if(replyLines.length > REPlY_MAX_ROW){
				alert(`댓글 내용이 ${REPlY_MAX_ROW}줄을 넘어 저장할 수 없습니다\n좀 더 짧게 작성해주세요`);
				formElement.content.focus();
				return;
			}

			const sendData = {
				postCode: props.postCode,
				parentReplyCode: replyCode,
				level: 1,
				content: formElement.content.value,
			}

			const createResult = await replyFetch.createReply("known", sendData);

			if(createResult === true){
				formElement.reset();
				formElement.style.display = "none";
				getReplies(currentPage);
			}
			else{
				alert("답글을 작성할 수 없습니다");
				formElement.reset();
			}
		}

		/**
		 * 댓글 upvote & downvote
		 */
		const voteReply = async (type, replyCode) => {
			const upvoteButton = document.querySelector(`#upvoteButton${replyCode}`);
			const downvoteButton = document.querySelector(`#downvoteButton${replyCode}`);
			const upvoteCount = document.querySelector(`#upvoteCount${replyCode}`);
			const downvoteCount = document.querySelector(`#downvoteCount${replyCode}`);

			upvoteButton.disabled = true;
			downvoteButton.disabled = true;

			const sendData = {
				replyCode: replyCode,
			};

			const voteResult = await replyFetch.voteReply("known", type, sendData);

			upvoteButton.disabled = false;
			downvoteButton.disabled = false;

			if(voteResult.isVotable === false){
				alert("오늘은 이미 해당 게시물에 추천, 비추천을 하였습니다");
			}
			else{
				upvoteCount.innerHTML = voteResult.upvote;
				downvoteCount.innerHTML = voteResult.downvote;
			}
		}

		if(props.postCode !== null){
			const replyArray = await replyFetch.getReplies("known", props.postCode, currentPage);

			if(replyArray !== null){
				if(replyArray[1] === 0){
					setRenderData(
						<div key={"replyTop"} id={"replyTop"} style={{fontSize: "0.75rem", color: "lightgray"}}>
							* 등록된 댓글이 없습니다
						</div>
					);
				}
				else{
					const renderElement = [];

					renderElement.push(
						<div key={"replyTop"} id={"replyTop"} style={{display: "flex", justifyContent: "flex-start"}}>
							<p style={{fontSize: "0.8rem"}}>댓글 <strong>{replyArray[1]}</strong>개</p>
						</div>
					);

					for (const replyData of replyArray[0]) {
						let profilePictureElement = <>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill replyProfilePictureNone" viewBox="0 0 16 16">
								<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
							</svg>
						</>;

						if(replyData.account !== null && replyData.account !== undefined){
							if(replyData.account.profilePictureURL !== null || replyData.account.profilePictureURL !== ""){
								profilePictureElement = <Image src={replyData.account.profilePictureURL} roundedCircle className="replyProfilePicture" />;
							}
						}

						let isDeleted = false;
						let deleteButton = <></>;
						if(replyData.deletedAt === null && (replyData.writerNickname === props.accountData.nickname)){
							isDeleted = true;
							deleteButton = (
								<div onClick={() => {deleteReply(replyData.code, currentPage)}} style={{ display: "flex", alignItems: "center",cursor: "pointer" }}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="palevioletred" className="bi bi-x-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
									</svg>
								</div>
							);
						}

						const replyBody = (
							<div style={{display: "flex", flexDirection: "row"}}>
								<div style={{ marginRight: "0.4rem" }}>
									{profilePictureElement}
								</div>
								<div style={{ width: "100%" }}>
									<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
										<NicknameMenu targetNickname={replyData.writerNickname} accountData={props.accountData}/>
										{deleteButton}
									</div>

									<div style={{fontSize: "0.75rem", marginTop: "5px", whiteSpace: "break-spaces", overflowWrap: "anywhere", overflow: "auto", marginRight: "3%"}}>
										{(replyData.deletedAt === null ? replyData.content : <span style={{color: "palevioletred"}}>{replyData.content}</span>)}
									</div>

									<p style={{fontSize: "0.75rem", color: "lightgray", marginTop: "0.8rem"}}>
										{new Date(replyData.createdAt).toLocaleString("sv-SE")}
									</p>
								</div>
							</div>
						);

						const replyVote = (
							<div style={{ display: "flex", justifyContent: "flex-end" }}>
								<Button id={`upvoteButton${replyData.code}`} onClick={() => {voteReply("upvote", replyData.code)}} variant="outline-success" className="smallButton" style={{ minWidth: "80px", maxWidth: "80px" }} disabled={!isDeleted}>
									<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
											<path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
										</svg>
										<span id={`upvoteCount${replyData.code}`} style={{ marginLeft: "4px" }}>{replyData.upvote}</span>
									</div>
								</Button>
								&nbsp;
								<Button id={`downvoteButton${replyData.code}`} onClick={() => {voteReply("downvote", replyData.code)}} variant="outline-danger" className="smallButton" style={{ minWidth: "80px", maxWidth: "80px" }} disabled={!isDeleted}>
									<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
											<path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
										</svg>
										<span id={`downvoteCount${replyData.code}`} style={{ marginLeft: "4px" }}>{replyData.downvote}</span>
									</div>
								</Button>
							</div>
						);

						let replyButtons = <></>;
						let replyForm = <></>;

						const replyStyleData = {
							borderBottom: "1px solid lightgray",
							marginTop: "8px",
							padding: "8px",
						};

						if(replyData.level === 0){
							//댓글, LEVEL = 0
							replyButtons = (
								<div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
									<Button onClick={() => {appendReply(replyData.code)}} variant="outline-secondary" className="smallButton">답글</Button>
									{replyVote}
								</div>
							);

							if(props.accountData.nickname !== ""){
								replyForm = (
									<Form id={`replyOfReplyForm_${replyData.code}`} style={{display: "none", marginTop: "5px", borderRadius: "8px", backgroundColor: "#f1f4ff"}}>
										<div style={{padding: "8px", width: "100%"}}>
											<Form.Group className="mb-2">
												<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "12px" }}>
													<strong>답글 작성</strong>
													<Button onClick={() => {createRecursiveReply(replyData.code, currentPage)}} variant="primary" className="smallButton">등록</Button>
												</div>

												<Form.Control name="content" as="textarea" rows={3} style={{fontSize: "0.8rem"}} onChange={(event) => {checkReplyLimit(event)}} />
											</Form.Group>
										</div>
									</Form>
								);
							}
						}
						else{
							//답글, LEVEL = 1
							replyStyleData["marginLeft"] = "1.3rem";
							// replyStyleData["backgroundColor"] = "#fff1de";

							replyButtons = replyVote;
						}

						renderElement.push(
							<div id={`reply_${replyData.code}`} key={`reply_${replyData.code}`} style={replyStyleData}>
								{replyBody}

								{replyButtons}

								{replyForm}
							</div>
						);
					}

					renderElement.push(
						<div key={"pagination"} style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
							<CustomPagination currentPage={currentPage} contentPerPage={50} contentCount={replyArray[1]} howManyPages={5} pageMoveFunc={pageMoveFunc}/>
						</div>
					);
					
					setRenderData(renderElement);
				}
			}
		}
	}, [props.postCode, props.accountData])

	/**
	 * 댓글 작성할 떄 글자 수 제한 확인
	 */
	const checkReplyLimit = (event) => {
		const replyData = event.target.value;
		if(replyData.length > REPlY_MAX_LENG){
			event.target.value = event.target.value.substring(0, REPlY_MAX_LENG);
			return false;
		}
		else{
			return true;
		}
	}

	/**
	 * 댓글 작성
	 */
	const createReply = useCallback(async () => {
		const replyDataElement = document.querySelector("#replyData");
		const replyLines = replyDataElement.value.split("\n"); //댓글 줄

		if(replyDataElement.value === ""){
			alert("댓글의 내용을 입력해주세요");
			replyDataElement.focus();
			return;
		}
		else if(replyDataElement.value.length > REPlY_MAX_LENG){
			alert("댓글이 글자수 제한을 초과하였습니다");
			replyDataElement.focus();
			return;
		}
		else if(replyLines.length > REPlY_MAX_ROW){
			alert(`댓글 내용이 ${REPlY_MAX_ROW}줄을 넘어 저장할 수 없습니다\n좀 더 짧게 작성해주세요`);
			replyDataElement.focus();
			return;
		}

		const sendData = {
			postCode: props.postCode,
			parentReplyCode: 0,
			level: 0,
			content: replyDataElement.value,
		}

		const createResult = await replyFetch.createReply("known", sendData);

		if(createResult === true){
			getReplies(1);
			document.querySelector("#replyForm").reset();
		}
		else{
			alert("댓글을 작성할 수 없습니다");
			document.querySelector("#replyForm").reset();
		}
	}, [props.postCode, getReplies])

	useEffect(() => {
		getReplies(1);
	}, [props.postCode, getReplies])

	if(props.accountData.nickname === ""){
		//유저 전용이라 비로그인 사용 불가능
		return(
			<>
				<div>
					<Form id="replyForm">
						<Form.Group className="mb-3">
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "12px" }}>
								<strong>댓글 작성</strong>
							</div>

							<Row className="g-2">
								<Col>
									<Form.Control type="text" defaultValue={"댓글을 작성하려면 로그인해주세요"} style={{marginBottom: "10px", fontSize: "0.8rem"}} readOnly plaintext disabled />
								</Col>
							</Row>

							<Form.Control id="replyData" as="textarea" rows={5} style={{fontSize: "0.8rem"}} onChange={(event) => {checkReplyLimit(event)}} disabled />
						</Form.Group>
					</Form>
					<hr/>
				</div>
	
				{renderData}
			</>
		);
	}
	else{
		return(
			<>
				<div>
					<Form id="replyForm">
						<Form.Group className="mb-3">
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "12px" }}>
								<strong>댓글 작성</strong>
								<Button id="createReply" onClick={() => {createReply()}} variant="primary" className="smallButton">등록</Button>
							</div>

							<Form.Control id="replyData" as="textarea" rows={5} style={{fontSize: "0.8rem"}} onChange={(event) => {checkReplyLimit(event)}} />
						</Form.Group>
					</Form>
					<hr/>
				</div>
	
				{renderData}
			</>
		);
	}
}

export default KnownReply;