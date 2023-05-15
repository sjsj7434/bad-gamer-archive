import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup';
import { Routes, Route, useNavigate } from "react-router-dom";
import CaseRegistration from '../../common/pages/CaseRegistration';

const LostarkMain = () => {
	const navigate = useNavigate();

	return(
		<Container style={{maxWidth: "1440px"}}>
			<Routes>
				<Route path="" element={<>
					<Tabs
						// onSelect={(key) => console.log(key)}
						defaultActiveKey="hot"
						id="uncontrolled-tab-example"
						className="mb-2"
					>
						<Tab eventKey="hot" title="Hot">
							<ListGroup variant="flush">
								<ListGroup.Item action onClick={() => {navigate('board/free/view/1')}}>Cras 233justo odio</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/free/view/2')}}>Dhfgapibus ac facilisis in</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/free/view/3')}}>fgh leo frisus</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/free/view/4')}}>Porta ac fghhfg ac</ListGroup.Item>
							</ListGroup>
							<div style={{display: "flex", flexDirection: "row-reverse"}}>
								<p onClick={() => {navigate("test1")}}>Go Detail1</p>
							</div>
						</Tab>
						<Tab eventKey="class" title="Class" mountOnEnter={true} unmountOnExit={false}>
							<ListGroup variant="flush">
								<ListGroup.Item action onClick={() => {navigate('board/free/view/5')}}>aAAsdsfs justo odio</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/free/view/6')}}>Dapibus ac facilisis in</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/free/view/7')}}>sdfsdf leo fgh</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/free/view/8')}}>Porsta ac fg ac</ListGroup.Item>
							</ListGroup>
							<div style={{display: "flex", flexDirection: "row-reverse"}}>
								<p onClick={() => {navigate("test1")}}>Go Detail2</p>
							</div>
						</Tab>
						<Tab eventKey="none" title="None" mountOnEnter={true} unmountOnExit={false}>
							<ListGroup variant="flush">
								<ListGroup.Item action onClick={() => {navigate('board/free/view/9')}}>ghtu5rdfdSDF sdf sdf </ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/free/view/10')}}>sssdf ac facilisis in</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/free/view/11')}}>sdsd leo ridxsus</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/free/view/12')}}>Psdfsdorta ac consectetur ac</ListGroup.Item>
							</ListGroup>
							<div style={{display: "flex", flexDirection: "row-reverse"}}>
								<p onClick={() => {navigate("test1")}}>Go Detail3</p>
							</div>
						</Tab>
					</Tabs>
				</>}></Route>

				<Route path="board/free/view/:code" element={<>
					<div>
						<h2>Title</h2>
						<hr></hr>
						<div>
							<p>hello, i am the contents</p>
							<p>this is interesting</p>
							<p>Good night</p>
						</div>
						<hr></hr>
					</div>

					<div>
						<h5>Replies</h5>
						<div>
							<textarea style={{width: "100%"}}></textarea>
						</div>
						<div>
							<p>ACE : hello, i am the hero</p>
						</div>
						<div>
							<p>CAT : sister, you are the one</p>
						</div>
						<hr></hr>
					</div>

					<div>
						<h5>List</h5>
						<div>
							<p>Did you see that? LOL</p>
						</div>
						<div>
							<p>Why my cat died yestderday, i found it</p>
						</div>
						<div>
							<p>Crazy Dog in my room</p>
						</div>
						<hr></hr>
					</div>

					<div style={{display: "flex", flexDirection: "row-reverse"}}>
						<span onClick={() => {navigate("board/free/write")}}>Write</span>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<span onClick={() => {navigate("/lostark")}}>To Main</span>
					</div>
				</>}></Route>
			</Routes>

			<Routes>
				<Route path="test1" element={<>1</>}></Route>
				<Route path="board/free/write" element={<><CaseRegistration /></>}></Route>
			</Routes>
		</Container>
	);
}

export default LostarkMain;