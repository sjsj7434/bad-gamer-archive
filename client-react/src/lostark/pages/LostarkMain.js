import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import BoardWrite from '../../common/pages/BoardWrite';
import BoardView from '../../common/pages/BoardView';
import BoardList from '../../common/pages/BoardList';

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
								<ListGroup.Item action onClick={() => {navigate('board/view/1')}}>Cras 233justo odio</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/view/2')}}>Dhfgapibus ac facilisis in</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/view/3')}}>fgh leo frisus</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/view/4')}}>Porta ac fghhfg ac</ListGroup.Item>
							</ListGroup>
							<div style={{display: "flex", flexDirection: "row-reverse"}}>
								<p onClick={() => {navigate("test1")}}>Go Detail1</p>
							</div>
						</Tab>
						<Tab eventKey="class" title="Class" mountOnEnter={true} unmountOnExit={false}>
							<ListGroup variant="flush">
								<ListGroup.Item action onClick={() => {navigate('board/view/5')}}>aAAsdsfs justo odio</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/view/6')}}>Dapibus ac facilisis in</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/view/7')}}>sdfsdf leo fgh</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/view/8')}}>Porsta ac fg ac</ListGroup.Item>
							</ListGroup>
							<div style={{display: "flex", flexDirection: "row-reverse"}}>
								<p onClick={() => {navigate("test1")}}>Go Detail2</p>
							</div>
						</Tab>
						<Tab eventKey="none" title="not_verified" mountOnEnter={true} unmountOnExit={false}>
							<ListGroup variant="flush">
								<ListGroup.Item action onClick={() => {navigate('board/view/9')}}>ghtu5rdfdSDF sdf sdf </ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/view/10')}}>sssdf ac facilisis in</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/view/11')}}>sdsd leo ridxsus</ListGroup.Item>
								<ListGroup.Item action onClick={() => {navigate('board/view/12')}}>Psdfsdorta ac consectetur ac</ListGroup.Item>
							</ListGroup>
							<div style={{display: "flex", flexDirection: "row-reverse"}}>
								<p onClick={() => {navigate("list/anonymous/1")}}>Go Detail3</p>
							</div>
						</Tab>
					</Tabs>

					<div style={{display: "flex", flexDirection: "row-reverse"}}>
						<span onClick={() => {navigate("/lostark/board/write/anonymous")}}>Write</span>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<span onClick={() => {navigate("/lostark")}}>To Main</span>
					</div>
				</>}></Route>

				<Route path="board/view/:contentCode" element={<><BoardView></BoardView></>}></Route>
				<Route path="list/:category/:page" element={<><BoardList></BoardList></>} errorElement={<div>ERROR!!!</div>}></Route>
				{/* <Route path="list/:category" element={<><Navigate to="1" replace={true} /></>}></Route> */}
			</Routes>

			<Routes>
				<Route path="board/write/anonymous" element={<>
					<BoardWrite />
					<div style={{display: "flex", flexDirection: "row-reverse"}}>
						<span onClick={() => {navigate("/lostark")}}>To Main</span>
					</div>
				</>}></Route>
			</Routes>
		</Container>
	);
}

export default LostarkMain;