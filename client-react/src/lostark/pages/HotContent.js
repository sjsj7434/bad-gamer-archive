import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";

const HotContent = (props) => {
	const navigate = useNavigate();

	return(
		<Container style={{maxWidth: "1440px"}}>
			category : {props.category}
		</Container>
	);
}

export default HotContent;