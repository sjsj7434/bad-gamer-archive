import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import ActivateLostark from './ActivateLostark';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

const MyPage = (props) => {
	const [waitModalShow, setWaitModalShow] = useState(false);
	const navigate = useNavigate();
	let mypageElements = <></>;
	console.log("MyPage", props.accountData);

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
				
				<Container style={{maxWidth: "1440px"}}>
					<h3>here is your personal page</h3>
					<br />
					status : {props.accountData.status}
					<br />
					id : {props.accountData.id}
					<br />
					nickname : {props.accountData.nickname}
					<br />
					lostA : {props.accountData.lostarkMainCharacter}
					<br />
					<Button onClick={() => {navigate("lostark")}}>lostark</Button>
					<br />

					<Routes>
						<Route path="lostark" element={<><ActivateLostark setWaitModalShow={setWaitModalShow} /></>}></Route>
						<Route path="*" element={<></>}></Route>
					</Routes>
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