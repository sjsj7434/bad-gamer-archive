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
	// const [upvoteCount, setUpvoteCount] = useState(0);
	// const [downvoteCount, setDownvoteCount] = useState(0);
	const [renderData, setRenderData] = useState(<></>);
	const REPlY_MAX_LENG = 300; //댓글 글자 수 제한
	const REPlY_MAX_ROW = 10; //댓글 줄 수 제한

	/**
	 * 게시글 upvote & downvote
	 */
	// const voteReply = useCallback(async (type) => {
	// 	const upvoteReply = document.querySelector("#upvoteReply");
	// 	const downvoteReply = document.querySelector("#downvoteReply");
	// 	upvoteReply.disabled = true;
	// 	downvoteReply.disabled = true;

	// 	if(props.postCode !== null){
	// 		const fecthOption = {
	// 			method: "POST"
	// 			, headers: {"Content-Type": "application/json",}
	// 			, credentials: "include", // Don't forget to specify this if you need cookies
	// 		};
	// 		const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/reply/${type}/${props.postCode}`, fecthOption);
	// 		const jsonData = await parseStringToJson(jsonString);

	// 		if(jsonData === null){
	// 			alert("오늘은 이미 해당 게시물에 추천, 비추천을 하였습니다");
	// 		}
	// 		else{
	// 			// setUpvoteCount(jsonData.upvote);
	// 			// setDownvoteCount(jsonData.downvote);
	// 		}
			
	// 		upvoteReply.disabled = false;
	// 		downvoteReply.disabled = false;
	// 	}
	// }, [props.postCode])

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

						const replyBody = (
							<div style={{display: "flex", flexDirection: "row"}}>
								<div style={{ marginRight: "0.4rem" }}>
									{profilePictureElement}
								</div>
								<div style={{ width: "100%" }}>
									<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
										<NicknameMenu targetNickname={replyData.writerNickname} accountData={props.accountData}/>

										<div onClick={() => {deleteReply(replyData.code, currentPage)}} style={{ display: "flex", alignItems: "center",cursor: "pointer" }}>
											{
												replyData.deletedAt === null && (replyData.writerNickname === props.accountData.nickname) ?
												<>
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="palevioletred" className="bi bi-x-circle" viewBox="0 0 16 16">
														<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
														<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
													</svg>
												</>
												:
												<></>
											}
										</div>
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

						let replyForm = <></>;

						const replyStyleData = {
							borderBottom: "1px solid lightgray",
							marginTop: "8px",
							paddingBottom: "8px",
						};

						if(replyData.level === 0){
							//댓글, LEVEL = 0
							if(props.accountData.nickname !== ""){
								replyForm = (
									<div>
										<div style={{marginTop: "5px"}}>
											<Button id={"appendReply"} onClick={() => {appendReply(replyData.code)}} variant="outline-secondary" className="smallButton">
												답글
											</Button>
										</div>

										<Form id={`replyOfReplyForm_${replyData.code}`} style={{display: "none", marginTop: "5px", borderRadius: "8px", backgroundColor: "#f1f4ff"}}>
											<div style={{padding: "8px", width: "100%"}}>
												<Form.Group className="mb-2">
													<Form.Label style={{fontSize: "0.8rem", width: "100%"}}>
														<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
															<strong>답글 작성</strong>
															<Button onClick={() => {createRecursiveReply(replyData.code, currentPage)}} variant="primary" className="smallButton">등록</Button>
														</div>
													</Form.Label>

													<Form.Control name="content" as="textarea" rows={3} style={{fontSize: "0.8rem"}} onChange={(event) => {checkReplyLimit(event)}} />
												</Form.Group>
											</div>
										</Form>
									</div>
								);
							}
						}
						else{
							//답글, LEVEL = 1
							replyStyleData["marginLeft"] = "1.3rem";
							replyStyleData["backgroundColor"] = "#fff1de";
						}

						renderElement.push(
							<div id={`reply_${replyData.code}`} key={`reply_${replyData.code}`} style={replyStyleData}>
								{replyBody}

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
							<Form.Label style={{fontSize: "0.8rem", width: "100%"}}>
								<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
									<strong>댓글 작성</strong>
								</div>
							</Form.Label>

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
							<Form.Label style={{fontSize: "0.8rem", width: "100%"}}>
								<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
									<strong>댓글 작성</strong>
									<Button id="createReply" onClick={() => {createReply()}} variant="primary" className="smallButton">등록</Button>
								</div>
							</Form.Label>

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