import Container from 'react-bootstrap/Container';

const Wrapper = (props) => {
	// get Login info here and give props to child
	// @ 상위 -> 하위시, props로 데이터 전달
	// @ 하위 -> 상위시, props로 실행할 함수를 하위로 전달하고 하위에서 실행. 이때 무한루프에 빠지지 않도록 주의한다.
	return (
		<Container style={{maxWidth: "1440px"}}>
			{props.innerElement}
		</Container>
	);
}

export default Wrapper;