import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Common.css';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

const Intro = () => {
	return (
		<Container style={{maxWidth: "750px", fontSize: "0.8rem"}}>
			<div style={{ marginBottom: "3rem" }}>
				<Card>
					<Card.Header>사이트 소개</Card.Header>
					<Card.Body>
						<Card.Text>
							게임 관련 커뮤니티들을 조사하여 따라만든 사이트입니다
						</Card.Text>
						<Card.Text>
							기존 사용자들이 불편함을 느끼거나 필요하다고 의견을 내는 부분들을 적용하려 개발하였습니다
						</Card.Text>
					</Card.Body>
				</Card>
			</div>

			<div style={{ marginBottom: "3rem" }}>
				<Card>
					<Card.Header>서버 구성</Card.Header>
					<Card.Body>
						<Card.Title>AWS EC2 & MySQL</Card.Title>
						<Card.Text>
							EC2 Ubuntu에 Nginx를 설치하여 사용하여 안정적인 서버 구축
						</Card.Text>
						<Card.Text>
							현재는 비용 때문에 한 개의 EC2에 웹서버와 DB가 설치되어 있지만 분리할 예정
						</Card.Text>
					</Card.Body>
				</Card>
			</div>

			<div style={{ marginBottom: "3rem" }}>
				<Card>
					<Card.Header>프론트엔드</Card.Header>
					<Card.Body>
						<Card.Title>React.js</Card.Title>
						<Card.Text>
							라우팅을 통하여 싱글 페이지 액션을 구현함, url 공유 및 즐겨찾기 가능하게 구현
						</Card.Text>
						<Card.Text>
							React Bootstrap과 기본적인 CSS를 사용하여 화면을 구성함
						</Card.Text>
					</Card.Body>
				</Card>
			</div>

			<div style={{ marginBottom: "3rem" }}>
				<Card>
					<Card.Header>백엔드</Card.Header>
					<Card.Body>
						<Card.Title>Nest.js</Card.Title>
						<Card.Text>
							서버에서 클라이언트가 보낸 값에 대한 검증과 특정 데이터들은 암호화를 진행함
						</Card.Text>
					</Card.Body>
				</Card>
			</div>
			
			<div style={{ marginBottom: "3rem" }}>
				<Accordion defaultActiveKey="">
					<Accordion.Item eventKey="0">
						<Accordion.Header>React.js를 사용한 이유</Accordion.Header>
						<Accordion.Body>
							<p>취업 시장에서 잘 먹힘</p>
							<p>커뮤니티가 큼</p>
							<p>공식 문서가 잘 구성되어있음</p>
							<p>JavaScript를 좋아함</p>
							<p>SPA에 관심이 있음</p>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>Nest.js를 사용한 이유</Accordion.Header>
						<Accordion.Body>
							<p>Node.js 기반의 프레임워크</p>
							<p>공식 문서가 잘 구성되어있음</p>
							<p>MVC 방식을 사용할 수 있음</p>
							<p>프레임워크에서 기본적으로 제공되는 많은 기능</p>
							<p>JavaScript를 좋아함</p>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="2">
						<Accordion.Header>AWS EC2를 사용한 이유</Accordion.Header>
						<Accordion.Body>
							<p>취업 시장에서 잘 먹힘</p>
							<p>커뮤니티가 큼</p>
							<p>안정적인 서버 관리</p>
							<p>전용 관리 페이지 제공</p>
							<p>유연한 서버 비용</p>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="3">
						<Accordion.Header>MySQL을 사용한 이유</Accordion.Header>
						<Accordion.Body>
							<p>커뮤니티가 큼</p>
							<p>무료 라이센스</p>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</div>
		</Container>
	);
}

export default Intro;