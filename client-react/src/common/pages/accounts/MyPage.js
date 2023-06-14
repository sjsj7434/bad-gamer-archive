import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import ActivateLostark from './ActivateLostark';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';

const MyPage = (props) => {
	const [waitModalShow, setWaitModalShow] = useState(false);
	const navigate = useNavigate();
	let mypageElements = <></>;
	console.log("MyPage", props.accountData);

	useEffect(() => {
		console.log("let's get account info from server");
	}, [])

	if(props.accountData.status === "using"){
		mypageElements = (
			<>
				<Modal
					show={waitModalShow}
					backdrop="static"
					keyboard={false}
					centered
				>
					<Modal.Body>
						<div style={{display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "50px", marginBottom: "50px"}}>
							<Spinner animation="grow" variant="success" />&nbsp;&nbsp;<h4>로딩 창 통합하자</h4>
						</div>
					</Modal.Body>
				</Modal>
				
				<Container style={{maxWidth: "600px"}}>
					<div style={{paddingLeft: "10px", paddingRight: "10px", fontSize: "0.8rem"}}>
						<h3>here is your personal page</h3>

						<Table hover>
							<colgroup>
								<col width="25%" style={{fontSize: "20px"}} />
								<col width="5%" />
								<col width="*" />
							</colgroup>
							<tbody>
								<tr>
									<th>현재 상태</th>
									<td><div className="vr"></div></td>
									<td>{props.accountData.status}</td>
								</tr>
								<tr>
									<th>아이디</th>
									<td><div className="vr"></div></td>
									<td>{props.accountData.id}</td>
								</tr>
								<tr>
									<th>닉네임</th>
									<td><div className="vr"></div></td>
									<td>{props.accountData.nickname}</td>
								</tr>
								<tr>
									<th>이메일</th>
									<td><div className="vr"></div></td>
									<td>{props.accountData.nickname}</td>
								</tr>
								<tr>
									<th>LA</th>
									<td><div className="vr"></div></td>
									<td>
										{props.accountData.lostarkMainCharacter === null ? "정보 없음" : props.accountData.lostarkMainCharacter}
										<Button onClick={() => {navigate("lostark")}}>lostark</Button>
									</td>
								</tr>
							</tbody>
						</Table>

						<Stack direction="horizontal" gap={3}>
							<Button onClick={() => {navigate("lostark")}}>닉네임 변경</Button>
							<Button onClick={() => {navigate("lostark")}}>비밀번호 변경</Button>
						</Stack>

						<Routes>
							<Route path="lostark" element={<><ActivateLostark setWaitModalShow={setWaitModalShow} /></>}></Route>
							<Route path="*" element={<></>}></Route>
						</Routes>
					</div>
				</Container>
			</>
		);
	}
	else{
		mypageElements = (
			<>
				<Navigate to="/accounts/signin" replace={true} />
				You have to Login
			</>
		)
	}

	return mypageElements;
}

export default MyPage;