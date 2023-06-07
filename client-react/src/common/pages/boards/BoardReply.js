import { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const BoardReply = (props) => {
	const [upvoteCount, setUpvoteCount] = useState(0);
	const [downvoteCount, setDownvoteCount] = useState(0);

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
	 * 댓글 작성
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

			// if(jsonData === null){
			// }
			// else{
			// }
		}
	}, [props.contentCode])

	/**
	 * 댓글 작성
	 */
	const createReply = useCallback(async () => {
		const replyDataElement = document.querySelector("#replyData");

		if(replyDataElement.value === ""){
			alert("내용을 입력해주세요");
			replyDataElement.focus();
			return;
		}

		const sendData = {
			parentCode: props.contentCode,
			content: replyDataElement.value,
			writer: "",
		}

		if(props.contentCode !== null){
			const fecthOption = {
				method: "POST"
				, body: JSON.stringify(sendData)
				, headers: {"Content-Type": "application/json",}
				, credentials: "include", // Don't forget to specify this if you need cookies
			};
			const jsonString = await fetch(`${process.env.REACT_APP_SERVER}/boards/reply/${props.contentCode}`, fecthOption);
			const jsonData = await parseStringToJson(jsonString);

			console.log("createdReply", jsonData)

			if(jsonData === null){
				alert("err");
			}
			else{
				alert("ok!");
			}
		}
	}, [props.contentCode])

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
		console.log("call replies")
		getReplies(1);
	}, [props.contentCode])

	return(
		<Container style={{maxWidth: "1440px"}}>
			<div>
				<Form>
					<Form.Group className="mb-3">
						<Form.Label>댓글 작성</Form.Label>
						<Form.Control id={"replyData"} as="textarea" rows={4} />
					</Form.Group>
				</Form>
				<div style={{display: "flex", justifyContent: "flex-end"}}>
					<Button id={"getReplies"} onClick={() => {getReplies(1)}} variant="outline-danger" style={{width: "30%", maxWidth: "200px", padding: "1px"}}>
						<span style={{fontSize: "0.8rem"}}>불러오기</span>
					</Button>&nbsp;&nbsp;
					<Button id={"createReply"} onClick={() => {createReply()}} variant="outline-primary" style={{width: "30%", maxWidth: "200px", padding: "1px"}}>
						<span style={{fontSize: "0.8rem"}}>등록</span>
					</Button>
				</div>

				<hr/>
			</div>
			<div style={{display: "flex", justifyContent: "center", fontSize: "0.6rem", paddingBottom: "5px", marginBottom: "5px", borderBottom: "1px solid lightgray"}}>
				<div style={{width: "80%"}}>
					<Image src="https://cdn-icons-png.flaticon.com/512/1211/1211612.png" roundedCircle style={{width: "2.2rem", height: "2.2rem", border: "1px solid lightgray", backgroundColor: "#fbecca"}} />
					&nbsp;
					<span style={{fontSize: "1rem", color: "black"}}>{"MyUser"}</span>
					&nbsp;
					<span style={{fontSize: "0.8rem", color: "lightgray"}}>{new Date().toLocaleString("sv-SE")}</span>
					<div style={{fontSize: "0.9rem"}}>
						상속된 열거 가능한 속성<br/>
						상속된 열거 가능한 속성상속된 열거 가능한 속성<br/>
						상속된 열거 가능한 속성상속된 열거 가능한 속성상속된 열거 가능한 속성
					</div>
				</div>
				<div style={{width: "20%"}}>
					<div style={{display: "flex", height: "100%", flexDirection: "column", justifyContent: "space-between"}}>
						<div style={{display: "flex", justifyContent: "flex-end"}}>
							<Button id={"deleteReply"} onClick={() => {voteReply("upvote")}} variant="outline-danger" style={{width: "40%", padding: "1px"}}>
								<span style={{fontSize: "0.6rem"}}>삭제</span>
							</Button>
						</div>
						<div style={{display: "flex", justifyContent: "flex-end"}}>
							<Button id={"upvoteReply"} onClick={() => {voteReply("upvote")}} variant="outline-success" style={{width: "40%", padding: "1px"}}>
								<span style={{fontSize: "0.6rem"}}>↑</span>
								<span style={{fontWeight: "800", fontSize: "0.6rem"}}>{1}</span>
							</Button>
							&nbsp;&nbsp;
							<Button id={"downvoteReply"} onClick={() => {voteReply("downvote")}} variant="outline-danger" style={{width: "40%", padding: "1px"}}>
								<span style={{fontSize: "0.6rem"}}>↓</span>
								<span style={{fontWeight: "800", fontSize: "0.6rem"}}>{2}</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}

export default BoardReply;