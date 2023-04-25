import Container from 'react-bootstrap/Container';

const Wrapper = (props) => {
	//get Login info here and give props to child
	return (
		<Container style={{maxWidth: "1440px"}}>
			{props.innerElement}
		</Container>
	);
}

export default Wrapper;