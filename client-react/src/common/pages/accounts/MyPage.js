import Container from 'react-bootstrap/Container';

const MyPage = (props) => {
	return (
		<Container style={{maxWidth: "1440px"}}>
			MINE
			<br></br>
			{props.data}
			<br></br>
			얘는 topmenu에서 props 어떻게 받지?
		</Container>
	);
}

export default MyPage;