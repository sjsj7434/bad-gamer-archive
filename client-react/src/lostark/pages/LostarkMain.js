import Container from 'react-bootstrap/Container';
import { Routes, Route, useNavigate } from "react-router-dom";
import CaseRegistration from '../../common/pages/CaseRegistration';

const LostarkMain = () => {
	const navigate = useNavigate();

	return(
		<Container style={{maxWidth: "1440px"}}>
			<div style={{display: "flex"}}>
				<span onClick={() => {navigate("test1")}}>List</span>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<span onClick={() => {navigate("test2")}}>Write</span>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<span onClick={() => {navigate("test3")}}>None</span>
			</div>
			
			<Routes>
				<Route path="" element={<><div>main</div></>}></Route>
				<Route path="test1" element={<><div>HERE IS your list</div></>}></Route>
				<Route path="test2" element={<><CaseRegistration /></>}></Route>
				<Route path="*" element={<><div>NOTHING</div></>}></Route>
			</Routes>
		</Container>
	);
}

export default LostarkMain;