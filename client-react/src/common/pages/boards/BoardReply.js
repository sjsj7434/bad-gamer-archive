import Container from 'react-bootstrap/Container';

const BoardReply = (props) => {
	return(
		<Container style={{maxWidth: "1440px"}}>
			<div>
				<h5>[*] Replies from contentCode: {props.contentCode}</h5>
			</div>
			<div>
				<p>-<b>ISMS</b> : 캠퍼스 학원관리자 중복로그인 제한조치 안내</p>
				<p>-<b>중요</b> : IE(Internet Explorer) 종료(6/15)관련 AMS 이용안내</p>
				<p>-<b>LIVE EDITOR</b> : Some quick example text to build on the card title and make up the bulk of the card's content.</p>
			</div>
		</Container>
	);
}

export default BoardReply;