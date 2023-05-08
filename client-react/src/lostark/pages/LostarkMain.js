import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup';
import { Routes, Route, useNavigate } from "react-router-dom";
import CaseRegistration from '../../common/pages/CaseRegistration';
import Test from './Test'

const LostarkMain = () => {
	const navigate = useNavigate();

	return(
		<Container style={{maxWidth: "1440px"}}>
			<Tabs
				// onSelect={(key) => console.log(key)}
				defaultActiveKey="hot"
				id="uncontrolled-tab-example"
				className="mb-2"
			>
				<Tab eventKey="hot" title="Hot">
					<ListGroup variant="flush">
						<ListGroup.Item>Cras justo odio</ListGroup.Item>
						<ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
						<ListGroup.Item>Morbi leo risus</ListGroup.Item>
						<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
					</ListGroup>
				</Tab>
				<Tab eventKey="class" title="Class" mountOnEnter={true} unmountOnExit={false}>
					<Test text={"Class"}></Test>
				</Tab>
				<Tab eventKey="none" title="None" mountOnEnter={true} unmountOnExit={false}>
					<Test text={"None"}></Test>
				</Tab>
			</Tabs>

			<div style={{display: "flex"}}>
				<span onClick={() => {navigate("test1")}}>List</span>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<span onClick={() => {navigate("test2")}}>Write</span>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<span onClick={() => {navigate("test3")}}>None</span>
			</div>
			
			<Routes>
				<Route path="" element={<><div>main</div></>}></Route>
				<Route path="test1" element={<><Test text={"file"}></Test></>}></Route>
				<Route path="test2" element={<><CaseRegistration /></>}></Route>
				<Route path="*" element={<><div>NOTHING</div></>}></Route>
			</Routes>
		</Container>
	);
}

export default LostarkMain;