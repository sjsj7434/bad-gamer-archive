import Container from 'react-bootstrap/Container';

const Wrapper = (props) => {
	return (
		<Container style={{maxWidth: "1440px"}}>
			{props.innerElement}
		</Container>
	);
}

export default Wrapper;