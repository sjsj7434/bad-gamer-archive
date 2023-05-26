import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Routes, Route, useNavigate } from "react-router-dom";
import HotContent from './HotContent';

const LostarkMain = () => {
	const navigate = useNavigate();

	const tabOnSelect = (tabKey) => {
		console.log(tabKey);
	}

	return(
		<Container style={{maxWidth: "1440px"}}>
			<Routes>
				<Route path="*" element={<>
					<Tabs
						onSelect={(key) => {tabOnSelect(key)}}
						defaultActiveKey="hot"
						id="uncontrolled-tab-example"
						className="mb-2"
					>
						<Tab eventKey="hot" title="Hot" mountOnEnter={true} unmountOnExit={false}>
							<HotContent category={"hot"}></HotContent>
						</Tab>
						<Tab eventKey="class" title="Class" mountOnEnter={true} unmountOnExit={false}>
							<HotContent category={"cool"}></HotContent>
						</Tab>
						<Tab eventKey="none" title="not_verified" mountOnEnter={true} unmountOnExit={false}>
							<HotContent category={"warm"}></HotContent>
						</Tab>
					</Tabs>
				</>}></Route>

				{/* <Route path="list/:category" element={<><Navigate to="1" replace={true} /></>}></Route> */}
			</Routes>
		</Container>
	);
}

export default LostarkMain;