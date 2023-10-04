import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Routes, Route } from "react-router-dom";
import UpvoteTrend from './UpvoteTrend';
import DownvoteTrend from './DownvoteTrend';
import ViewTrend from './ViewTrend';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import '../../common/css/Carousel.css';

const LostarkMain = () => {
	const tabOnSelect = (tabKey) => {
		console.log("tabOnSelect", tabKey);
	}

	return(
		<Container style={{maxWidth: "1200px"}}>
			<Routes>
				<Route path="*" element={
					<>
						<Row>
							<Col>
								<Carousel pause="hover" style={{ backgroundColor: "#b7b7b7" }}>
									<Carousel.Item>
										<div className="carouselImageBox" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
											<Image src="https://img.megastudy.net/campus/library/v2015/library/yangji/banner/yj_2024_final_230821.jpg" fluid />
										</div>
									</Carousel.Item>
									<Carousel.Item>
										<div className="carouselImageBox" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
											<Image src="https://img.megastudy.net/campus/library/v2015/library/yangji/nsu/2024/2024_jaejung/tab01_img03_03.png" fluid />
										</div>
									</Carousel.Item>
									<Carousel.Item>
										<div className="carouselImageBox" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
											<Image src="https://img.megastudy.net/campus/library/v2015/library/yangji/nsu/2024/2024_jaejung/tab01_con01_img03.png" fluid />
										</div>
									</Carousel.Item>
								</Carousel>
							</Col>
						</Row>

						<hr/>
						
						<div style={{ backgroundColor: "#f3f3f3", padding: "0.5rem" }}>
							<Tabs
								onSelect={(key) => {tabOnSelect(key)}}
								defaultActiveKey="hot"
								className="mb-2"
								justify
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
						</div>
					</>
				}></Route>

				{/* <Route path="list/:category" element={<><Navigate to="1" replace={true} /></>}></Route> */}
			</Routes>
		</Container>
	);
}

export default LostarkMain;