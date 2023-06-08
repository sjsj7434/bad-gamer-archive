import { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomPagination from './CustomPagination';

const BoardReply = (props) => {
	const [upvoteCount, setUpvoteCount] = useState(0);
	const [downvoteCount, setDownvoteCount] = useState(0);
	const [renderData, setRenderData] = useState(<></>);

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
	 * 댓글 페이지 이동
	 */
	const pageMoveFunc = async (pageIndex) => {
		await getReplies(pageIndex);
		let timeLimit = 0;
		const inter = setInterval(() => {
			timeLimit++;
			console.log("checking...");
			if(document.querySelector("div[id^=reply_]") !== null){
				console.log("clearInterval ok...");
				document.querySelector("div[id^=reply_]").scrollIntoView({ behavior: "smooth", block: "center" });
				clearInterval(inter);
			}
			if(timeLimit >= 30){
				console.log("clearInterval limit...");
				clearInterval(inter);
			}
		}, 100);
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
			alert("내용을 입력해주세요");
			replyDataElement.focus();
			return;
		}

		const sendData = {
			parentContentCode: props.contentCode,
			parentReplyCode: 0,
			content: replyDataElement.value,
			password: replyPasswordElement.value,
			replyOrder: 0,
			level: 0,
			writer: "",
		}

		if(props.contentCode !== null){
			const fecthOption = {
				method: "POST"
				, body: JSON.stringify(sendData)
				, headers: {"Content-Type": "application/json",}
				, credentials: "include", // Don't forget to specify this if you need cookies
			};
			const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/reply`, fecthOption);
			const jsonData = await parseStringToJson(jsonString);

			console.log("createdReply", jsonData)

			if(jsonData === null){
				alert("댓글 작성 중 오류가 발생하였습니다(1)");
			}
			else if(jsonData === undefined){
				alert("댓글 작성 중 오류가 발생하였습니다(2)");
			}
			else{
				getReplies(1);
				// document.querySelector("#replyForm").reset();
			}
		}
	}, [props.contentCode])

	/**
	 * 대댓글 작성
	 */
	const createRecursiveReply = useCallback(async (replyCode) => {
		const formElement = document.querySelector(`#replyOfReplyForm_${replyCode}`);

		if(formElement.password.value === ""){
			alert("삭제를 위한 비밀번호를 입력해주세요");
			formElement.password.focus();
			return;
		}
		else if(formElement.content.value === ""){
			alert("내용을 입력해주세요");
			formElement.content.focus();
			return;
		}

		const sendData = {
			parentContentCode: props.contentCode,
			parentReplyCode: replyCode,
			content: formElement.content.value,
			password: formElement.password.value,
			replyOrder: 0,
			level: 1,
			writer: "",
		}

		const fecthOption = {
			method: "POST"
			, body: JSON.stringify(sendData)
			, headers: {"Content-Type": "application/json",}
			, credentials: "include", // Don't forget to specify this if you need cookies
		};
		const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/reply`, fecthOption);
		const jsonData = await parseStringToJson(jsonString);

		console.log("createRecursiveReply", jsonData)

		if(jsonData === null){
			alert("답글 작성 중 오류가 발생하였습니다(1)");
		}
		else if(jsonData === undefined){
			alert("답글 작성 중 오류가 발생하였습니다(2)");
		}
		else{
			formElement.reset();
			formElement.style.display = "none";
			getReplies(1);
		}
	}, [props.contentCode])

	/**
	 * 댓글 삭제
	 */
	const deleteReply = async (replyCode) => {
		const deletePassword = window.prompt("댓글을 삭제하시려면 비밀번호를 입력해주세요");

		if(deletePassword === null){
			return;
		}
		else if(deletePassword === ""){
			alert("비밀번호를 입력해주세요");
			return;
		}
		else{
			const sendData = {
				code: replyCode,
				password: deletePassword,
				writer: "",
			}

			if(props.contentCode !== null){
				const fecthOption = {
					method: "DELETE"
					, body: JSON.stringify(sendData)
					, headers: {"Content-Type": "application/json",}
					, credentials: "include", // Don't forget to specify this if you need cookies
				};
				const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/reply`, fecthOption);
				const jsonData = await parseStringToJson(jsonString);

				console.log("deleteReply", jsonData)

				if(jsonData === null){
					alert("댓글 삭제 중 오류가 발생하였습니다(1)");
				}
				else if(jsonData === undefined){
					alert("댓글 삭제 중 오류가 발생하였습니다(2)");
				}
				else if(jsonData === false){
					alert("올바른 비밀번호가 아닙니다");
				}
				else{
					getReplies(1);
				}
			}
		}
	}

	/**
	 * 대댓글
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
	 * 게시글 upvote & downvote
	 */
	const voteReply = useCallback(async (type) => {
		const upvoteReply = document.querySelector("#upvoteReply");
		const downvoteReply = document.querySelector("#downvoteReply");
		upvoteReply.disabled = true;
		downvoteReply.disabled = true;

		if(props.contentCode !== null){
			const fecthOption = {
				method: "POST"
				, headers: {"Content-Type": "application/json",}
				, credentials: "include", // Don't forget to specify this if you need cookies
			};
			const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/reply/${type}/${props.contentCode}`, fecthOption);
			const jsonData = await parseStringToJson(jsonString);

			if(jsonData === null){
				alert("오늘은 이미 해당 게시물에 추천, 비추천을 하였습니다");
			}
			else{
				setUpvoteCount(jsonData.upvote);
				setDownvoteCount(jsonData.downvote);
			}
			
			upvoteReply.disabled = false;
			downvoteReply.disabled = false;
		}
	}, [props.contentCode])

	useEffect(() => {
		getReplies(1);
	}, [props.contentCode])

	/**
	 * 댓글 가져오기
	 */
	const getReplies = useCallback(async (page) => {
		if(props.contentCode !== null){
			console.log(`${process.env.REACT_APP_SERVER}/boards/reply/${props.contentCode}/${page}`)
			const fecthOption = {
				method: "GET"
				, headers: {"Content-Type": "application/json",}
				, credentials: "include", // Don't forget to specify this if you need cookies
			};

			const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/reply/${props.contentCode}/${page}`, fecthOption);
			// const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/TEST`, fecthOption);
			const jsonData = await parseStringToJson(jsonString);

			console.log("getReplies", jsonData)

			if(jsonData !== null){
				if(jsonData[1] === 0){
					setRenderData(
						<div style={{fontSize: "0.75rem", color: "lightgray"}}>
							* 등록된 댓글이 없습니다
						</div>
					);
				}
				else{
					const renderElement = [];

					renderElement.push(
						<div id={"replyTop"} style={{display: "flex", justifyContent: "flex-start"}}>
							<p style={{fontSize: "0.8rem"}}>댓글 <strong>{jsonData[1]}</strong>개</p>
						</div>
					);

					for (const replyData of jsonData[0]) {
						if(replyData.level === 0){
							renderElement.push(
								<div id={`reply_${replyData.code}`} key={`reply_${replyData.code}`} style={{display: "flex", flexDirection: "column", paddingBottom: "5px", marginBottom: "5px", borderBottom: "1px solid lightgray"}}>
									<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
										<div>
											<span style={{fontSize: "0.8rem", color: "black"}}>{replyData.writer === "" ? `익명(${replyData.ip})` : replyData.writer}</span>
											&nbsp;
											<span style={{fontSize: "0.75rem", color: "lightgray"}}>{new Date(replyData.createdAt).toLocaleString("sv-SE")}</span>
										</div>
										<div>
											{
												replyData.deletedAt === null ?
												<>
													<Button id={"deleteReply"} onClick={() => {deleteReply(replyData.code)}} variant="outline-danger" style={{padding: "2px", fontSize: "0.7rem"}}>
														삭제
													</Button>
												</>
												:
												<></>
											}
										</div>
									</div>

									<div style={{fontSize: "0.75rem", marginTop: "5px", whiteSpace: "break-spaces"}}>
										{(replyData.deletedAt === null ? replyData.content : <span style={{color: "palevioletred"}}>{replyData.content}</span>)}
									</div>

									<div style={{marginTop: "5px"}}>
										<Button id={"appendReply"} onClick={() => {appendReply(replyData.code)}} variant="outline-secondary" style={{padding: "1px", width: "15%", maxWidth: "150px", fontSize: "0.7rem"}}>
											답글
										</Button>
									</div>

									<Form id={`replyOfReplyForm_${replyData.code}`} style={{display: "none", margin: "4px", backgroundColor: "#efefef"}}>
										<div style={{padding: "12px"}}>
											<Form.Group className="mb-3">
												<Form.Label style={{fontSize: "0.8rem"}}>답글 작성</Form.Label>
												<Row className="g-2">
													<Col>
														<Form.Control name="writer" type="text" placeholder="작성자" defaultValue={"익명"} style={{marginBottom: "10px", fontSize: "0.8rem"}} readOnly />
													</Col>
													<Col>
														<Form.Control name="password" type="password" placeholder="비밀번호" maxLength={20} style={{marginBottom: "10px", fontSize: "0.8rem"}} />
													</Col>
												</Row>
												<Form.Control name="content" as="textarea" rows={3} style={{fontSize: "0.8rem"}} />
												<Button onClick={() => {createRecursiveReply(replyData.code)}} variant="primary" style={{width: "100%", marginTop: "10px", fontSize: "0.8rem"}}>
													저장
												</Button>
											</Form.Group>
										</div>
									</Form>
								</div>
							);
						}
						else{
							renderElement.push(
								<>
									<div style={{display: "flex", flexDirection: "row", alignItems: "baseline"}}>
										<svg xmlns="http://www.w3.org/2000/svg" width="1.1rem" height="1.1rem" fill="currentColor" className="bi bi-arrow-return-right" viewBox="0 0 16 16">
											<path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"/>
										</svg>
										
										<div id={`reply_${replyData.code}`} key={`reply_${replyData.code}`} style={{width: "100%", display: "flex", flexDirection: "column", marginLeft: "8px", paddingBottom: "5px", marginBottom: "5px", borderBottom: "1px solid lightgray"}}>
											<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
												<div>
													<span style={{fontSize: "0.8rem", color: "black"}}>{replyData.writer === "" ? `익명(${replyData.ip})` : replyData.writer}</span>
													&nbsp;
													<span style={{fontSize: "0.75rem", color: "lightgray"}}>{new Date(replyData.createdAt).toLocaleString("sv-SE")}</span>
												</div>
												<div>
													{
														replyData.deletedAt === null ?
														<>
															<Button id={"deleteReply"} onClick={() => {deleteReply(replyData.code)}} variant="outline-danger" style={{padding: "2px", fontSize: "0.7rem"}}>
																삭제
															</Button>
														</>
														:
														<></>
													}
												</div>
											</div>

											<div style={{fontSize: "0.75rem", marginTop: "5px", whiteSpace: "break-spaces"}}>
												{replyData.deletedAt === null ? replyData.content : <span style={{color: "palevioletred"}}>{replyData.content}</span>}
											</div>
										</div>
									</div>
								</>
							);
						}
					}

					renderElement.push(
						<div style={{display: "flex", justifyContent: "center"}}>
							<CustomPagination currentPage={page} contentPerPage={50} contentCount={jsonData[1]} howManyPages={4} pageMoveFunc={pageMoveFunc}/>
						</div>
					);
					
					setRenderData(renderElement);
				}
			}
		}
	}, [props.contentCode])

	return(
		<Container style={{maxWidth: "1440px"}}>
			<div>
				<Form id={"replyForm"}>
					<Form.Group className="mb-3">
						<Form.Label>댓글 작성</Form.Label>
						<Row className="g-2">
							<Col>
								<Form.Control id="writer" type="text" placeholder="작성자" defaultValue={"익명"} style={{marginBottom: "10px"}} readOnly />
							</Col>
							<Col>
								<Form.Control id="replyPassword" type="password" placeholder="비밀번호" maxLength={20} style={{marginBottom: "10px"}} />
							</Col>
						</Row>
						<Form.Control id={"replyData"} as="textarea" rows={4} />
					</Form.Group>
				</Form>
				<div style={{display: "flex", justifyContent: "flex-end"}}>
					<Button onClick={() => {getReplies(1)}} variant="outline-primary" style={{width: "30%", maxWidth: "200px", padding: "1px"}}>
						<span style={{fontSize: "0.8rem"}}>Load</span>
					</Button>&nbsp;
					<Button id={"createReply"} onClick={() => {createReply()}} variant="outline-primary" style={{width: "30%", maxWidth: "200px", padding: "1px"}}>
						<span style={{fontSize: "0.8rem"}}>등록</span>
					</Button>
				</div>

				<hr/>
			</div>

			{renderData}
		</Container>
	);
}

export default BoardReply;