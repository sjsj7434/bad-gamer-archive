import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Common.css';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import { useEffect } from 'react';

const Intro = () => {
	useEffect(() => {
		const setAccessLog = async () => {
			const fecthOption = {
				method: "POST"
				, body: JSON.stringify({
					sizeData: `H=${window.innerHeight}|W=${window.innerWidth}`
				})
				, headers: {"Content-Type": "application/json",}
				, credentials: "include", // Don't forget to specify this if you need cookies
			};

			fetch(`/account/log/access`, fecthOption);
		}

		setAccessLog();
	}, [])

	return (
		<Container style={{maxWidth: "750px", fontSize: "0.8rem"}}>
			<div style={{ marginBottom: "3rem" }}>
				<div style={{ marginBottom: "3rem" }}>
					<div style={{ fontSize: "22px", marginBottom: "1rem" }}>
						<strong>😜 어서오세요!</strong>
					</div>
					<div>
						여러분을 위한 게임 커뮤니티입니다. 우리는 게임을 즐기는 이들의 의견을 중시하며, 다양한 게임 관련 커뮤니티들을 조사하여 사용자들이 더 편안하게 소통하고 정보를 공유할 수 있는 공간을 만들었습니다.
						<br/><br/>
						기존 사용자들의 피드백을 반영하여 사용자 중심의 디자인을 추구합니다. 불편한 점들을 찾아 개선하고, 새로운 기능들을 도입하여 누구나 쉽고 편리하게 이용할 수 있도록 노력하고 있습니다.
						<br/><br/>
						우리는 모바일 친화적인 디자인을 통해 사용자들이 언제 어디서나 편리하게 접속하여 참여할 수 있도록 최적화했습니다.
						함께 즐기며, 함께 만들어가는 게임 커뮤니티에 오신 것을 환영합니다!
					</div>
				</div>
			</div>
			
			<div style={{ marginBottom: "3rem" }}>
				<div style={{ marginBottom: "2rem" }}>
					<div style={{ fontSize: "22px", marginBottom: "1rem" }}>
						<strong>☁️ 클라우드의 강자, AWS EC2</strong>
					</div>
					<div>
						클라우드 컴퓨팅의 강자로 손꼽히는 AWS EC2 Ubuntu를 선택하여, 탁월한 성능, 안정성, 그리고 확장성을 자랑합니다.
						<br/>
						이 강력한 클라우드 솔루션을 통해 사용자들에게 언제나 부드러운 경험을 선사하고 있습니다.
					</div>
				</div>

				<div style={{ marginBottom: "2rem" }}>
					<div style={{ fontSize: "22px", marginBottom: "1rem" }}>
						<strong>🎨 React로 그려내는 모던한 세계</strong>
					</div>
					<div>
						인기 프론트엔드 기술 중 하나인 React를 활용하여 사용자들에게 모던하고 반응적인 인터페이스를 제공합니다.
						<br/>
						사용자들은 매끄럽고 빠른 인터랙션을 경험할 수 있습니다.
					</div>
				</div>
				
				<div style={{ marginBottom: "2rem" }}>
					<div style={{ fontSize: "22px", marginBottom: "1rem" }}>
						<strong>🧠 효율적이고 강력한 백엔드</strong>
					</div>
					<div>
						효율적이고 강력한 서버 사이드 애플리케이션을 위해 Nest.js를 선택했습니다.
						<br/>
						이는 구조적인 설계로 개발자들이 높은 생산성을 유지하면서도 강력한 기능을 구현할 수 있게 해줍니다.
					</div>
				</div>
				
				<div style={{ marginBottom: "2rem" }}>
					<div style={{ fontSize: "22px", marginBottom: "1rem" }}>
						<strong>🗃️ 신뢰성 있는 데이터베이스 관리</strong>
					</div>
					<div>
						데이터의 신뢰성과 안전을 중요시하기 때문에 MySQL을 선택하여 안정적이고 효율적인 데이터베이스 관리를 실현합니다.
					</div>
				</div>

				<div style={{ marginBottom: "2rem" }}>
					<div style={{ fontSize: "22px", marginBottom: "1rem" }}>
						<strong>🌐 웹 서버의 핵심, Nginx</strong>
					</div>
					<div>
						Nginx는 이 사이트의 핵심 웹 서버로 사용되어, 웹 애플리케이션의 안정성을 높입니다.
						<br/>
						높은 성능과 안정된 서비스를 제공합니다.
					</div>
				</div>
			</div>
			
			<div style={{ marginBottom: "3rem" }}>
				<Accordion defaultActiveKey="">
					<Accordion.Item eventKey="0">
						<Accordion.Header>React.js를 선택한 이유</Accordion.Header>
						<Accordion.Body>
							<strong>1. 취업 시장에서의 높은 수요</strong>
							<br/>
							여러 기업들이 React.js를 채용의 중요 요소로 고려하고 있어, 이 경험은 경쟁력으로 이어집니다
							<br/><br/>
							
							<strong>2. 커뮤니티의 규모</strong>
							<br/>
							React.js는 거대하고 활발한 커뮤니티를 가지고 있어 문제 해결이나 최적화에 있어서 풍부한 지식과 경험을 얻을 수 있어, 개발 및 운영 단계에서 큰 도움이 됩니다
							<br/><br/>

							<strong>3. 완성도 높은 공식 문서</strong>
							<br/>
							React.js의 공식 문서는 완성도가 높게 작성되어 있어 빠르게 개발에 착수하고, 필요한 정보를 정확하게 찾아 활용할 수 있습니다
							<br/><br/>
							
							<strong>4. React.js는 Single Page Application (SPA)를 구현하는 데 적합한 기술입니다</strong>
							<br/>
							SPA의 빠른 페이지 전환과 사용자 경험 향상에 초점을 두고 있어 실제로 경험하고 싶었고, React.js를 통해 이러한 현대적인 개발 패러다임을 경험할 수 있었습니다.
							<br/><br/>
							
							<strong>5. JavaScript를 좋아하는 개발자입니다</strong>
							<br/>
							React.js는 JavaScript와의 호환성을 갖춘 프레임워크로서 적합한 선택이었습니다.
							기존의 JavaScript 지식을 활용하여 프로젝트를 진행할 수 있었습니다
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>Nest.js를 선택한 이유</Accordion.Header>
						<Accordion.Body>
							<strong>1. 취업 시장에서의 높은 수요</strong>
							<br/>
							여러 기업들이 Node.js를 채용의 중요 요소로 고려하고 있어, 이 경험은 경쟁력으로 이어집니다
							<br/><br/>

							<strong>2. 커뮤니티의 규모</strong>
							<br/>
							Nest.js는 거대하고 활발한 커뮤니티를 가지고 있어 문제 해결이나 최적화에 있어서 풍부한 지식과 경험을 얻을 수 있어, 개발 및 운영 단계에서 큰 도움이 됩니다
							<br/><br/>
							
							<strong>3. 완성도 높은 공식 문서</strong>
							<br/>
							Nest.js의 공식 문서는 완성도가 높게 작성되어 있어 빠르게 개발에 착수하고, 필요한 정보를 정확하게 찾아 활용할 수 있습니다
							<br/><br/>

							<strong>4. 프레임워크에서 기본 제공되는 많은 기능</strong>
							<br/>
							Nest.js는 프레임워크에서 기본으로 제공하는 다양한 기능을 포함하고 있습니다.
							<br/>
							이는 보안, 로깅, 테스팅 등 다양한 측면에서 개발자에게 편의를 제공하여, 프로젝트의 전반적인 품질을 높입니다.
							<br/><br/>
							
							<strong>5. TypeScript & TypeORM</strong>
							<br/>
							TypeScript 및 TypeORM을 사용함으로써 타입 안정성과 데이터베이스 조작의 편리성을 얻을 수 있습니다.
							<br/>
							이는 개발 과정에서 발생할 수 있는 에러를 사전에 방지하고, 데이터베이스 조작을 보다 쉽게 처리할 수 있도록 도와줍니다
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="2">
						<Accordion.Header>AWS를 선택한 이유</Accordion.Header>
						<Accordion.Body>
							<strong>1. 취업 시장에서의 높은 수요</strong>
							<br/>
							여러 기업들이 AWS를 채용의 중요 요소로 고려하고 있어, 이 경험은 경쟁력으로 이어집니다
							<br/><br/>

							<strong>2. 커뮤니티의 규모</strong>
							<br/>
							AWS는 거대하고 활발한 커뮤니티를 가지고 있어 문제 해결이나 최적화에 있어서 풍부한 지식과 경험을 얻을 수 있어, 개발 및 운영 단계에서 큰 도움이 됩니다
							<br/><br/>
							
							<strong>3. 완성도 높은 공식 문서</strong>
							<br/>
							AWS의 공식 문서는 완성도가 높게 작성되어 있어 빠르게 개발에 착수하고, 필요한 정보를 정확하게 찾아 활용할 수 있습니다
							<br/><br/>

							<strong>4. 안정적인 서버 관리</strong>
							<br/>
							AWS EC2는 안정적이고 신뢰성 있는 서버 관리를 제공합니다
							<br/>
							사용자들은 언제나 안정적인 서비스를 기대할 수 있습니다
							<br/><br/>
							
							<strong>5. 유연한 서버 비용</strong>
							<br/>
							필요에 따라 인스턴스를 조정하고 비용을 최적화할 수 있어, 프로젝트의 요구에 맞게 유연하게 서버 리소스를 활용할 수 있습니다
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="3">
						<Accordion.Header>MySQL을 선택한 이유</Accordion.Header>
						<Accordion.Body>
							<strong>1. 커뮤니티의 규모</strong>
							<br/>
							MySQL은 거대하고 활발한 커뮤니티를 가지고 있어 문제 해결이나 최적화에 있어서 풍부한 지식과 경험을 얻을 수 있어, 개발 및 운영 단계에서 큰 도움이 됩니다
							<br/><br/>
							
							<strong>2. 무료 라이센스</strong>
							<br/>
							이는 프로젝트나 기업의 예산에 부담을 주지 않으면서 안정적이고 강력한 데이터베이스 시스템을 구축할 수 있는 장점을 제공합니다
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</div>
		</Container>
	);
}

export default Intro;