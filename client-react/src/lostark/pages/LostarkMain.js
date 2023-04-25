import { Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";

const LostarkMain = () => {
	const navigate = useNavigate();

	return(
		<Container style={{maxWidth: "1440px"}}>
			<h2>Here is LA</h2>
			
			<div style={{display: "flex"}}>
				<span onClick={() => {navigate("test1")}}>site 1</span>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<span onClick={() => {navigate("test2")}}>site 2</span>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<span onClick={() => {navigate("test3")}}>site 3</span>
			</div>
			<Routes>
				<Route path="" element={<><div>main</div></>}></Route>
				<Route path="test1" element={<><div>HERE IS SITE 1</div></>}></Route>
				<Route path="test2" element={<><div>HERE IS SITE 2</div></>}></Route>
				<Route path="*" element={<><div>NOTHING</div></>}></Route>
			</Routes>
		</Container>
	);
}

export default LostarkMain;