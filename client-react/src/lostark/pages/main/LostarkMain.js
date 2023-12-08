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