import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Routes, Route } from "react-router-dom";
import UpvoteTrend from './UpvoteTrend';
import DownvoteTrend from './DownvoteTrend';
import ViewTrend from './ViewTrend';

const LostarkMain = () => {
	const tabOnSelect = (tabKey) => {
		console.log("tabOnSelect", tabKey);
	}

	return(
		<Container style={{maxWidth: "1200px"}}>
			<Routes>
				<Route path="*" element={
					<>
						<Tabs
							onSelect={(key) => {tabOnSelect(key)}}
							defaultActiveKey="hot"
							id="uncontrolled-tab-example"
							className="mb-2"
						>
							<Tab eventKey="hot" title="뜨는 It" mountOnEnter={true} unmountOnExit={false}>
								<UpvoteTrend category={"over 10 upvote"}></UpvoteTrend>
							</Tab>
							<Tab eventKey="none" title="지는 It" mountOnEnter={true} unmountOnExit={false}>
								<DownvoteTrend category={"over 10 downvote"}></DownvoteTrend>
							</Tab>
							<Tab eventKey="class" title="시선집중" mountOnEnter={true} unmountOnExit={false}>
								<ViewTrend category={"over 100 views"}></ViewTrend>
							</Tab>
						</Tabs>
					</>
				}></Route>

				{/* <Route path="list/:category" element={<><Navigate to="1" replace={true} /></>}></Route> */}
			</Routes>
		</Container>
	);
}

export default LostarkMain;