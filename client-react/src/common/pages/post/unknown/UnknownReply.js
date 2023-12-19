import { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomPagination from '../CustomPagination';
import * as replyFetch from '../../../js/replyFetch';

const UnknownReply = (props) => {
	// const [upvoteCount, setUpvoteCount] = useState(0);
	// const [downvoteCount, setDownvoteCount] = useState(0);
	const [renderData, setRenderData] = useState(<></>);
	const REPlY_MAX_LENG = 300; //댓글 글자 수 제한

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
			const deletePassword = window.prompt("댓글을 삭제하시려면 비밀번호를 입력해주세요");

			if(deletePassword === null){
				return;
			}
			else if(deletePassword === ""){
				alert("비밀번호를 입력해주세요");
				return;
			}
			else{
				if(props.postCode !== null){
					const sendData = {
						code: replyCode,
						password: deletePassword,
					}

					const deleteResult = await replyFetch.deleteReply("unknown", sendData);

					if(deleteResult === null){
						alert("댓글 삭제 중 오류가 발생하였습니다(1)");
					}
					else if(deleteResult === undefined){
						alert("댓글 삭제 중 오류가 발생하였습니다(2)");
					}
					else if(deleteResult === false){
						alert("올바른 비밀번호가 아닙니다");
					}
					else{
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

			if(formElement.password.value === ""){
				alert("삭제를 위한 비밀번호를 입력해주세요");
				formElement.password.focus();
				return;
			}
			else if(formElement.content.value === ""){
				alert("답글 내용을 입력해주세요");
				formElement.content.focus();
				return;
			}
			else if(formElement.content.value.length > REPlY_MAX_LENG){
				alert("답글이 글자수 제한을 초과하였습니다");
				formElement.content.focus();
				return;
			}

			const sendData = {
				postCode: props.postCode,
				parentReplyCode: replyCode,
				level: 1,
				password: formElement.password.value,
				content: formElement.content.value,
			}

			const createResult = await replyFetch.createReply("unknown", sendData);

			if(createResult === null){
				alert("답글 작성 중 오류가 발생하였습니다(1)");
			}
			else if(createResult === undefined){
				alert("답글 작성 중 오류가 발생하였습니다(2)");
			}
			else{
				formElement.reset();
				formElement.style.display = "none";
				getReplies(currentPage);
			}
		}

		if(props.postCode !== null){
			const replyArray = await replyFetch.getReplies("unknown", props.postCode, currentPage);

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
						const replyBody = (
							<div style={{width: "100%", display: "flex", flexDirection: "column", paddingBottom: "5px", marginBottom: "5px"}}>
								<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
									<div>
										<span style={{fontSize: "0.8rem", color: "gray"}}>익명 ({replyData.ip})</span>
									</div>
									

									<div onClick={() => {deleteReply(replyData.code, currentPage)}} style={{ display: "flex", alignItems: "center",cursor: "pointer" }}>
										{
											replyData.deletedAt === null ?
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
									{replyData.deletedAt === null ? replyData.content : <span style={{color: "palevioletred"}}>{replyData.content}</span>}
								</div>

								<p style={{fontSize: "0.75rem", color: "lightgray", marginTop: "0.8rem"}}>
									{new Date(replyData.createdAt).toLocaleString("sv-SE")}
								</p>
							</div>
						);

						let replyForm = <></>;

						const styleData = {
							borderBottom: "1px solid lightgray",
							marginTop: "8px",
							paddingBottom: "8px",
						};
						
						if(replyData.level === 0){
							//댓글, LEVEL = 0
							replyForm = (
								<>
									<div style={{marginTop: "5px"}}>
										<Button id={"appendReply"} onClick={() => {appendReply(replyData.code)}} variant="outline-secondary" className="smallButton">
											답글
										</Button>
									</div>

									<Form id={`replyOfReplyForm_${replyData.code}`} style={{display: "none", marginTop: "5px", borderRadius: "8px", backgroundColor: "#f1f4ff"}}>
										<div style={{padding: "8px"}}>
											<Form.Group className="mb-2">
												<Form.Label style={{fontSize: "0.8rem", width: "100%"}}>
													<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
														<strong>답글 작성</strong>
														<Button onClick={() => {createRecursiveReply(replyData.code, currentPage)}} variant="primary" className="smallButton">저장</Button>
													</div>
												</Form.Label>

												<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.2rem", marginBottom: "1rem" }}>
													<Form.Control name="writer" type="text" placeholder="작성자" defaultValue={"익명"} style={{fontSize: "0.8rem", maxWidth: "60px"}} readOnly plaintext />
													<Form.Control name="password" type="password" autoComplete="off" placeholder="비밀번호" maxLength={20} style={{fontSize: "0.8rem"}} />
												</div>
												
												<Form.Control name="content" as="textarea" rows={3} style={{fontSize: "0.8rem"}} onChange={(event) => {checkReplyLimit(event)}} />
											</Form.Group>
										</div>
									</Form>
								</>
							);
						}
						else{
							//답글, LEVEL = 1
							styleData["marginLeft"] = "1.3rem";
						}

						renderElement.push(
							<div id={`reply_${replyData.code}`} key={`reply_${replyData.code}`} style={styleData}>
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
	}, [props.postCode])

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
		const replyPasswordElement = document.querySelector("#replyPassword");

		if(replyPasswordElement.value === ""){
			alert("삭제를 위한 비밀번호를 입력해주세요");
			replyPasswordElement.focus();
			return;
		}
		else if(replyDataElement.value === ""){
			alert("댓글의 내용을 입력해주세요");
			replyDataElement.focus();
			return;
		}
		else if(replyDataElement.value.length > REPlY_MAX_LENG){
			alert("댓글이 글자수 제한을 초과하였습니다");
			replyDataElement.focus();
			return;
		}

		if(props.postCode !== null){
			const sendData = {
				postCode: props.postCode,
				parentReplyCode: 0,
				level: 0,
				password: replyPasswordElement.value,
				content: replyDataElement.value,
			}

			const createResult = await replyFetch.createReply("unknown", sendData);

			if(createResult === null){
				alert("댓글 작성 중 오류가 발생하였습니다(1)");
			}
			else if(createResult === undefined){
				alert("댓글 작성 중 오류가 발생하였습니다(2)");
			}
			else{
				getReplies(1);
				document.querySelector("#replyForm").reset();
			}
		}
	}, [props.postCode, getReplies])

	useEffect(() => {
		getReplies(1);
	}, [props.postCode, getReplies])

	return(
		<>
			<div>
				<Form id="replyForm">
					<Form.Group className="mb-3">
						<Form.Label>댓글 작성</Form.Label>

						<Row className="g-2">
							<Col style={{maxWidth: "70px"}}>
								<Form.Control id="writer" type="text" autoComplete="off" placeholder="작성자" defaultValue={"익명"} style={{marginBottom: "10px", fontSize: "0.8rem"}} readOnly plaintext />
							</Col>
							<Col style={{maxWidth: "230px"}}>
								<Form.Control id="replyPassword" autoComplete="off" type="password" placeholder="비밀번호" maxLength={20} style={{marginBottom: "10px", fontSize: "0.8rem"}} />
							</Col>
						</Row>

						<Form.Control id="replyData" as="textarea" rows={4} onChange={(event) => {checkReplyLimit(event)}} style={{fontSize: "0.8rem"}} />
					</Form.Group>
				</Form>

				<div style={{display: "flex", justifyContent: "flex-end"}}>
					<Button id="createReply" onClick={() => {createReply()}} variant="outline-primary" style={{width: "30%", maxWidth: "200px", padding: "1px"}}>
						<span style={{fontSize: "0.8rem"}}>등록</span>
					</Button>
				</div>

				<hr/>
			</div>

			{renderData}
		</>
	);
}

export default UnknownReply;