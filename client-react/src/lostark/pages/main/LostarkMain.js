import Container from 'react-bootstrap/Container';
import { Routes, Route } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import TrendUnknownPost from './trend/TrendUnknownPost';
import TrendKnownPost from './trend/TrendKnownPost';

const LostarkMain = () => {
	return(
		<Container style={{maxWidth: "1200px"}}>
			<Routes>
				<Route path="*" element={
					<>
						<Row>
							<Col>
								<Carousel pause="hover" style={{ backgroundColor: "#d1d1d1", borderRadius: "8px", padding: "4px" }}>
									<Carousel.Item>
										<div className="carouselImageBox" style={{ display: "flex", justifyContent: "center", overflow: "hidden", borderRadius: "8px" }}>
											<Image src="https://cdn-lostark.game.onstove.com/2023/event/231220_event_i1LffNbk/images/pc/@bg_index.jpg?228a0c97850b58e6f6e428f42a63a898" style={{ borderRadius: "4px" }} />
										</div>
									</Carousel.Item>
									<Carousel.Item>
										<div className="carouselImageBox" style={{ display: "flex", justifyContent: "center", overflow: "hidden", borderRadius: "8px" }}>
											<Image src="https://cdn-lostark.game.onstove.com/2023/event/231220_express_bXr4SyAk/images/pc/@bg_index.jpg?2769e5926b3fdc7740b252877f94670b" style={{ borderRadius: "4px" }} />
										</div>
									</Carousel.Item>
									<Carousel.Item>
										<div className="carouselImageBox" style={{ display: "flex", justifyContent: "center", overflow: "hidden", borderRadius: "8px" }}>
											<Image src="https://cdn-lostark.game.onstove.com/2023/event/231220_pcbang_eG5UhyvO/images/pc/@bg_index.jpg?2199f41e727680e092368eab51570b4b" style={{ borderRadius: "4px" }} />
										</div>
									</Carousel.Item>
								</Carousel>
							</Col>
						</Row>

						<div style={{ backgroundColor: "", padding: "0.5rem", marginTop: "3rem", overflow: "hidden", minHeight: "360px" }}>
							<TrendUnknownPost />
						</div>

						<div style={{ backgroundColor: "", padding: "0.5rem", marginTop: "3rem", overflow: "hidden", minHeight: "360px" }}>
							<TrendKnownPost />
						</div>

						<div style={{ marginBottom: "10rem" }}></div>
					</>
				}></Route>

				{/* <Route path="list/:category" element={<><Navigate to="1" replace={true} /></>}></Route> */}
			</Routes>
		</Container>
	);
}

export default LostarkMain;